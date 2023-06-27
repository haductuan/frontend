import { Box, Paper, Typography } from "@mui/material";

const UnlockWalletWarning = () => {
  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Paper
        sx={{
          width: "100%",
          maxWidth: "500px",
          minHeight: "370px",
          display: "flex",
          justifyContent: "center",
          borderRadius: 4,
          py: 5,
        }}
      >
        <Typography variant="h3">Please unlock your wallet</Typography>
      </Paper>
    </Box>
  );
};
export default UnlockWalletWarning;
