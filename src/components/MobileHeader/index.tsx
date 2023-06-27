import React from "react";
import {
  Box,
  Breadcrumbs,
  Grid,
  Typography,
  Button,
  colors,
} from "@mui/material";
import { NavLink, useLocation } from "react-router-dom";
import IdentityWallet from "../wallet";

interface headerProps {
  title1: string;
  title2?: string;
  description: string;
  by?: string;
  children?: React.ReactNode;
}

const MobileHeader = () => {
  return <Box>Mobile header</Box>;
};

export default MobileHeader;
