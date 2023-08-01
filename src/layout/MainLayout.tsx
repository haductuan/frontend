import { Box } from "@mui/system";
import React, { ReactNode } from "react";
import SideBar from "./SideBar";
import bgImage from "src/assets/image/Identity/backgroundImg2x.png";
import { useLocation } from "react-router-dom";
export default function MainLayout({ children }: { children: ReactNode }) {
  const location = useLocation();

  return (
    <Box
      sx={(theme) => ({
        backgroundColor: theme.palette.background.default,
        minHeight: "100vh",
        display: "flex",
        flexDirection: "row",
        width: "100%",
      })}
    >
      <Box>
        <SideBar />
      </Box>
      <Box
        sx={(theme) => ({
          backgroundColor: theme.palette.background.default,
          overflowX: "scroll",
          width: "100%",
          // backgroundImage: {
          //   xs: "#",
          //   xsm:
          //     location.pathname === "/getting-started"
          //       ? "none"
          //       : `url(${bgImage})`,
          // },
          backgroundAttachment: "fixed",
          backgroundRepeat: "no-repeat",
          backgroundPosition: {
            xs: "98% 100%",
          },
          backgroundSize: "131px 233px",
        })}
      >
        {children}
      </Box>
    </Box>
  );
}
