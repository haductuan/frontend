import { Box } from "@mui/system";
import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useIdWalletContext } from "src/context/identity-wallet-context";

const Profile = () => {
  const { isUnlocked, keyContainer } = useIdWalletContext();
  const history = useHistory();
  useEffect(() => {
    if (
      !isUnlocked ||
      !keyContainer.db.get("verifier-jwz") ||
      !keyContainer.db.get("verifier-id")
    ) {
      history.push("/verifier/profile/signin");
    } else {
      history.push("/verifier/profile/detail");
    }
  }, [isUnlocked, history, keyContainer]);
  return <Box></Box>;
};
export default Profile;
