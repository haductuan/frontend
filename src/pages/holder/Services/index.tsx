import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Avatar,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
//icons

import { Box } from "@mui/system";
import { Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import Header from "src/components/Header";

import { NavLink } from "react-router-dom";
import { useDeviceContext } from "src/context/deviceContext";
import { backendServer } from "src/client/api";
import Tooltip from "@mui/material/Tooltip";
import { useSnackbar } from "notistack";
import { ArrowDownIcon } from "src/constants/icon";
import ServiceLoading from "./components/ServiceLoading";
const Services = () => {
  const { isMobile, isDesktop } = useDeviceContext();
  const [loading, setLoading] = useState<boolean>(true);
  const [servicesData, setServicesData] = useState<Array<any>>([]);
  const [searchText, setSearchText] = useState<string>("");
  const [filteredService, setFilteredServices] = useState<Array<any>>([]);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const allServices = await backendServer.get("services");
        if (allServices?.data) {
          const services = allServices?.data?.services
            ?.filter((service: any) => service.active)
            .map((item: any, index: number) => {
              return {
                logo: item.verifier?.logoUrl || "",
                providerName: item.verifier?.name,
                title: item.name || "",
                requirements: item.requirements?.map(
                  (requirement: any, index: number) => {
                    return {
                      attestation: requirement.attestation,
                      title: requirement.title,
                      schemaHash: requirement.schemaHash,
                    };
                  }
                ),
                description: item.description,
                contact: item.verifier?.contact,
                website: item.verifier?.website,
                serviceID: item.serviceId,
              };
            });
          setServicesData(services);
        }
        setLoading(false);
      } catch (err) {
        setLoading(false);
      }
    };
    fetch();
  }, []);
  useEffect(() => {
    if (servicesData?.length > 0) {
      const filtered = servicesData?.filter((item) => {
        return item.title
          .toLowerCase()
          .includes(searchText.trim().toLowerCase());
      });
      setFilteredServices(filtered);
    }
  }, [searchText, servicesData]);
  return (
    <Box
      sx={{
        width: "100%",
      }}
    >
      <Header
        title1="The Verifier"
        title2="Attestation services"
        description={[
          "Verifiers can easily integrate with the platform for hosting attestation services.",
          "To attest to requirements without disclosing private data, simply generate a zero-knowledge proof from your claims. Any service can rely on different identity sources for their permission services through the Verifier Portal (coming soon).",
        ]}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            justifyContent: "space-between",
          }}
        >
          {/* <NavLink to={"/verifier"} style={{ textDecoration: "none" }}> */}
          <Button
            variant="contained"
            color="secondary"
            onClick={() => {
              enqueueSnackbar("Coming soon!", {
                variant: "info",
              });
            }}
          >
            Integrate your service
          </Button>
          {/* </NavLink> */}
        </Box>
      </Header>
      {
        <Box
          sx={{
            py: 4,
            px: {
              xs: 2,
              xsm: 2,
              md: 3,
              lg: 6,
            },
            height: "100%",
            width: "100%",
          }}
        >
          <TextField
            sx={{
              mb: 4,
              "& .MuiInputBase-root": {
                backgroundColor: "#EDF3FC",
              },
              color: "black",
            }}
            label="Search services"
            fullWidth
            variant="outlined"
            onChange={(e) => {
              setSearchText(e.target.value);
            }}
          />
          {filteredService?.length > 0 &&
            !loading &&
            filteredService.map((data: any, index: number) => {
              return (
                <Accordion
                  key={index}
                  sx={(theme) => ({
                    "& .MuiAccordionSummary-root": {
                      // background: "#FFFEFC 0% 0% no-repeat padding-box",
                      backgroundColor: theme.palette.background.default,
                      borderRadius: 4,
                      px: {
                        xs: 3,
                        xsm: 3,
                        lg: 5.5,
                      },
                    },
                    "& .MuiAccordionSummary-root.Mui-expanded": {
                      backgroundColor: theme.palette.background.header,
                    },
                    "&.MuiPaper-root": {
                      borderRadius: 4,
                      boxShadow: "0px 2px 8px #0000001F",
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
                    mb: 3,
                  })}
                >
                  <AccordionSummary
                    expandIcon={
                      <ArrowDownIcon sx={{ width: "34px", height: "17px" }} />
                    }
                    aria-controls="panel1a-content"
                  >
                    <Box
                      sx={{
                        width: "100%",
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        minHeight: "90px",
                        borderRadius: 2,
                        position: "relative",
                        mr: 2,
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                          minHeight: "90px",
                          borderRadius: 2,
                        }}
                      >
                        <Avatar
                          sx={{
                            width: isMobile ? "43px" : "70px",
                            height: isMobile ? "43px" : "70px",
                            mr: 2,
                            border: "1px solid #6C8EC1",
                          }}
                          src={data?.logo}
                        />
                        <Box>
                          <Typography
                            variant="h3"
                            sx={{ color: "#114898", fontWeight: 500 }}
                          >
                            {data.title}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ color: "#114898", fontWeight: 500, mb: 0.6 }}
                          >
                            BNB chain
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ color: "#646A71", opacity: 0.75 }}
                          >
                            Requirements{" "}
                            <span style={{ fontWeight: 600 }}>
                              {data.requirements
                                ?.map((item: any) => {
                                  return " " + item.title;
                                })
                                .toString()}
                            </span>
                          </Typography>
                        </Box>
                      </Box>
                      <NavLink
                        to={`/holder/services/attestation/${data.serviceID}`}
                        style={{ textDecoration: "none" }}
                      >
                        <Button
                          sx={{
                            mr: 5,
                            width: "98px",
                            height: "36px",
                            display: isMobile ? "none" : "block",
                          }}
                          variant="outlined"
                        >
                          Attest
                        </Button>
                      </NavLink>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails
                    sx={{
                      px: 0,
                    }}
                  >
                    <Box
                      sx={{
                        px: {
                          xs: 2,
                          xsm: 3,
                          lg: 6,
                        },
                        width: "100%",
                      }}
                    >
                      <Grid
                        container
                        sx={{
                          width: "100%",
                          py: 3,
                          px: 1,
                        }}
                      >
                        <Grid item xs={12} sm={12} lg={8}>
                          <Typography
                            sx={{
                              color: "#646A71",
                            }}
                            variant="body2"
                          >
                            {data.description}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={12} lg={4}>
                          <Box
                            sx={{
                              flexDirection: "column",
                              alignItems: "flex-end",
                              justifyContent: "center",
                              display: isDesktop ? "flex" : "none",
                            }}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "flex-start",
                                justifyContent: "center",
                              }}
                            >
                              <Typography color="#646A71" variant="body2">
                                Contact:{" "}
                                <a
                                  href={data.contact || "#"}
                                  style={{
                                    fontWeight: 600,
                                    textDecoration: "none",
                                    color: "#646A71",
                                  }}
                                  target="_blank"
                                  rel="noreferrer"
                                >
                                  {data.contact}
                                </a>
                              </Typography>
                              <Typography color="#646A71" variant="body2">
                                Website{" "}
                                <a
                                  href={data.website}
                                  target={"_blank"}
                                  rel="noreferrer"
                                  style={{
                                    textDecoration: "none",
                                    fontWeight: 600,
                                    color: "#646A71",
                                  }}
                                >
                                  {data.website}
                                </a>
                              </Typography>
                            </Box>
                          </Box>
                        </Grid>
                      </Grid>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          width: "100%",
                        }}
                      >
                        <Typography
                          sx={{
                            color: "#114898",
                            fontSize: "1rem",
                            fontWeight: 700,
                            pb: 2,
                            px: 1,
                          }}
                        >
                          Requirements
                        </Typography>
                        <NavLink
                          to={`/holder/services/attestation/${data.serviceID}`}
                          style={{ textDecoration: "none" }}
                        >
                          <Button
                            sx={{
                              width: "98px",
                              height: "36px",
                              display: isMobile ? "block" : "none",
                            }}
                            variant="outlined"
                          >
                            Attest
                          </Button>
                        </NavLink>
                      </Box>
                    </Box>
                    <TableContainer
                      sx={{
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
                      }}
                    >
                      <Table sx={{ minWidth: "300px" }}>
                        <TableHead
                          sx={{
                            backgroundColor: "#EDF3FC",
                          }}
                        >
                          <TableRow>
                            <TableCell align="left">Property</TableCell>
                            <TableCell align="left">Attestation</TableCell>
                            {/* <TableCell align="left">Schema hash</TableCell>
                            <TableCell align="left">Allowed issuers</TableCell> */}
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {data.requirements.map((item: any, index: number) => {
                            // console.log(item);
                            return (
                              <TableRow key={index}>
                                <TableCell align="left">
                                  <Tooltip
                                    placement="bottom"
                                    title={
                                      <Typography
                                        variant="body2"
                                        color={"text.primary"}
                                      >
                                        {item.title}
                                      </Typography>
                                    }
                                  >
                                    <Typography
                                      variant="h6"
                                      color="text.primary"
                                    >
                                      {item.title}
                                    </Typography>
                                  </Tooltip>
                                </TableCell>
                                <TableCell align="left">
                                  <Tooltip
                                    placement="bottom"
                                    title={
                                      <Typography
                                        variant="body2"
                                        color={"text.primary"}
                                      >
                                        {item.attestation}
                                      </Typography>
                                    }
                                  >
                                    <Typography
                                      variant="h6"
                                      color="text.primary"
                                    >
                                      {item.attestation}
                                    </Typography>
                                  </Tooltip>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </AccordionDetails>
                </Accordion>
              );
            })}
          {loading && <ServiceLoading />}
        </Box>
      }
    </Box>
  );
};

export default Services;
