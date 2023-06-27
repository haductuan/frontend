import { Button, Grid, Paper, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import homeBackground from "src/assets/image/background/bg2x.png";
import IdentityWallet from "src/components/wallet";
//icon
import holderIcon from "src/assets/image/icons/holderIcon2x.png";
import issuerIcon from "src/assets/image/icons/issuerIcon2x.png";
import verifierIcon from "src/assets/image/icons/verifierIcon2x.png";
import discordIcon from "src/assets/image/icons/discordIcon2x.png";
import teleIcon from "src/assets/image/icons/teleIcon2x.png";
import twitterIcon from "src/assets/image/icons/twitterIcon2x.png";

import { NavLink } from "react-router-dom";
import { useSnackbar } from "notistack";
import { LinkedInIcon, MediumIcon } from "src/constants/icon";

const Home = () => {
  const { enqueueSnackbar } = useSnackbar();
  const data = [
    {
      title: "The Holder",
      description:
        "Holders have supreme control over their digital identity, which is aggregated from claims issued by trusted third parties. Users’ privacy is preserved by Zero-Knowledge Proof.",
      image: <img width="100%" height="auto" alt="" src={holderIcon} />,
      button: "Manage your Identity",
      to: "/holder/identity",
      disabled: false,
    },
    {
      title: "The Issuer",
      description:
        "Anyone can become an Identity Provider by taking the Issuer role to issue claims about others. Example providers include individuals, organizations, and government offices.",
      image: <img width="100%" height="auto" alt="" src={issuerIcon} />,
      button: "Become an Identity Provider",
      to: "/issuer/profile",
    },
    {
      title: "The Verifier",
      description:
        "Verifiers can integrate their services with the platform to leverage users' identity attestation for the authentication and authorization processes both on web 2 and web 3.",
      image: <img width="100%" height="auto" alt="" src={verifierIcon} />,
      button: "Integrate your Services",
      to: "#",
    },
  ];
  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100vh",
        background: {
          xs: "none",
          sm: `transparent url(${homeBackground}) 0% 0% no-repeat padding-box`,
        },
        backgroundSize: {
          sm: "432px 432px",
          md: "50% auto",
          lg: "50% auto",
        },
        backgroundPosition: {
          xsm: "115% 100px",
          sm: "115% 100px",
          md: "115% 100px",
          lg: "115% -10vh",
        },
      }}
    >
      <Box
        sx={{
          py: 10,
          px: {
            xs: 1,
            xsm: 2,
            md: 3,
            lg: 6,
          },
          minHeight: {
            xs: "auto",
            sm: "600px",
            lg: "91vh",
          },
        }}
      >
        <Typography variant="h1">Own your identity</Typography>
        <Typography variant="h2" sx={{ fontWeight: 400 }}>
          {" "}
          Explore services with privacy
        </Typography>
        <Typography
          sx={{
            maxWidth: "500px",
            color: "#646A71",
            pt: 2,
            pb: 0.5,
          }}
          variant="body2"
        >
          A self-sovereign identity platform with verifiable attestation powered
          by zero-knowledge proofs.
        </Typography>
        <Typography
          sx={{
            maxWidth: "500px",
            color: "#646A71",
            pb: 4,
          }}
          variant="body2"
        >
          Available on Web2 and Web3.
        </Typography>
        <IdentityWallet type={1} />
        <Box
          sx={{
            display: {
              xs: "block",
              sm: "none",
            },
            mt: 6,
          }}
        >
          <img src={homeBackground} alt="" width="100%" height="100%" />
        </Box>
        <Box
          sx={{
            mt: 5,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Typography variant="h5" color="text.primary" mb={"10px"}>
            Join Us
          </Typography>
          <a target={"blank"} href="https://www.linkedin.com/company/ziden-io/">
            <LinkedInIcon
              sx={{
                ml: "20px",
              }}
            />
          </a>
          <a target={"blank"} href="https://discord.gg/2GdVuvAHwG">
            <img
              width="24px"
              height="26px"
              alt=""
              style={{ marginLeft: "20px", marginTop: "2px" }}
              src={discordIcon}
            />
          </a>
          <a target={"blank"} href="https://twitter.com/ziden_io">
            <img
              width="30px"
              height="24px"
              alt=""
              style={{ marginLeft: "20px" }}
              src={twitterIcon}
            />
          </a>
          <a target={"blank"} href="https://blog.ziden.io/">
            <MediumIcon sx={{ ml: "20px" }} />
          </a>
        </Box>
        <Box
          sx={{
            mt: {
              sm: 22,
              md: 2,
              xs: 2,
            },
            width: {
              md: "50%",
              lg: "50%",
              xl: "40%",
            },
            aspectRatio: "1920/1080",
          }}
        >
          <iframe
            title="Ziden Intro"
            style={{
              borderRadius: "10px",
              border: "1px solid #F7A088",
            }}
            id="video"
            width="100%"
            height="100%"
            src="https://www.youtube.com/embed/b-an-6akg3I?autoplay=0&mute=0"
            allow="fullscreen"
          />
        </Box>
      </Box>
      <Box
        sx={{
          px: {
            xs: 1,
            xsm: 2,
            md: 3,
            lg: 6,
          },
          pb: 15,
        }}
      >
        <Typography
          sx={{
            fontSize: "1.875rem",
            fontWeight: 700,
            lineHeight: "44px",
            pb: 6,
          }}
          color="text.primary"
        >
          Get started here
        </Typography>
        <Grid
          container
          spacing={3}
          display="flex"
          justifyContent={"center"}
          flexDirection="row"
        >
          {data.map((item, index) => {
            return (
              <Grid
                item
                xs={12}
                xsm={12}
                lg={4}
                key={item.title + index}
                display="flex"
                alignItems="center"
                justifyContent={"center"}
              >
                <Paper
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "space-between",
                    px: 3,
                    py: 4,
                    aspectRatio: {
                      xs: "8/10",
                      xsm: "4/1",
                      sm: "4/0.8",
                      lg: "8/10",
                    },
                    boxShadow: "0px 3px 5px 2px rgba(0, 0, 0, 0.1)",
                    borderRadius: 3,
                    maxWidth: {
                      xs: "340px",
                      xsm: "400px",
                      sm: "2000px",
                      lg: "400px",
                    },
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: {
                        xs: "column",
                        sm: "row",
                        lg: "column",
                      },
                      alignItems: "center",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        width: "200px",
                        minWidth: "180px",
                        height: {
                          xs: "180px",
                          sm: "120px",
                          md: "150px",
                          lg: "180px",
                        },
                      }}
                    >
                      {item.image}
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: {
                          xs: "center",
                          sm: "flex-start",
                          lg: "center",
                        },
                        justifyContent: "space-evenly",
                        minHeight: {
                          xs: "190px",
                          sm: "0px",
                          md: "0px",
                          lg: "200px",
                        },
                        ml: {
                          xs: "auto",
                          sm: 3,
                          lg: "auto",
                        },
                      }}
                    >
                      <Typography color="text.primary" variant="h3">
                        {item.title}
                      </Typography>
                      <Typography color="#646A71" variant="body2">
                        {item.description}
                      </Typography>
                    </Box>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: {
                        xs: "center",
                        sm: "flex-end",
                        lg: "center",
                      },
                      width: "100%",
                    }}
                  >
                    <NavLink
                      to={item.to}
                      style={{
                        textDecoration: "none",
                      }}
                    >
                      <Button
                        sx={{
                          minWidth: "182px",
                        }}
                        variant="outlined"
                        onClick={() => {
                          if (item.to === "#") {
                            enqueueSnackbar("Coming soon!", {
                              variant: "info",
                            });
                          }
                        }}
                      >
                        <Typography>{item.button}</Typography>
                      </Button>
                    </NavLink>
                  </Box>
                </Paper>
              </Grid>
            );
          })}
        </Grid>
      </Box>
    </Box>
  );
};
export default Home;
