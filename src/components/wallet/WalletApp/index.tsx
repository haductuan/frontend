import { Box } from "@mui/system";
import React, { useEffect } from "react";
import { useIdWalletContext } from "src/context/identity-wallet-context";
import Unlock from "./components/Unlock";
import UserAccount from "src/components/wallet/WalletApp/components/UserAccount";
import NewUser from "src/components/wallet/WalletApp/components/NewUser";

const WalletApp = () => {
  const { isNewUser, updateUserData, isUnlocked } = useIdWalletContext();
  useEffect(() => {
    updateUserData();
  }, [updateUserData]);
  return (
    <Box
      id="demo-ziden-wallet-app"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        backgroundColor: "#FFFEFC",
        width: " 324px",
        px: 3,
        py: 2,
        borderRadius: 2,
        boxShadow: "0px 3px 6px #00000033",
      }}
    >
      {isNewUser && <NewUser />}
      {!isNewUser && isUnlocked && <UserAccount />}
      {!isNewUser && !isUnlocked && <Unlock />}
    </Box>
  );
};
export default WalletApp;
