import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { Box } from "@mui/system";
import { NavLink, useHistory } from "react-router-dom";
import Header from "src/components/Header";
import ServiceDetail from "./components/ServiceDetail";
import { useIdWalletContext } from "src/context/identity-wallet-context";
import { zidenPortal } from "src/client/api";
import { useVerifierContext } from "src/context/verifierContext";
import { truncateString } from "src/utils/wallet/walletUtils";
import { LoadingButton } from "@mui/lab";
import { validateJWZ } from "src/utils/auth";
import { useSnackbar } from "notistack";
// Mock data

const Services = () => {
  //style
  const accordionStyle = (theme: any) => {
    return {
      "& .MuiAccordionSummary-root": {
        background: "#FFFEFC 0% 0% no-repeat padding-box",
        px: 3,
      },
      "& .MuiAccordionSummary-root.Mui-expanded": {
        background: "#114898 0% 0% no-repeat padding-box",
      },
      "&.MuiPaper-root": {
        //boxShadow: "0px 2px 8px #0000001F",
        boxShadow: "none",
        borderTop: "1px solid #0000001F",
      },
      "&.MuiAccordion-root:before": {
        position: "relative",
      },
      "&	.MuiSvgIcon-root": {
        fontSize: "4rem",
        fontWeight: 300,
        color: "#F7A088",
      },
      "& .Mui-expanded .MuiTypography-root": {
        color: "#FFFFFC",
      },
      "& .Mui-expanded .MuiButton-root": {
        color: "#FFFFFF",
        border: "1px solid #FFFFFF",
      },
      minWidth: "650px",
    };
  };
  const tableStyle = (theme: any) => {
    return {
      "& .MuiTableCell-root": {
        pl: {
          xs: "24px",
          xsm: "32px",
          lg: "56px",
        },
        borderBottom: "none",
      },
      "&::-webkit-scrollbar": {
        height: "4px",
        display: "initial",
      },
      "&::-webkit-scrollbar-thumb": {
        background: "#afb9c7",
        borderRadius: "3px",
      },
      "& .MuiTableHead-root": {
        backgroundColor: "#EDF3FC",
      },
      "& .MuiTableCell-root:last-of-type": {
        pr: 3,
      },
    };
  };
  const handleToogle = async (e: any, id: string) => {
    toogleActive(id);
    e.stopPropagation();
  };
  //state
  const [rowsPerpage, setRowsPerPage] = useState(8);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState<Array<any>>([]);
  //context
  const { isUnlocked, keyContainer, userId } = useIdWalletContext();
  const { verifierId } = useVerifierContext();
  const history = useHistory();
  const { enqueueSnackbar } = useSnackbar();
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
  const [tableData, setTableData] = useState([]);
  const [dialogData, setDialogData] = useState();
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const addLoadingService = (id: string) => {
    setLoading((prev) => {
      return [...prev, id];
    });
  };
  const removeLoadingService = (id: string) => {
    setLoading((prev) => {
      return prev.filter((item) => {
        return item !== id;
      });
    });
  };
  const fetchServices = React.useCallback(async () => {
    if (isUnlocked) {
      try {
        const res = (
          await zidenPortal.get(`/services?verifierId=${verifierId}`)
        ).data;
        setTableData(res.services || []);
      } catch (err) {}
    }
  }, [verifierId, isUnlocked]);
  const toogleActive = async (id: string) => {
    addLoadingService(id);
    const jwz = keyContainer.db.get("verifier-jwz");
    await zidenPortal.put(
      `/services/${id}/active`,
      {},
      {
        headers: {
          Authorization: jwz,
        },
      }
    );
    removeLoadingService(id);
    await fetchServices();
  };
  React.useEffect(() => {
    fetchServices();
  }, [fetchServices]);
  React.useEffect(() => {
    if (
      !isUnlocked ||
      !localStorage.getItem("ziden-db/verifier-jwz") ||
      !localStorage.getItem("ziden-db/verifier-id")
    ) {
      enqueueSnackbar("Please unlock your wallet and sign in!", {
        autoHideDuration: 2000,
        preventDuplicate: true,
        variant: "info",
      });
      history.push("/verifier/profile/signin");
    } else {
      const validate = async () => {
        const validateResult = await validateJWZ(
          zidenPortal.getUri(),
          "verifier"
        );
        if (!validateResult) {
          enqueueSnackbar("Sign in expired, please sign in again!", {
            autoHideDuration: 2000,
            preventDuplicate: true,
            variant: "info",
          });
          history.push("/verifier/profile/signin");
        }
      };
      validate();
    }
  }, [isUnlocked, enqueueSnackbar, history]);
  return (
    <Box>
      <ServiceDetail
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
        dialogData={dialogData}
      />
      <Header
        title1="Attestation Services"
        description={[
          "An attestation service consist of a set of requirements that one needs to fulfill to access, for example, age requirement or residency status. Each service can be hosted on a specific blockchain network to be utilized for decentralized application.",
        ]}
      >
        {userId === verifierId && (
          <NavLink
            to="/verifier/services/new-service"
            style={{ textDecoration: "none" }}
          >
            <Button variant="outlined" color="secondary">
              New Service
            </Button>
          </NavLink>
        )}
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
          <Box
            sx={{
              overflowX: "scroll",
              width: "100%",
            }}
          >
            <Box
              sx={{
                px: 3,
                py: 1.5,
                backgroundColor: "#EDF3FC",
                borderTopLeftRadius: "16px",
                borderTopRightRadius: "16px",
                minWidth: "650px",
              }}
            >
              <Grid
                container
                sx={{
                  width: "100%",
                }}
              >
                <Grid item xs={2}>
                  <Typography>No</Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography>Service</Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography>Network</Typography>
                </Grid>
                <Grid item xs={2}>
                  <Typography></Typography>
                </Grid>
              </Grid>
            </Box>
            {tableData.length > 0 &&
              tableData
                .slice(page * rowsPerpage, (page + 1) * rowsPerpage)
                .map((item: any, index: number) => {
                  const no = index + 1;
                  return (
                    <Box key={index}>
                      <Accordion sx={accordionStyle}>
                        <AccordionSummary
                          sx={{
                            px: 3,
                          }}
                        >
                          <Grid
                            container
                            sx={{
                              width: "100%",
                            }}
                          >
                            <Grid item xs={2}>
                              <Typography color={"text.secondary"}>
                                {no}
                              </Typography>
                            </Grid>
                            <Grid item xs={4}>
                              <Typography color={"text.secondary"}>
                                {item["name"] || ""}
                              </Typography>
                            </Grid>
                            <Grid item xs={4}>
                              <Typography color={"text.secondary"}>
                                {item.network?.name || "None"}
                              </Typography>
                            </Grid>
                            <Grid
                              item
                              xs={2}
                              sx={{
                                display: "flex",
                                justifyContent: "flex-end",
                              }}
                            >
                              <LoadingButton
                                loading={loading.includes(item["serviceId"])}
                                variant="outlined"
                                color="primary"
                                onClick={(e) => {
                                  handleToogle(e, item["serviceId"]);
                                }}
                                sx={{
                                  width: "80px",
                                }}
                              >
                                {item["active"] ? "Deactive" : "Active"}
                              </LoadingButton>
                            </Grid>
                          </Grid>
                        </AccordionSummary>
                        <AccordionDetails
                          sx={{
                            px: 0,
                          }}
                        >
                          <Box
                            sx={{
                              width: "100%",
                            }}
                          >
                            <Typography variant="h5" p={2} ml={5}>
                              Requirements
                            </Typography>
                            <TableContainer
                              sx={{
                                width: "100%",
                              }}
                            >
                              <Table sx={tableStyle}>
                                <TableHead>
                                  <TableRow>
                                    <TableCell>Property</TableCell>
                                    <TableCell>Attestation</TableCell>
                                    <TableCell>Schema</TableCell>
                                    <TableCell>Allowed Issuers</TableCell>
                                    <TableCell></TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {item.requirements.length > 0 &&
                                    item.requirements.map(
                                      (data: any, index: number) => {
                                        return (
                                          <TableRow key={index}>
                                            <TableCell>
                                              <Typography
                                                variant="body2"
                                                color="text.secondary"
                                              >
                                                {truncateString(
                                                  data.title || "",
                                                  25
                                                )}
                                              </Typography>
                                            </TableCell>
                                            <TableCell>
                                              <Typography
                                                variant="body2"
                                                color="text.secondary"
                                              >
                                                {truncateString(
                                                  data.attestation ||
                                                    "No description",
                                                  25
                                                )}
                                              </Typography>
                                            </TableCell>
                                            <TableCell>
                                              <Typography
                                                variant="body2"
                                                color="text.secondary"
                                              >
                                                {truncateString(
                                                  data.schema?.name || "NoName",
                                                  25
                                                )}
                                              </Typography>
                                            </TableCell>
                                            <TableCell>
                                              <Tooltip
                                                title={
                                                  <Box>
                                                    {data.allowedIssuers?.map(
                                                      (
                                                        issuer: any,
                                                        index: number
                                                      ) => {
                                                        return (
                                                          <Typography
                                                            key={index}
                                                            variant="body2"
                                                            py={1}
                                                          >
                                                            {issuer.name}
                                                          </Typography>
                                                        );
                                                      }
                                                    )}
                                                  </Box>
                                                }
                                              >
                                                <Typography
                                                  variant="body2"
                                                  color="text.secondary"
                                                >
                                                  {truncateString(
                                                    data.allowedIssuers
                                                      ?.map(
                                                        (item: any) => item.name
                                                      )
                                                      .toString() || "",
                                                    25
                                                  )}
                                                  {"..."}
                                                </Typography>
                                              </Tooltip>
                                            </TableCell>
                                            <TableCell align="right">
                                              <Button
                                                variant="contained"
                                                color="primary"
                                                onClick={() => {
                                                  setDialogData(data);
                                                  setOpenDialog(true);
                                                }}
                                                sx={{
                                                  width: "80px",
                                                }}
                                              >
                                                Details
                                              </Button>
                                            </TableCell>
                                          </TableRow>
                                        );
                                      }
                                    )}
                                </TableBody>
                              </Table>
                            </TableContainer>
                          </Box>
                        </AccordionDetails>
                      </Accordion>
                    </Box>
                  );
                })}
          </Box>
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
  );
};
export default Services;
