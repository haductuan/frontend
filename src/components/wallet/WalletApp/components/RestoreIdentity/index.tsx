import { Button } from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import { useIdWalletContext } from "src/context/identity-wallet-context";
import RestoreAccountForm from "src/components/wallet/WalletApp/components/RestoreAccountForm";
import zidenLogo from "src/assets/image/logo/ziden_logo_desktop_2x.png";
import CloseIcon from "@mui/icons-material/Close";
import Congrat from "src/components/wallet/WalletApp/components/Congrat";
import { LoadingButton } from "@mui/lab";

interface restoreDataType {
  mnemonics: string;
  newPassword: string;
  newPasswordConfirm: string;
}

const RestoreIdentity = () => {
  const { keyContainer, updateUserData, goBack, setOpen, syncClaim } =
    useIdWalletContext();
  const [loading, setLoading] = useState<boolean>(false);
  const [restoreData, setRestoreData] = useState<restoreDataType>({
    mnemonics: "",
    newPassword: "",
    newPasswordConfirm: "",
  });
  const [isDone, setIsDone] = useState(false);
  const [helperText1, setHelperText1] = useState("");
  const [helperText2, setHelperText2] = useState("");
  const [helperText3, setHelperText3] = useState("");
  const checkRestoreData = () => {
    let isValid = true;
    if (!restoreData.mnemonics) {
      setHelperText1("Mnemonics is empty!");
      setHelperText2("");
      setHelperText3("");
      return false;
    }
    if (
      restoreData.newPassword.length < 8 ||
      restoreData.newPassword.length > 30
    ) {
      setHelperText2(
        "Password length needs to be between 8 and 30 characters!"
      );
      setHelperText1("");
      setHelperText3("");
      return false;
    }
    if (restoreData.newPassword !== restoreData.newPasswordConfirm) {
      setHelperText3("New password doesn't match!");
      setHelperText2("");
      setHelperText1("");
      return false;
    }
    if (
      restoreData.newPassword.charAt(0) !==
      restoreData.newPassword.charAt(0).toUpperCase()
    ) {
      // check password uppercase first letter
      setHelperText2("Password needs to start with uppercase letter!");
      setHelperText1("");
      setHelperText3("");
      return false;
    }
    return isValid;
  };
  const handleConfirm = async () => {
    if (checkRestoreData()) {
      try {
        setLoading(true);
        keyContainer.unlock(restoreData.newPassword.trim());
        keyContainer.setMasterSeed(restoreData.mnemonics.trim());
        await keyContainer.generateZidenKeyFromMasterSeed(
          restoreData.mnemonics
        );
        await syncClaim();
        setLoading(false);
        // updateUserData();
        setIsDone(true);
      } catch (err: any) {
        setHelperText1(err.message);
        setHelperText2("");
        setHelperText3("");
        console.log(err.message);
      }
    }
  };
  useEffect(() => {
    const handleKeyPress = (event: any) => {
      if (event.keyCode === 13) {
        if (!isDone) {
          handleConfirm();
        }
        if (isDone) {
          updateUserData();
        }
      }
    };
    window.addEventListener("keypress", handleKeyPress);
    return () => {
      window.removeEventListener("keypress", handleKeyPress);
    };
  });
  const handleBack = () => {
    goBack();
  };
  //   useEffect(() => {
  //     console.log(restoreData);
  //   }, [restoreData]);
  return (
    <Box
      sx={{
        width: "100%",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          mt: 0,
          mb: 3,
        }}
      >
        <img width={"83px"} height={"25px"} src={zidenLogo} alt="Ziden" />

        <Button
          sx={{
            minWidth: "0px",
            mr: -1,
            backgroundColor: "transparent",
          }}
          onClick={() => setOpen(false)}
        >
          <CloseIcon
            sx={{
              color: "#646A71",
              fontSize: "1.4rem",
            }}
          />
        </Button>
      </Box>
      {!isDone && (
        <RestoreAccountForm
          setRestoreData={setRestoreData}
          helperText1={helperText1}
          helperText2={helperText2}
          helperText3={helperText3}
        />
      )}
      {isDone && <Congrat />}
      <Box
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItem: "center",
        }}
      >
        {!isDone && (
          <LoadingButton
            loading={loading}
            fullWidth
            variant="contained"
            sx={{
              mb: 1,
            }}
            onClick={handleConfirm}
          >
            Confirm
          </LoadingButton>
        )}
        {isDone && (
          <Button
            fullWidth
            onClick={() => updateUserData()}
            sx={{
              mb: 1,
            }}
            variant="contained"
          >
            I got it
          </Button>
        )}
        {!isDone && (
          <Button
            fullWidth
            variant="outlined"
            sx={{
              mb: 1,
            }}
            onClick={handleBack}
          >
            Back
          </Button>
        )}
      </Box>
    </Box>
  );
};
export default RestoreIdentity;
