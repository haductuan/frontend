import { TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import Button from "@mui/material/Button";
import React, { useState } from "react";
import { useIdWalletContext } from "src/context/identity-wallet-context";

const RequirePassword = ({ setPage }: any) => {
  const [password, setPassword] = useState<string>("");
  const { validatePassword } = useIdWalletContext();

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <Typography
        sx={{
          my: 3,
        }}
      >
        Password required!
      </Typography>
      <TextField
        fullWidth
        placeholder="Enter password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          py: 2,
          width: "100%",
        }}
      >
        <Button
          sx={{
            mb: 2,
          }}
          variant="outlined"
          fullWidth
          onClick={() => setPage(0)}
        >
          Back
        </Button>
        <Button
          variant="contained"
          fullWidth
          onClick={async () => {
            const validateResult = await validatePassword(password.toString());
            // if (validateResult) {
            //   ();
            // }
          }}
        >
          Confirm
        </Button>
      </Box>
    </Box>
  );
};
export default RequirePassword;
