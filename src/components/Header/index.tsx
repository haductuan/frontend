import React from "react";
import {
  Box,
  Breadcrumbs,
  Grid,
  SxProps,
  Theme,
  Typography,
} from "@mui/material";
import { NavLink, useLocation } from "react-router-dom";
import IdentityWallet from "../wallet";
import { useDeviceContext } from "src/context/deviceContext";

interface headerProps {
  title1: React.ReactNode;
  title2?: React.ReactNode;
  description?: Array<React.ReactNode>;
  by?: React.ReactNode;
  children?: React.ReactNode;
  sx?: SxProps<Theme>;
}
const Header = ({
  title1,
  title2,
  description,
  by,
  children,
  sx = [],
}: headerProps) => {
  const { isMobile } = useDeviceContext();
  const currentRoute = useLocation();
  const path = currentRoute.pathname;
  const isRootRoute = (path: string) => {
    const links = path.split("/");
    if (links.length > 2) {
      return false;
    } else {
      return true;
    }
  };
  const capitalizeFirstLetter = (string: string) => {
    // format route
    return string.charAt(0).toUpperCase() + string.slice(1);
  };
  const parseRoute = (path: string) => {
    //hidden id in paths with id
    const pathsWithID = ["request", "attestation", "portal", "verification"];
    const paths = path.split("/").slice(1);
    var result: any = [];
    var current = "";
    for (var i = 0; i < paths.length; i++) {
      if (pathsWithID.includes(paths[i])) {
        result.push({
          path: `/#`,
          displayPath: capitalizeFirstLetter(paths[i]),
        });
        break;
      } else {
        current += paths[i];
        result.push({
          path: `${current}`,
          displayPath: capitalizeFirstLetter(paths[i]),
        });
        current += `/`;
      }
    }
    return result;
  };
  const getLastActivePath = (path: string) => {
    const pathArray = parseRoute(path);
    return pathArray[pathArray.length - 1].path;
  };

  return (
    <Box
      id="ziden-header"
      sx={[
        (theme) => ({
          backgroundColor: theme.palette.background.header,
          width: "100%",
          px: {
            xs: 2,
            xsm: 2,
            md: 3,
            lg: 6,
          },
          pt: 2.5,
          pb: 4,
          mt: {
            xs: 7,
            xsm: 0,
          },
          minHeight: {
            xs: "auto",
            xsm: "260px",
          },
          display: "flex",
          flexDirection: "column",
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      <Box
        sx={{
          minHeight: "50px",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        {!isRootRoute(path) && (
          <Breadcrumbs
            sx={{
              "& .MuiBreadcrumbs-separator": {
                color: "#FFFFFC",
              },
            }}
          >
            {parseRoute(path).map((item: any, index: number) => {
              return (
                <NavLink
                  style={{ textDecoration: "none" }}
                  key={item + index}
                  to={`/${item.path}`}
                >
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight:
                        getLastActivePath(path) === item.path ? 600 : 400,
                    }}
                  >
                    {item.displayPath}
                  </Typography>
                </NavLink>
              );
            })}
          </Breadcrumbs>
        )}
        {isRootRoute(path) && <Box />}
        {!isMobile && (
          <Box
            sx={{
              position: "absolute",
              top: "12px",
              right: {
                xs: "8px",
                xsm: "16px",
                md: "16px",
                lg: "40px",
              },
              "#ziden-wallet": {
                backgroundColor: "#FFC251",
              },
            }}
          >
            <IdentityWallet type={0} />
          </Box>
        )}
      </Box>
      <Grid container>
        <Grid item lg={6} xsm={12} md={8} sm={8} xs={12}>
          <Box
            sx={{
              minHeight: "140px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
            }}
          >
            <Box
              sx={{
                mb: 2,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                // flexGrow: 1,
              }}
            >
              <Typography variant="h1" color={"text.secondary"}>
                {title1}
              </Typography>
              {title2 && (
                <Typography variant="h2" color={"text.secondary"}>
                  {title2}
                </Typography>
              )}
              {by && (
                <Typography
                  variant="h6"
                  sx={{
                    color: "#FFFFFC",
                    opacity: 0.75,
                    fontWeight: 500,
                  }}
                >
                  Hosted by {by}
                </Typography>
              )}
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
                opacity: 0,
              }}
            >
              {description?.map((data: any, index: number) => {
                return (
                  <Typography
                    key={data + index}
                    variant="body2"
                    sx={{
                      opacity: 0.75,
                    }}
                    color={"text.secondary"}
                  >
                    {data}
                  </Typography>
                );
              })}
            </Box>
          </Box>
        </Grid>
        <Grid
          id="tt"
          item
          xs={12}
          xsm={12}
          md={4}
          lg={6}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            justifyContent: "flex-end",
            width: "100%",
          }}
        >
          {children && <>{children}</>}
        </Grid>
      </Grid>
    </Box>
  );
};
export default Header;
