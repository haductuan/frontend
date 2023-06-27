import { Typography } from "@mui/material";
import { Box } from "@mui/system";

const KYCProgress = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
      }}
    >
      <Typography textAlign="center" variant="h5" color="#52B95F">
        Your profile has been submitted.
      </Typography>
      <Typography textAlign="center" variant="body1" color="#000D1C">
        We will inform you when the process is finished.
      </Typography>
    </Box>
  );
};
export default KYCProgress;
