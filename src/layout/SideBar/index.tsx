import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import { Button, List, Typography } from "@mui/material";
import ZidenLogo from "../../assets/image/logo/ziden_logo_desktop_2x.png";
import zidenIcon from "src/assets/image/logo/Ziden_icon2x.png";
import { NavLink, useLocation } from "react-router-dom";
//icon
import { SwipeableDrawer } from "@mui/material";
import MobileHeader from "./MobileHeader";
import { useDeviceContext } from "src/context/deviceContext";
import {
  DocumentIcon,
  GetStartIcon,
  IdentityIcon,
  PortalsIcon,
  ServiceIcon,
} from "src/constants/icon";
import { useIdWalletContext } from "src/context/identity-wallet-context";
import { useSnackbar } from "notistack";

const SideBar = () => {
  const [open, setOpen] = useState<boolean>(true);
  const { isUnlocked } = useIdWalletContext();
  const currentRoute = useLocation();

  const { enqueueSnackbar } = useSnackbar();
  const toogleDrawer = () => {
    setOpen((prev) => !prev);
  };
  const { isMobile, isIpad, isDesktop } = useDeviceContext();
  useEffect(() => {
    setOpen(isIpad || isDesktop);
  }, [isIpad, isDesktop]);

  const navRoutes = [
    {
      name: "Getting Started",
      subMenu: false,
      to: "/getting-started",
      icon: <GetStartIcon />,
      disable: false,
    },
    {
      name: "Holder",
      subMenu: true,
      to: "/holder",
      menuItems: [
        {
          to: "/holder/identity",
          name: "Identity",
          disable: false,
        },

        {
          to: "/holder/services",
          name: "Services",
          disable: false,
        },
      ],
      icon: <IdentityIcon />,
      disable: false,
    },

    {
      name: "Issuer",
      subMenu: true,
      to: "/issuer",
      menuItems: [
        {
          to: "/issuer/profile",
          name: "Profile",
          disable: false,
        },
        {
          to: "/issuer/claims",
          name: "Claims",
          disable:
            isUnlocked && localStorage.getItem("ziden-db/issuer-jwz")
              ? false
              : true,
          disableMessage: "Please unlock your wallet and sign in",
        },
        {
          to: "/issuer/schemas",
          name: "Schemas",
          disable:
            isUnlocked && localStorage.getItem("ziden-db/issuer-jwz")
              ? false
              : true,
          disableMessage: "Please unlock your wallet and sign in",
        },
      ],
      disable: false,
      icon: <ServiceIcon />,
    },
    {
      name: "Verifier",
      disable: false,
      to: "/verifier",
      subMenu: true,
      menuItems: [
        {
          to: "/verifier/profile",
          name: "Profile",
        },
        {
          to: "/verifier/services",
          name: "Services",
          disable: !isUnlocked,
          disableMessage: "Please unlock your wallet and sign in",
        },
      ],
      icon: <PortalsIcon />,
    },
    {
      name: "Docs",
      subMenu: false,
      to: "https://docs.ziden.io/",
      icon: <DocumentIcon />,
      disable: false,
      newTab: true,
    },
  ];
  const popUpMessage = (message: string) => {
    enqueueSnackbar(message, {
      variant: "info",
    });
  };
  return (
    <>
      {isMobile && <MobileHeader toogleDrawer={toogleDrawer} />}
      <SwipeableDrawer
        ModalProps={{
          keepMounted: true,
        }}
        anchor="left"
        open={open}
        variant={isMobile ? "temporary" : "persistent"}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        sx={{
          width: {
            xs: "268px",
            xsm: "110px",
            md: "110px",
            lg: "230px",
          },
          minHeight: "100vh",
          "& .MuiDrawer-paper": {
            width: {
              xs: "268px",
              xsm: "110px",
              md: "110px",
              lg: "230px",
            },
            backgroundColor: "#FEF7F2",
            boxSizing: "border-box",
            border: "none",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            py: 3,
          }}
        >
          <img
            src={isIpad || isMobile ? zidenIcon : ZidenLogo}
            alt={"ziden"}
            width={isIpad ? "41px" : "131px"}
            height={isIpad ? "41px" : "39px"}
            style={{
              opacity: isMobile ? 0 : 1,
            }}
          />
        </Box>
        <List>
          {navRoutes.map((route: any, index) => {
            const rootRoute =
              "/" + currentRoute.pathname.split("/").slice(1)[0];
            const exactRoute = currentRoute.pathname;
            return (
              <Box
                key={index}
                sx={{
                  "&:hover": {
                    "& #subMenu": {
                      maxHeight: "500px",
                    },
                  },
                }}
              >
                <NavLink
                  key={route.to + index}
                  to={route.disable || route.newTab ? "#" : route.to}
                  style={{ textDecoration: "none" }}
                >
                  <Button
                    onClick={() => {
                      if (route.newTab) {
                        window.open(route.to);
                      }
                      if (isMobile) {
                        setOpen(false);
                      }
                    }}
                    fullWidth
                    sx={(theme) => ({
                      backgroundColor:
                        rootRoute === route.to
                          ? theme.palette.background.default
                          : "transparent",
                      margin: 0,
                      minHeight: "50px",
                      borderRight:
                        rootRoute === route.to
                          ? "4px solid #F7A088"
                          : "4px solid transparent",
                      borderRadius: 0,
                      display: "flex",
                      flexDirection: {
                        xs: "row",
                        xsm: "column",
                        md: "column",
                        lg: "row",
                      },
                      justifyContent: {
                        xs: "left",
                        xsm: "center",
                        md: "left",
                        lg: "left",
                      },
                      alignItems: "center",
                      pl: {
                        xs: 5,
                        xsm: 1,
                        md: 1,
                        lg: 6,
                      },
                      py: {
                        xs: 1,
                        xsm: 2,
                        md: 2,
                        lg: 0,
                      },
                    })}
                  >
                    <Box
                      sx={(theme) => ({
                        "& g": {
                          fill:
                            rootRoute === route.to
                              ? "#F7A088"
                              : theme.palette.text.primary,
                        },
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mr: {
                          xs: 1,
                          xsm: 0,
                        },
                      })}
                    >
                      {route.icon}
                    </Box>
                    <Typography
                      variant="body1"
                      sx={(theme) => ({
                        color:
                          rootRoute === route.to
                            ? "#F7A088"
                            : theme.palette.text.primary,
                        ml: {
                          xsm: 0.5,
                          lg: 1,
                        },
                        py: {
                          xsm: 0,
                          lg: 0.5,
                        },
                        display: "flex",
                        alignItems: "center",
                        fontWeight: rootRoute === route.to ? 700 : 600,
                      })}
                    >
                      {route.name}
                    </Typography>
                  </Button>
                </NavLink>
                {route.menuItems?.length > 0 && (
                  <Box
                    id="subMenu"
                    sx={{
                      width: "100%",
                      maxHeight: rootRoute === route.to ? "500px" : "0px",
                      overflow: "hidden",
                      transition: "max-height 1s",
                    }}
                  >
                    {route.menuItems?.map((item: any, index: number) => {
                      return (
                        <NavLink
                          to={item.disable ? "#" : item.to}
                          key={item.to + index}
                          style={{ textDecoration: "none" }}
                        >
                          <Button
                            onClick={() => {
                              if (isMobile) {
                                setOpen(false);
                              }
                              if (item.disable) {
                                popUpMessage(item.disableMessage || "");
                                return;
                              }
                            }}
                            sx={(theme) => ({
                              minHeight: "50px",
                              width: "100%",
                              backgroundColor: "inherit",
                              py: 0,
                              display: "flex",
                              justifyContent: {
                                xs: "left",
                                xsm: "center",
                                md: "center",
                                lg: "left",
                              },
                              alignItems: "center",
                            })}
                          >
                            <Typography
                              sx={(theme) => ({
                                color: exactRoute.startsWith(item.to)
                                  ? "#F7A088"
                                  : theme.palette.text.primary,
                                fontWeight: exactRoute.startsWith(item.to)
                                  ? 600
                                  : 400,
                                ml: {
                                  xs: 8,
                                  xsm: 0.5,
                                  lg: 9,
                                },
                              })}
                              textAlign={"left"}
                            >
                              {item.name}
                            </Typography>
                          </Button>
                        </NavLink>
                      );
                    })}
                  </Box>
                )}
              </Box>
            );
          })}
        </List>
        {/* <Box
          sx={{
            width: "100%",
            position: "relatve",
            backgroundColor: "black",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Button
             
            sx={{
              position: "fixed",
              bottom: "50px",
              width: {
                xs: "200px",
                xsm: "75px",
                md: "75px",
                lg: "200px",
              },
              height: "38px",
              border: "1px solid #F7A088",
              color: "#F7A088",
              borderRadius: 2,
              backgroundColor: "transparent",
              minWidth: "75px",
            }}
          >
            Support
          </Button>
        // </Box> */}
      </SwipeableDrawer>
    </>
  );
};
export default SideBar;
