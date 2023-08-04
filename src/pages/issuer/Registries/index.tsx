import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  TablePagination,
  CircularProgress,
  Skeleton,
} from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import { NavLink, useHistory } from "react-router-dom";
import Header from "src/components/Header";
import SchemaDetail from "./components/SchemaDetail";
import { useIdWalletContext } from "src/context/identity-wallet-context";
import { useSnackbar } from "notistack";
import { convertMsToHM } from "src/utils/time";
import { useIssuerContext } from "src/context/issuerContext";
import { validateJWZ } from "src/utils/auth";
import LoadingComponent from "src/components/LoadingComponent";
import axios from "axios";
import { EmptyIcon } from "src/constants/icon";
import { backendServer } from "src/client/api";
const cellDataStyle = (theme: any) => {
  return {
    maxWidth: {
      xs: "100px",
      xsm: "150px",
      md: "150px",
      lg: "200px",
      xl: "350px",
    },
  };
};

const Schemas = () => {
  const [open, setOpen] = useState(false);
  const { endpointUrl } = useIssuerContext();
  const [tableLoading, setTableLoading] = useState<boolean>();
  const [isSignedIn, setIsSignedIn] = useState(false); // check for jwz and wallet unlock status
  const [tableData, setTableData] = useState<Array<any>>([]);
  const [detailData, setDetailData] = useState<any>({});
  const { isUnlocked, keyContainer } = useIdWalletContext();
  const [rowsPerpage, setRowsPerPage] = useState(6);
  const { enqueueSnackbar } = useSnackbar();
  const [page, setPage] = useState(0);
  const [loadings, setLoadings] = useState<Array<string>>([]);
  const history = useHistory();
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
  const handleClose = () => {
    setOpen(false);
  };
  const showDetailSchema = async (schameData: any) => {
    setOpen(true);
    const schemaDetailResult = (
      await backendServer.get(`schemas/${schameData?.schema?.hash}`)
    ).data.schema.jsonSchema;
    const schemaDetailData = {
      general: {
        network: {
          title: "Network",
          value: schameData?.network?.name,
        },
        endpointUrl: {
          title: "Endpoint URL",
          value: schameData?.endpointUrl,
        },
        updateable: {
          title: "Updateable",
          value: schameData?.updatable ? "Yes" : "No",
        },
        expirationTime: {
          title: "Expiration time",
          value: convertMsToHM(schameData?.expiration),
        },
      },
      detail: schemaDetailResult,
    };
    setDetailData(schemaDetailData);
  };
  const setLoadingButton = (id: string) => {
    setLoadings((prev) => {
      return [...prev, id];
    });
  };
  const removeLoadingButton = (id: string) => {
    setLoadings((prev: any) => {
      return prev.filter((item: any) => {
        return item !== id;
      });
    });
  };
  const handleToogleActivate = async (
    registryID: string,
    currentState: boolean
  ) => {
    const jwz = keyContainer.db.get("issuer-jwz");
    if (loadings.includes(registryID)) {
      return;
    }
    setLoadingButton(registryID);
    try {
      await axios.put(
        `${endpointUrl}/registries/${registryID}/activate`,
        {
          isActive: !currentState,
        },
        {
          headers: {
            Authorization: `${jwz}`,
          },
        }
      );
      removeLoadingButton(registryID);
      await fetch();
    } catch (err) {
      removeLoadingButton(registryID);
    }
  };
  const fetch = React.useCallback(async () => {
    setTableLoading(true);
    try {
      const userId = localStorage.getItem("ziden-db/issuer-id");
      const allSchema = (
        await axios.get(`${endpointUrl}/registries?issuerId=${userId}`)
      ).data;
      setTableData(allSchema);
      setTableLoading(false);
    } catch (err) {
      setTableLoading(false);
    }
  }, [endpointUrl]);

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
      setIsSignedIn(true);
      if (endpointUrl) {
        const validate = async () => {
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
        validate();
      }
      fetch();
    }
  }, [isUnlocked, enqueueSnackbar, history, endpointUrl, fetch]);
  return (
    <>
      {!isSignedIn && <LoadingComponent type={2} />}
      {isSignedIn && (
        <Box>
          <Header
            title1="Registries"
            description={[
              "A schema describes the standard for every information included in your claims. Each schema is identified by a unique hash and can be registered on multiple networks.",
              "Only activated schemas will be visible to Holders through the platform.",
            ]}
          >
            <NavLink
              to="/issuer/registries/new-registry"
              style={{ textDecoration: "none" }}
            >
              <Button variant="outlined" color="secondary">
                New Registries
              </Button>
            </NavLink>
          </Header>
          <Box
            sx={{
              width: "100%",
              px: {
                xs: 0,
                sm: 1,
                lg: 6,
              },
              pt: 2,
            }}
          >
            <Paper
              sx={{
                borderRadius: 4,
              }}
            >
              <SchemaDetail
                generalData={detailData}
                open={open}
                handleClose={handleClose}
              />
              <TableContainer
                sx={{
                  "& .MuiTableRow-head": {
                    backgroundColor: "#EDF3FC",
                  },
                  "& .MuiTableCell-root": {
                    borderBottom: "none",
                    p: 1,
                  },
                  "& .MuiTableCell-root:first-of-type": {
                    pl: 4,
                    textAlign: "left",
                  },
                  "& .MuiTableCell-root:last-of-type": {
                    pr: 4,
                  },
                  // "& .MuiTableCell-root:nth-child": {},
                  borderRadius: 4,
                }}
              >
                <Table sx={{ minWidth: "300px", tableLayout: "fixed" }}>
                  <TableHead
                    sx={{
                      height: "50px",
                    }}
                  >
                    <TableRow>
                      <TableCell>No</TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell
                        sx={{
                          display: {
                            xs: "none",
                            xsm: "table-cell",
                          },
                        }}
                      >
                        Schema hash
                      </TableCell>
                      <TableCell
                        sx={{
                          display: {
                            xs: "none",
                            xsm: "table-cell",
                          },
                        }}
                      >
                        Published
                      </TableCell>
                      <TableCell
                        sx={{
                          display: {
                            xs: "none",
                            xsm: "table-cell",
                          },
                        }}
                      >
                        Network
                      </TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {!(tableLoading && tableData.length === 0) &&
                      tableData
                        .slice(page * rowsPerpage, (page + 1) * rowsPerpage)
                        .map((tableRowData: any, index: number) => {
                          return (
                            <TableRow
                              key={index}
                              hover
                              onClick={() => {
                                showDetailSchema(tableRowData);
                              }}
                            >
                              <TableCell>
                                <Typography
                                  noWrap
                                  sx={cellDataStyle}
                                  variant="body2"
                                  color={"text.secondary"}
                                >
                                  {index + 1}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography
                                  noWrap
                                  sx={cellDataStyle}
                                  variant="body2"
                                  color={"text.secondary"}
                                >
                                  {tableRowData?.schema?.name}
                                </Typography>
                              </TableCell>
                              <TableCell
                                sx={{
                                  display: {
                                    xs: "none",
                                    xsm: "table-cell",
                                  },
                                }}
                              >
                                <Typography
                                  noWrap
                                  sx={cellDataStyle}
                                  variant="body2"
                                  color={"text.secondary"}
                                >
                                  {tableRowData?.schema?.hash}
                                </Typography>
                              </TableCell>
                              <TableCell
                                sx={{
                                  display: {
                                    xs: "none",
                                    xsm: "table-cell",
                                  },
                                }}
                              >
                                <Typography
                                  noWrap
                                  sx={cellDataStyle}
                                  variant="body2"
                                  color={"text.secondary"}
                                >
                                  {tableRowData?.numClaims}
                                </Typography>
                              </TableCell>
                              <TableCell
                                sx={{
                                  display: {
                                    xs: "none",
                                    xsm: "table-cell",
                                  },
                                }}
                              >
                                <Typography
                                  noWrap
                                  sx={cellDataStyle}
                                  variant="body2"
                                  color={"text.secondary"}
                                >
                                  {tableRowData?.network?.name}
                                </Typography>
                              </TableCell>
                              <TableCell align="right">
                                <Button
                                  sx={{
                                    minWidth: "100px",
                                    minHeight: "0px",
                                    height: "36px",
                                    width: "100px",
                                    backgroundColor: tableRowData?.isActive
                                      ? "#F0F0F0"
                                      : "#114898",
                                    color: tableRowData?.isActive
                                      ? "#114898"
                                      : "#FFFFFF",
                                    "&:hover": {
                                      backgroundColor: tableRowData?.isActive
                                        ? "#f2e9e9"
                                        : "auto",
                                    },
                                    border: "none",
                                    boxShadow: "none",
                                  }}
                                  variant="contained"
                                  onClick={(e) => {
                                    handleToogleActivate(
                                      tableRowData?.id,
                                      tableRowData?.isActive
                                    );
                                    e.stopPropagation();
                                  }}
                                >
                                  {loadings.includes(tableRowData?.id) ? (
                                    <CircularProgress
                                      sx={{
                                        color: tableRowData?.isActive
                                          ? "#114898"
                                          : "#F0F0F0",
                                      }}
                                      size={"1.2rem"}
                                    />
                                  ) : tableRowData?.isActive ? (
                                    "Deactivate"
                                  ) : (
                                    "Activate"
                                  )}
                                </Button>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                  </TableBody>
                </Table>
                {tableLoading && tableData.length === 0 && (
                  <Box
                    sx={{
                      width: "100%",
                      py: 2,
                      opacity: 0.2,
                    }}
                  >
                    <Skeleton variant="rounded" width={"100%"} height={40} />
                  </Box>
                )}
                {!tableLoading && tableData.length === 0 && (
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
              </TableContainer>
              <Box sx={{ borderBottom: "1px solid #D1D3D5" }} />
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "flex-end",
                  width: "100%",
                  px: 2,
                  pb: 1,
                }}
              >
                <TablePagination
                  component="div"
                  count={tableData.length}
                  page={page}
                  onPageChange={handleChangePage}
                  rowsPerPage={rowsPerpage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  rowsPerPageOptions={[5, 6, 8, 10, 15, 20, 30, 50]}
                  sx={{
                    width: "400px",
                  }}
                />
              </Box>
            </Paper>
          </Box>
        </Box>
      )}
    </>
  );
};
export default Schemas;
