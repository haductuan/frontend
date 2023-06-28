import {
  Box,
  Button,
  Checkbox,
  Grid,
  Paper,
  Typography,
  CircularProgress,
  Dialog,
  TablePagination,
  TableCell,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableSortLabel,
} from "@mui/material";
import axios from "axios";
import { auth, utils as zidenUtils } from "@zidendev/zidenjs";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { useIssuerContext } from "src/context/issuerContext";
import { truncateString } from "src/utils/wallet/walletUtils";
import SearchBar from "src/components/SearchBar";
import { useIdWalletContext } from "src/context/identity-wallet-context";
import { LoadingButton } from "@mui/lab";
import { EmptyIcon } from "src/constants/icon";
import { userType } from "src/constants";

const headers = [
  { id: "no", label: "No" },
  { id: "claim_id", label: "Claim ID" },
  { id: "schema_hash", label: "Schema hash" },
  { id: "create_date", label: "Create date" },
  { id: "holder_id", label: "Holder ID" },
];
const Revocation = (props: any) => {
  //const
  const jwz = localStorage.getItem("ziden-db/issuer-jwz");
  //context
  const { endpointUrl, issuerID } = useIssuerContext();
  const { keyContainer, isUnlocked, userId } =
    useIdWalletContext();
  const { enqueueSnackbar } = useSnackbar();
  // state
  const [checked, setChecked] = useState<Array<string>>([]);
  const [revNonces, setRevNonces] = useState<Array<any>>([]);
  const [loading, setLoading] = useState(false);
  const [loadingConfirm, setLoadingConfirm] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [open, setOpen] = useState(false);
  const [rowsPerpage, setRowsPerPage] = useState(6);
  const [page, setPage] = useState(0);
  const [dialogData, setDialogData] = useState<Array<any>>([]);
  const [order, setOrder] = useState<"asc" | "desc" | undefined>("desc");
  const [sortBy, setSortBy] = useState("create_date");
  const [allTableData, setAllTableData] = useState<Array<any>>([]);
  const [tableData, setTableData] = useState<Array<any>>([]);
  //function
  const handleCloseDetailModal = () => {
    setOpen(false);
  };
  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    if (newRowsPerPage <= tableData.length) {
      setRowsPerPage(newRowsPerPage);
      setPage(0);
    }
  };
  const handleChange = (item: string, revNonce: string, add: boolean) => {
    if (!add) {
      setChecked((prev: any) => {
        return prev.filter((arrayItem: string) => {
          return arrayItem !== item;
        });
      });
      setRevNonces((prev: Array<any>) => {
        return prev.filter((arrayItem: any) => {
          return arrayItem.id !== item;
        });
      });
    }
    if (add) {
      setChecked((prev: Array<string>) => {
        return [...prev, item];
      });
      setRevNonces((prev: Array<any>) => {
        return [
          ...prev,
          {
            id: item,
            revNonce: revNonce,
          },
        ];
      });
    }
  };
  const handleCheckBoxClick = (e: any, claimID: string, revNonce: string) => {
    handleChange(claimID, revNonce, e.target.checked);
    e.stopPropagation();
  };
  const handleUpdate = async () => {
    props.setRefresh((prev: number) => prev + 1);
    // setIsUpdating(false);
  };
  const handleSort = (typeID: string) => {
    setPage(0);
    if (sortBy !== typeID) {
      setSortBy(typeID);
    } else {
      setOrder((prev) => {
        if (prev === "asc") {
          return "desc";
        } else {
          return "asc";
        }
      });
    }
  };
  const compare = (a: any, b: any) => {
    if (a === b) return 0;
    if (a < b) {
      return order === "asc" ? -1 : 1;
    } else {
      return order === "asc" ? 1 : -1;
    }
  };
  const fetchData = React.useCallback(async () => {
    const userId = localStorage.getItem("ziden-db/issuer-id");
    if (endpointUrl && userId) {
      try {
        setLoading(true);
        const result = await axios.get(`${endpointUrl}/claims`, {
          params: { status: ["ACTIVE"], issuerId: userId },
          headers: {
            Authorization: `${jwz}`,
          },
        });

        const resultData = result.data?.map((item: any, index: number) => {
          // var dataRow = [];
          const no = index + 1;
          return {
            no: no,
            id: item.claimId,
            claim_id: item.claimId,
            schema_hash: item.schemaHash,
            create_date: item.createAt,
            holder_id: item.holderId,
            revNonce: item.revNonce,
            hidden: [0],
          };
        });
        setAllTableData(resultData);
        setTableData(resultData);
        setLoading(false);
      } catch (err) {
        setLoading(false);
      }
    }
  }, [endpointUrl, jwz]);
  const pushToBlockChain = async () => {
    try {
      const userId = localStorage.getItem("ziden-db/issuer-id");
      const result = await axios.get(
        `${endpointUrl}/claims/revoke-challenge/${userId}`,
        {
          headers: {
            Authorization: `${jwz}`,
          },
        }
      );
      if (!result.data?.challenge || result.data?.challenge === "0") {
        setLoadingConfirm(false);
        return;
      } else {
        const challenge = result.data?.challenge;
        if (!isUnlocked) {
          enqueueSnackbar("Please unlock your wallet!", {
            variant: "warning",
          });
          setLoadingConfirm(false);
          return;
        }
        let sig;
        
        const challengeBigint = BigInt(challenge);
        const privateKeyHex = keyContainer.getKeyDecrypted().privateKey;
        const privateKey = zidenUtils.hexToBuffer(privateKeyHex, 32);
        const signature = await auth.signChallenge(
          privateKey,
          challengeBigint
        );
        sig = {
          challenge: challenge,
          challengeSignatureR8x: signature.challengeSignatureR8x.toString(),
          challengeSignatureR8y: signature.challengeSignatureR8y.toString(),
          challengeSignatureS: signature.challengeSignatureS.toString(),
        };
        
        const resultPublish = await axios.post(
          `${endpointUrl}/claims/revoke/${userId}`,
          {
            signature: sig,
          },
          {
            headers: {
              Authorization: `${jwz}`,
              "Content-Type": "application/json",
              accept: "application/json",
            },
          }
        );
        if (resultPublish.data) {
          enqueueSnackbar("Revoke success!", {
            preventDuplicate: true,
            variant: "success",
          });
          setRevNonces([]);
          props.setRefresh((prev: number) => prev + 1);
        } else {
          enqueueSnackbar("Revoke failed!", {
            preventDuplicate: true,
            variant: "error",
          });
        }
      }
    } catch (err) {
      setLoadingConfirm(false);
    }
    setLoadingConfirm(false);
  };
  const handleRevoke = async () => {
    setLoadingConfirm(true);
    const userId = localStorage.getItem("ziden-db/issuer-id");
    const resRevNonce = await axios.post(
      `${endpointUrl}/claims/revoke-list/${userId}`,
      {
        revNonces: revNonces.map((item: any) => item.revNonce),
      },
      {
        headers: {
          Authorization: `${jwz}`,
        },
      }
    );

    if (resRevNonce.data?.claims?.length > 0) {
      await pushToBlockChain();
      setShowConfirm(false);
      props.setRefresh((prev: number) => prev + 1);
    } else {
      enqueueSnackbar("Revoke failed!", {
        variant: "error",
      });
      setLoadingConfirm(false);
    }
  };
  const handleConfirmRevoke = () => {
    if (revNonces?.length === 0) {
      enqueueSnackbar("Nothing to revoke!", {
        variant: "warning",
      });
      return;
    }
    setShowConfirm(true);
  };
  const handleClose = () => {
    setShowConfirm(false);
  };
  const handleToggleCheckAll = (checked: boolean) => {
    if (checked) {
      //uncheck all
      setChecked([]);
      setRevNonces([]);
    } else {
      setChecked(
        tableData.map((item: any) => {
          return item.id;
        })
      );
      setRevNonces(
        tableData.map((item: any) => {
          return { id: item.id, revNonce: item.revNonce };
        })
      );
    }
  };
  useEffect(() => {
    fetchData();
  }, [props.refresh, fetchData]);
  useEffect(() => {
    setPage(0);
  }, [tableData]);
  return (
    <Paper
      sx={{
        my: 2,
        borderRadius: 3,
      }}
    >
      <Dialog
        PaperProps={{
          style: {
            borderRadius: "10px",
          },
        }}
        open={showConfirm}
        onClose={handleClose}
      >
        <Box
          sx={{
            p: 2,
            minWidth: "350px",
          }}
        >
          <Typography
            variant="body1"
            color="text.secondary"
          >{`Confirm revoking ${revNonces?.length} claims?`}</Typography>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-end",
              alignItems: "center",
              mt: 4,
            }}
          >
            <Button
              onClick={handleClose}
              variant="outlined"
              color="primary"
              sx={{ mr: 1 }}
            >
              No
            </Button>
            <Button
              onClick={() => {
                handleRevoke();
              }}
              variant="contained"
              color="primary"
              disabled={loadingConfirm}
            >
              {loadingConfirm ? (
                <CircularProgress
                  size={"1.5rem"}
                  sx={{
                    color: "#FFFFFF",
                  }}
                />
              ) : (
                "Confirm"
              )}
            </Button>
          </Box>
        </Box>
      </Dialog>
      <Dialog
        sx={{
          "& .MuiPaper-root.MuiDialog-paper": {
            borderRadius: 3,
          },
        }}
        open={open}
        onClose={handleCloseDetailModal}
      >
        <Paper
          sx={{
            p: 3,
            borderRadius: 4,
          }}
        >
          <Typography mb={2} variant="h3">
            Details
          </Typography>
          {dialogData.map((item: any, index: number) => {
            return (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "flex-start",
                  alignItems: "center",
                  height: "40px",
                }}
                key={index}
              >
                <Typography
                  variant="body2"
                  sx={{
                    minWidth: {
                      xs: "100px",
                      xsm: "150px",
                    },
                  }}
                  color="secondary"
                  flexWrap={"wrap"}
                >
                  {item.key}
                </Typography>
                <Typography
                  noWrap
                  fontWeight={500}
                  variant="body2"
                  color="text.secondary"
                >
                  {item.key === "Create date"
                    ? new Date(item.value).toDateString()
                    : item.value}
                </Typography>
              </Box>
            );
          })}
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <Button
              onClick={handleCloseDetailModal}
              variant="outlined"
              color="primary"
            >
              Close
            </Button>
          </Box>
        </Paper>
      </Dialog>
      <Grid
        container
        sx={{
          px: 4,
        }}
      >
        <Grid
          item
          xs={12}
          xsm={8}
          md={8}
          lg={6}
          sx={{
            py: 3,
          }}
        >
          <SearchBar
            searchCateGories={headers}
            allData={allTableData}
            setTableData={setTableData}
            hidden={[0, 3]}
          />
        </Grid>
        <Grid item xs={12} xsm={4} md={4} lg={6}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "flex-end",
              height: "100%",
            }}
          >
            <Button
              sx={{
                mb: {
                  xs: 3,
                  xsm: 0,
                },
                width: {
                  xs: "100%",
                  xsm: "auto",
                },
              }}
              variant="contained"
              color="secondary"
              onClick={handleUpdate}
            >
              Refresh data
            </Button>
          </Box>
        </Grid>
      </Grid>
      {!loading && (
        <>
          <TableContainer
            sx={{
              "& .MuiTableRow-head": {
                backgroundColor: "#EDF3FC",
              },
              "& .MuiTableCell-root": {
                borderBottom: "none",
              },
              "& .MuiTableCell-root:first-of-type": {
                pl: 4,
                textAlign: "left",
              },
              "& .MuiTableCell-root:last-of-type": {
                pr: 4,
                textAlign: "left",
                display: "flex",
                // justifyContent: "flex-end",
              },
              // "& .MuiTableCell-root:nth-child": {},
            }}
          >
            <Table style={{ minWidth: "900px" }}>
              <TableHead>
                <TableRow>
                  <TableCell>
                    {" "}
                    <Checkbox
                      sx={{
                        height: "16px",
                        my: 0,
                      }}
                      disabled={userId !== issuerID}
                      checked={checked.length === tableData.length}
                      onClick={(e: any) => {
                        handleToggleCheckAll(
                          checked?.length === tableData?.length
                        );
                      }}
                    />
                  </TableCell>
                  {headers.map((item, index: number) => {
                    return (
                      <TableCell key={index + item.id} sortDirection="asc">
                        <TableSortLabel
                          active={sortBy === item.id}
                          direction={order}
                          onClick={(e) => handleSort(item.id)}
                        >
                          {item.label}
                        </TableSortLabel>
                      </TableCell>
                    );
                  })}
                </TableRow>
              </TableHead>
              <TableBody>
                {tableData
                  ?.sort((a, b) => {
                    return compare(a[sortBy], b[sortBy]);
                  })
                  ?.slice(page * rowsPerpage, (page + 1) * rowsPerpage)
                  ?.map((item, index: number) => {
                    return (
                      <TableRow
                        key={item.id + index}
                        hover
                        onClick={(e: any) => {
                          var dialogData: Array<any> = [];
                          headers.map((dataCell, index: number) => {
                            return dialogData.push({
                              key: dataCell.label,
                              value: item[dataCell.id],
                            });
                          });
                          setDialogData(dialogData);
                          setOpen(true);
                        }}
                      >
                        <TableCell>
                          <Checkbox
                            sx={{
                              height: "16px",
                              my: 0,
                            }}
                            disabled={userId !== issuerID}
                            checked={checked.includes(item.id)}
                            onClick={(e: any) => {
                              handleCheckBoxClick(e, item.id, item.revNonce);
                            }}
                          />
                        </TableCell>
                        {headers.map((cellData: any, index: number) => {
                          return (
                            <TableCell key={index}>
                              <Typography
                                variant="body2"
                                color={"text.secondary"}
                              >
                                {cellData.id === "create_date"
                                  ? truncateString(
                                      new Date(
                                        item[cellData.id]
                                      ).toDateString(),
                                      20
                                    )
                                  : truncateString(item[cellData.id], 25)}
                              </Typography>
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>
          {tableData?.length === 0 && (
            <Box
              sx={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                py: 2,
              }}
            >
              <EmptyIcon />
              <Typography variant="h4" fontWeight={700}>
                Empty
              </Typography>
            </Box>
          )}
          <Box sx={{ borderBottom: "1px solid #D1D3D5" }} />
        </>
      )}
      {loading && (
        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <CircularProgress />
        </Box>
      )}
      <Box
        sx={{
          px: 4,
          pt: 3,
          pb: 3,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: {
              xs: "column-reverse",
              sm: "row",
            },
            justifyContent: "space-between",
          }}
        >
          <LoadingButton
            loading={loadingConfirm}
            variant="contained"
            color="primary"
            sx={{
              mr: 2,
              my: 1,
              height: "36px",
            }}
            onClick={() => {
              handleConfirmRevoke();
            }}
            disabled={userId !== issuerID}
          >
            Revoke claims
          </LoadingButton>
          <TablePagination
            component="div"
            count={tableData?.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerpage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 6, 8, 10, 15, 20, 30, 50]}
          />
        </Box>
      </Box>
    </Paper>
  );
};
export default Revocation;
