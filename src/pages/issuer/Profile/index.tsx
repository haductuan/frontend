import { Box } from "@mui/system";
import { useSnackbar } from "notistack";
import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useIdWalletContext } from "src/context/identity-wallet-context";
import { useIssuerContext } from "src/context/issuerContext";

const Profile = () => {
  const { isUnlocked } = useIdWalletContext();
  const { enqueueSnackbar } = useSnackbar();
  const { endpointUrl } = useIssuerContext();
  const history = useHistory();
  useEffect(() => {
    if (
      !isUnlocked ||
      !localStorage.getItem("ziden-db/issuer-jwz") ||
      !localStorage.getItem("ziden-db/issuer-id")
    ) {
      history.push("/issuer/profile/signin");
    } else {
      history.push("/issuer/profile/detail");
    }
  }, [isUnlocked, history, enqueueSnackbar, endpointUrl]);
  return <Box></Box>;
};
export default Profile;
