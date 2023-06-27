import React from "react";
import { Button, Typography, Box } from "@mui/material";
import { useIdWalletContext } from "src/context/identity-wallet-context";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";

const ConfirmReset = ({ setIsReset }: { setIsReset: any }) => {
  const { setIsNewUser, setCreateIdMethod, logout, updateUserData } =
    useIdWalletContext();
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <ReportProblemIcon
        sx={{
          color: "red",
          fontSize: "80px",
        }}
      />
      <Typography my={1} variant="h3" color="red" textAlign={"center"}>
        Are you sure you want to erase your wallet
      </Typography>
      <Typography
        color={"#000D1C"}
        my={1}
        variant="body2"
        fontWeight={400}
        textAlign={"center"}
      >
        Your current wallet and datas will be{" "}
        <span
          style={{
            fontWeight: 600,
          }}
        >
          removed from your computer permanently.
        </span>{" "}
        This action cannot be undone.
      </Typography>
      <Typography
        color={"#000D1C"}
        my={1}
        variant="body2"
        fontWeight={400}
        textAlign={"center"}
      >
        You can only recover this wallet with your secret mnemonics
      </Typography>
      <Button
        variant="contained"
        onClick={async () => {
          // setCreateIdMethod(1);
          // localStorage.clear();
          logout();
          await updateUserData();
          setIsNewUser(true);
          window.location.reload();
        }}
        sx={{
          my: 1,
          mx: 3,
          width: "250px",
        }}
      >
        I understand
      </Button>
      <Button
        variant="outlined"
        sx={{
          my: 1,
          mx: 3,
          width: "250px",
        }}
        onClick={() => {
          setIsReset(false);
        }}
      >
        Cancel
      </Button>
    </Box>
  );
};
export default ConfirmReset;
