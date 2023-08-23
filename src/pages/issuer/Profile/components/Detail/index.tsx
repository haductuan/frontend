import { LoadingButton } from "@mui/lab";
import {
  Box,
  Button,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  TableContainer,
  Dialog,
  TextField,
  Avatar,
  Tooltip,
} from "@mui/material";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import Header from "src/components/Header";
import { PlusIcon } from "src/constants/icon";
import { useIdWalletContext } from "src/context/identity-wallet-context";
import { useIssuerContext } from "src/context/issuerContext";
import { validateJWZ } from "src/utils/auth";
import { truncateString } from "src/utils/wallet/walletUtils";
import EditInfoForm from "../EditInfoForm";
const Detail = () => {
  const { isUnlocked, keyContainer } = useIdWalletContext();
  const { enqueueSnackbar } = useSnackbar();
  const {
    endpointUrl,
    profile,
    numPublished,
    numHolder,
    issuerID,
    operators,
    fetchOperator,
    fetchIssuerMetaData,
  } = useIssuerContext();
  const [removeId, setRemoveId] = useState("");
  const [openDialogId, setOpenDialogId] = useState(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [addID, setAddID] = useState("");
  const history = useHistory();
  const handleLogout = async () => {
    keyContainer.db.delete("issuer-jwz");
    keyContainer.db.delete("issuer-id");
    history.push("/issuer/profile/signin");
  };
  const handleOpenDialog = (id: number) => {
    setOpenDialogId(id);
  };
  const handleCloseDialogId = () => {
    setOpenDialogId(0);
  };
  const handleRemove = async (id: string) => {
    setLoading(true);
    try {
      const jwz: any = localStorage.getItem("ziden-db/issuer-jwz") || "";
      const res = await axios.delete(
        endpointUrl + `/issuers/${issuerID}/operators/${id}`,
        {
          headers: {
            Authorization: jwz,
          },
        }
      );
      if (res.data) {
        enqueueSnackbar("Success!", {
          autoHideDuration: 2000,
          preventDuplicate: true,
          variant: "success",
        });
      } else {
        enqueueSnackbar("Failed!", {
          autoHideDuration: 2000,
          preventDuplicate: true,
          variant: "error",
        });
      }
    } catch (err) {}
    setRemoveId("");
    await fetchOperator();
    setLoading(false);
    handleCloseDialogId();
  };
  const remove = (id: string) => {
    setRemoveId(id);
    handleOpenDialog(1);
  };
  const handleAdd = async () => {
    if (!addID) {
      enqueueSnackbar("Please enter ID!", {
        autoHideDuration: 2000,
        preventDuplicate: true,
        variant: "warning",
      });
      return;
    }
    setLoading(true);
    try {
      const jwz: any = localStorage.getItem("ziden-db/issuer-jwz") || "";
      const res = await axios.post(
        endpointUrl + `/issuers/${issuerID}/operators`,
        {
          operatorId: addID,
        },
        {
          headers: {
            Authorization: jwz,
          },
        }
      );
      if (res.data) {
        enqueueSnackbar("Success!", {
          autoHideDuration: 2000,
          preventDuplicate: true,
          variant: "success",
        });
      } else {
        enqueueSnackbar("Failed!", {
          autoHideDuration: 2000,
          preventDuplicate: true,
          variant: "error",
        });
      }
    } catch (err) {}
    setAddID("");
    await fetchOperator();
    setLoading(false);
    handleCloseDialogId();
  };
  const verifierData = [
    {
      key: "Issuer ID",
      value: issuerID,
    },
    {
      key: "Published claims",
      value: numPublished,
    },
    {
      key: "Number of holders",
      value: numHolder,
    },
  ];

  useEffect(() => {
    if (
      !isUnlocked ||
      !localStorage.getItem("ziden-db/issuer-jwz") ||
      !localStorage.getItem("ziden-db/issuer-id")
    ) {
      enqueueSnackbar("Please unlock your wallet and sign in!", {
        autoHideDuration: 2000,
        preventDuplicate: true,
        variant: "info",
      });
      history.push("/issuer/profile/signin");
    } else {
      fetchIssuerMetaData();
      fetchOperator();
      if (endpointUrl) {
        const fetch = async () => {
          const validateResult = await validateJWZ(endpointUrl, "issuer");
          if (!validateResult) {
            enqueueSnackbar("Sign in expired, please sign in again!", {
              autoHideDuration: 2000,
              preventDuplicate: true,
              variant: "info",
            });
            history.push("/issuer/profile/signin");
          }
        };
        fetch();
      }
    }
  }, [
    isUnlocked,
    enqueueSnackbar,
    history,
    endpointUrl,
    fetchIssuerMetaData,
    fetchOperator,
  ]);
  return (
    <Box>
      {/* Popup dialogs */}
      {/* * */}
      {/* * */}
      <Dialog
        open={openDialogId === 1}
        onClose={handleCloseDialogId}
        PaperProps={{
          style: { borderRadius: "10px" },
        }}
      >
        <Box
          sx={{
            p: 3,
            maxWidth: "300px",
          }}
        >
          <Typography variant="body1" color="text.secondary">
            Are you sure you want to remove this operator?
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              mt: 3,
            }}
          >
            <Button
              variant="outlined"
              color="primary"
              onClick={handleCloseDialogId}
              sx={{
                mr: 1,
              }}
            >
              No
            </Button>
            <LoadingButton
              loading={loading}
              variant="contained"
              color="primary"
              onClick={async () => {
                if (removeId) {
                  handleRemove(removeId);
                }
              }}
            >
              Remove
            </LoadingButton>
          </Box>
        </Box>
      </Dialog>
      <Dialog
        PaperProps={{
          style: { borderRadius: "10px" },
        }}
        open={openDialogId === 2}
        onClose={handleCloseDialogId}
      >
        <Box
          sx={{
            p: 3,
            minWidth: "320px",
          }}
        >
          <Typography mb={2} variant="h3">
            Add Operator ID
          </Typography>
          <TextField
            onChange={(e) => {
              setAddID(e.target.value);
            }}
            fullWidth
            label="Operator ID"
          />
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              mt: 4,
            }}
          >
            <Button
              sx={{
                mr: 2,
              }}
              variant="outlined"
              color="primary"
              onClick={handleCloseDialogId}
            >
              Cancel
            </Button>
            <LoadingButton
              loading={loading}
              variant="contained"
              color="primary"
              onClick={handleAdd}
            >
              Add
            </LoadingButton>
          </Box>
        </Box>
      </Dialog>
      <Dialog
        PaperProps={{
          style: {
            borderRadius: "10px",
            width: "100%",
            maxWidth: "900px",
            margin: "0px",
          },
        }}
        sx={{
          "& .MuiDialog-container": {
            pt: 5,
            px: {
              xs: 1,
              xsm: 3,
              sm: 10,
              md: 10,
            },
          },
        }}
        open={openDialogId === 3}
        // onClose={handleCloseDialogId}
      >
        <EditInfoForm hanldeClose={handleCloseDialogId} />
      </Dialog>
      {/* * */}
      {/* * */}
      {/* End popup dialos */}
      <Header title1={profile?.name} description={[profile?.description]}>
        <Box
          sx={{
            display: "flex",
            width: "110px",
            height: "110px",
            borderRadius: "50%",
            backgroundColor: "#FFFFFF",
          }}
        >
          <Avatar
            sx={{
              width: "100%",
              height: "100%",
            }}
            src={profile?.logo}
          />
        </Box>
      </Header>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "center",
          justifyContent: "center",
          pt: 3,
          px: {
            xs: 2,
            xsm: 2,
            md: 4,
            lg: 5,
          },
        }}
      >
        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Grid
            container
            spacing={2}
            sx={{
              maxWidth: "2000px",
              width: "100%",
            }}
          >
            <Grid item xs={12} xsm={12} sm={12} lg={5} xl={5}>
              <Box>
                {verifierData.map((item, index) => {
                  return (
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        mt: 0.5,
                      }}
                      key={index}
                    >
                      <Typography
                        variant="body1"
                        color="secondary"
                        sx={{
                          textAlign: "left",
                          width: {
                            xs: "147px",
                            xsm: "180px",
                            md: "220px",
                            lg: "180px",
                          },
                        }}
                      >
                        {item.key}
                      </Typography>
                      <Tooltip title={item.value}>
                        <Typography
                          noWrap
                          variant="body1"
                          color="text.secondary"
                          sx={{
                            textAlign: "left",
                            maxWidth: {
                              xs: "180px",
                              sm: "250px",
                            },
                          }}
                        >
                          {item.value}
                        </Typography>
                      </Tooltip>
                    </Box>
                  );
                })}
              </Box>
              <Box
                sx={{
                  py: 3,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    variant="body1"
                    color="secondary"
                    sx={{
                      textAlign: "left",
                      width: {
                        xs: "147px",
                        xsm: "180px",
                        md: "220px",
                        lg: "180px",
                      },
                    }}
                  >
                    Contact
                  </Typography>

                  <Tooltip title={profile?.contact}>
                    <Typography
                      noWrap
                      variant="body1"
                      color="text.secondary"
                      sx={{
                        textAlign: "left",
                        maxWidth: {
                          xs: "180px",
                          sm: "250px",
                        },
                      }}
                    >
                      {profile?.contact}
                    </Typography>
                  </Tooltip>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    variant="body1"
                    color="secondary"
                    sx={{
                      textAlign: "left",
                      width: {
                        xs: "147px",
                        xsm: "180px",
                        md: "220px",
                        lg: "180px",
                      },
                    }}
                  >
                    Website
                  </Typography>

                  <Tooltip title={profile?.website}>
                    <Typography
                      noWrap
                      variant="body1"
                      color="text.secondary"
                      sx={{
                        textAlign: "left",
                        maxWidth: {
                          xs: "180px",
                          sm: "250px",
                        },
                      }}
                    >
                      {profile?.website}
                    </Typography>
                  </Tooltip>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    mt: 0.5,
                  }}
                >
                  <Typography
                    variant="body1"
                    color="secondary"
                    sx={{
                      textAlign: "left",
                      width: {
                        xs: "147px",
                        xsm: "180px",
                        md: "220px",
                        lg: "180px",
                      },
                    }}
                  >
                    Endpoint URL
                  </Typography>
                  <Tooltip title={endpointUrl}>
                    <Typography
                      noWrap
                      variant="body1"
                      color="text.secondary"
                      sx={{
                        textAlign: "left",
                        maxWidth: {
                          xs: "180px",
                          sm: "250px",
                        },
                      }}
                    >
                      {endpointUrl}
                    </Typography>
                  </Tooltip>
                </Box>
              </Box>
              <Box
                sx={{
                  my: 2,
                }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => {
                    setOpenDialogId(3);
                  }}
                  sx={{
                    ml: 1,
                  }}
                >
                  Edit
                </Button>
              </Box>
            </Grid>
            {operators && (
              <Grid item xs={12} xsm={12} sm={12} lg={7} xl={7}>
                <Paper
                  sx={{
                    backgroundColor: "#FFFFFF",
                    boxShadow: "0px 2px 8px #0000001F",
                    borderRadius: 3,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      p: 4,
                    }}
                  >
                    <Typography variant="h3">Operators</Typography>
                    <Button
                      sx={{
                        minWidth: "0px",
                        minHeight: "0px",
                        backgroundColor: "transparent",
                        borderRadius: "50%",
                      }}
                      onClick={() => {
                        handleOpenDialog(2);
                      }}
                    >
                      <PlusIcon />
                    </Button>
                  </Box>
                  <TableContainer
                    sx={{
                      "& .MuiTableCell-root:first-of-type": {
                        pl: 4,
                        textAlign: "left",
                      },
                      "& .MuiTableCell-root:last-of-type": {
                        pr: 4,
                        textAlign: "right",
                      },
                      "& .MuiTableCell-head": {
                        backgroundColor: "#EDF3FC",
                      },
                      "& .MuiTableCell-root": {
                        borderBottom: "none",
                      },
                      maxHeight: { lg: "calc(100vh - 420px)" },
                    }}
                  >
                    {operators?.length > 0 && (
                      <Table
                        sx={{
                          "& .MuiTableHead-root": {
                            backgroundColor: "#EDF3FC",
                          },
                        }}
                        stickyHeader
                      >
                        <TableHead>
                          <TableRow>
                            <TableCell>Operator ID</TableCell>
                            <TableCell align="left">Active Date</TableCell>
                            <TableCell align="right"> </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {operators?.map((row, index) => {
                            return (
                              <TableRow key={row.userId}>
                                <TableCell>
                                  <Tooltip title={row.userId}>
                                    <Typography
                                      variant="body1"
                                      color="text.secondary"
                                    >
                                      {truncateString(row.userId || "", 20)}
                                    </Typography>
                                  </Tooltip>
                                </TableCell>
                                <TableCell align="left">
                                  <Typography
                                    variant="body1"
                                    color="text.secondary"
                                    minWidth={"200px"}
                                  >
                                    {new Date(
                                      row.activateDate || 0
                                    ).toDateString()}
                                  </Typography>
                                </TableCell>
                                <TableCell align="right">
                                  <Button
                                    variant="outlined"
                                    color="primary"
                                    onClick={() => {
                                      remove(row.userId);
                                    }}
                                  >
                                    Remove
                                  </Button>{" "}
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    )}
                    {operators?.length === 0 && (
                      <Box
                        sx={{
                          width: "100%",
                          display: "flex",
                          justifyContent: "center",
                          pb: 2,
                        }}
                      >
                        <Typography>No operator</Typography>
                      </Box>
                    )}
                  </TableContainer>
                </Paper>
              </Grid>
            )}
          </Grid>
        </Box>
      </Box>
    </Box>
  );
};
export default Detail;
