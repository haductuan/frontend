import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Avatar,
  Button,
  Grid,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useMemo } from "react";
import { NavLink } from "react-router-dom";
import Header from "src/components/Header";
import { useState } from "react";
//icon
import ProviderDetail from "src/components/ProviderDetail";
import { useDeviceContext } from "src/context/deviceContext";
import { backendServer } from "src/client/api";
import { useIdWalletContext } from "src/context/identity-wallet-context";
import { ArrowDownIcon, ArrowRightIcon } from "src/constants/icon";
import LoadingProvider from "../components/LoadingProvider";

const IdentityProvider = () => {
  const [activeID, setActiveID] = useState<string>("-1");
  const [open, setOpen] = useState<boolean>(false);
  const { isDesktop } = useDeviceContext();
  const [loading, setLoading] = useState(true);
  const [providers, setProviders] = useState<any>();
  const [detailDatas, setDetailDatas] = useState<any>();
  const { updateUserData } = useIdWalletContext();
  useEffect(() => {
    // updateUserData();
    setLoading(true);
    try {
      backendServer.get("/issuers").then((res) => {
        setProviders(res.data.issuers);
        setLoading(false);
      });
    } catch (err) {
      setLoading(false);
    }
  }, [updateUserData]);
  const detailProvider = useMemo(() => {
    return <ProviderDetail detailData={detailDatas} />;
  }, [detailDatas]);
  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
      }}
    >
      <Header
        title1="The Issuer"
        title2="Trusted Identity Providers"
        description={[
          "Identity providers are trusted parties to make claims about others from their knowledge.",
          "To register for the claim issuance, select the schema you need to be redirected to the Request page. Any individual or organization can become an Issuer to provide identity sources for the platform through the Issuer Portal.",
        ]}
      >
        <Box>
          <NavLink to={"/issuer"} style={{ textDecoration: "none" }}>
            <Button variant="contained" color="secondary">
              Become an Issuer
            </Button>
          </NavLink>
        </Box>
      </Header>
      <Box
        sx={{
          px: {
            xs: 2,
            xsm: 2,
            md: 3,
            lg: 6,
          },
          py: 4,
          height: "100%",
          maxWidth: "1700px",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        {isDesktop && providers && !loading && (
          <Grid container>
            <Grid
              item
              xs={12}
              sm={12}
              lg={5}
              sx={{
                height: "500px",
                overflowY: "scroll",
                px: "8px",
                pt: "2px",
                scrollSnapType: "y mandatory",
                "&::-webkit-scrollbar": {
                  height: "0px",
                  width: "4px",
                  display: "initial",
                },
                "&::-webkit-scrollbar-thumb": {
                  background: "rgb(17,72,152, 0.2)",
                  borderRadius: "3px",
                },
              }}
            >
              {providers.map((data: any, index: number) => {
                return (
                  <Button
                    id={"identity-button-" + index}
                    key={data.name + index}
                    sx={{
                      maxWidth: "900px",
                      width: "100%",
                      height: "110px",
                      background:
                        open && data.issuerId === activeID
                          ? "#114898"
                          : "#FFFEFC",
                      boxShadow: "0px 2px 8px #0000001F",
                      borderRadius: 4,
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      pl: 4,
                      mb: 2,
                      transition: "opacity 0.5s",
                      scrollMargin: "2px",
                      scrollSnapAlign: "start",
                      "&:hover": {
                        backgroundColor:
                          open && data.issuerId === activeID
                            ? "#114898"
                            : "#FFFEFC",
                        opacity: "0.9",
                      },
                    }}
                    onClick={() => {
                      setActiveID(data.issuerId);
                      if (data.issuerId !== activeID) {
                        setDetailDatas(data);
                      }
                      setOpen(data.issuerId === activeID ? !open : true);
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                      }}
                    >
                      <Typography
                        variant="body1"
                        sx={{
                          color:
                            open && data.issuerId === activeID
                              ? "#FFFEFF"
                              : "#114898",
                          letterSpacing: "0px",
                          opacity: 1,
                          textAlign: "left",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <Avatar
                          src={data.logoUrl}
                          sx={{
                            marginRight: "10px",
                            borderRadius: "50%",
                            objectPosition: "0px 0px",
                            objectFit: "cover",
                            border: "1px solid #6C8EC1",
                            width: "55px",
                            height: "55px",
                          }}
                          alt=""
                        />
                        {data.name}
                      </Typography>
                    </Box>
                    <Box mr={2}>
                      <ArrowRightIcon />
                    </Box>
                  </Button>
                );
              })}
            </Grid>
            <Grid item xs={12} sm={12} lg={7}>
              <Box
                sx={{
                  width: "100%",
                  boxShadow: "0px 2px 8px #0000001F",
                  borderRadius: 4,
                  marginTop: "1px",
                  display: open ? "block" : "none",
                  ml: 1,
                }}
              >
                {detailProvider}
              </Box>
            </Grid>
          </Grid>
        )}
        {!isDesktop && providers && !loading && (
          <Grid container spacing={2}>
            {providers.map((data: any, index: number) => {
              return (
                <Grid item xs={12} key={data.name + index}>
                  <Accordion
                    // TransitionProps={{ unmountOnExit: true }}
                    sx={{
                      "& .MuiAccordionSummary-root": {
                        background: "#FFFEFC 0% 0% no-repeat padding-box",
                        borderRadius: 4,
                        px: {
                          xs: 2,
                          md: 3,
                          lg: 5,
                        },
                      },
                      "& .MuiAccordionSummary-root.Mui-expanded": {
                        background: "#114898 0% 0% no-repeat padding-box",
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
                    }}
                  >
                    <AccordionSummary
                      expandIcon={
                        <ArrowDownIcon sx={{ width: "34px", height: "17px" }} />
                      }
                      sx={{
                        width: "100%",
                        height: "110px",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "flex-start",
                          mr: 2,
                        }}
                      >
                        <Typography
                          variant="body1"
                          sx={{
                            color:
                              data.issuerId === activeID
                                ? "#FFFEFF"
                                : "#114898",
                            letterSpacing: "0px",
                            opacity: 1,
                            textAlign: "left",
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <Avatar
                            src={data.logoUrl}
                            sx={{
                              marginRight: "10px",
                              borderRadius: "50%",
                              border: "1px solid #6C8EC1",
                              width: "60px",
                              height: "60px",
                            }}
                            alt=""
                          />
                          {data.name}
                        </Typography>
                      </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                      <ProviderDetail detailData={data} />
                    </AccordionDetails>
                  </Accordion>
                </Grid>
              );
            })}
          </Grid>
        )}
        {loading && <LoadingProvider />}
      </Box>
    </Box>
  );
};

export default IdentityProvider;
