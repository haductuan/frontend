import React from "react";
import { Typography, Box } from "@mui/material";
import congratulationImage from "../../../../assets/image/Congrat2x.png";
import { CongratIcon } from "src/constants/icon";

const Congrat = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        justifyContent: "space-evenly",
        pb: 6,
      }}
    >
      <Typography
        sx={{
          fontSize: "1.25rem",
          fontWeight: 700,
          color: "#114898",
          lineHeight: "1.6875rem",
        }}
      >
        Congratulation
      </Typography>
      <Typography
        sx={{
          pt: 1,
          pb: 3,
          fontSize: "0.875rem",
          fontWeight: 500,
          color: "#646A71",
          lineHeight: "1.1875rem",
        }}
      >
        You are ready to use Wallet!
      </Typography>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          mt: 3,
        }}
      >
        {/* <img
          width={"135px"}
          height={"135px"}
          src={congratulationImage}
          alt="Congratulation"
        /> */}
        <CongratIcon
          sx={{
            // width: "135px",
            // height: "135px",
            fontSize: "9rem",
          }}
        />
      </Box>
    </Box>
  );
};
export default Congrat;
