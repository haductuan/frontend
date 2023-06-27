import { Button, TextField } from "@mui/material";
import { Box } from "@mui/system";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { useIdWalletContext } from "src/context/identity-wallet-context";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

interface changePasswordProps {
  setPage: any;
}
const ChangePassword = ({ setPage }: changePasswordProps) => {
  const { keyContainer, updateUserData } = useIdWalletContext();
  const { enqueueSnackbar } = useSnackbar();
  const [currentPassword, setCurrentPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [helperText1, setHelperText1] = useState<string>("");
  const [helperText2, setHelperText2] = useState<string>("");
  const [helperText3, setHelperText3] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const handleSubmitButton = async () => {
    await updateUserData();
    setHelperText1("");
    setHelperText2("");
    setHelperText3("");
    if (!newPassword) {
      setHelperText2("New Password cannot be empty!");
      return;
    }
    if (newPassword !== confirmPassword) {
      setHelperText3("New Password doesn't match!");
      return;
    }
    if (currentPassword === newPassword) {
      setHelperText2("New password is identical to current password!");
      return;
    }
    if (newPassword.length < 8 || newPassword.length > 30) {
      setHelperText2("Password length must be between 8 - 30 character!");
      return;
    }
    if (newPassword.charAt(0) !== newPassword.charAt(0).toUpperCase()) {
      setHelperText2("Password needs to start with uppercase letter!");
      return;
    }
    // const masterSeedEncrypted = keyContainer.getMasterSeed();
    /**
     * Data that need to be re-encrypted:
     * - ziden-user-masterseed
     * - ziden-privateKeyEncrypted
     * - auth-claim
     * - userID
     * - claims
     */

    const encryptionKey = keyContainer.getEncryptionKey(currentPassword);
    if (Buffer.compare(encryptionKey, keyContainer.encryptionKey) === 0) {
      const mnemonics = keyContainer.getMasterSeedDecrypted();
      const privateKey = keyContainer.decryptFromDB(
        "ziden-privateKeyEncrypted"
      );
      const authClaim = keyContainer.decryptFromDB("auth-claim");
      const userID = keyContainer.decryptFromDB("userID");
      const dataKey = keyContainer.decryptFromDB("ziden-data-key");
      // console.log(
      //   "🚀 ~ file: UserAccount.tsx:82 ~ handleSubmitButton ~ dataKey",
      //   dataKey
      // );
      // const allClaimDecrypted = getAllUserClaim().map((claim, index) => {
      //   return {
      //     id: claim.id,
      //     claimDecrypted: keyContainer.decryptFromDB(
      //       `ziden-user-claims/${claim.id}`
      //     ),
      //   };
      // });
      // console.log(
      //   "🚀 ~ file: UserAccount.tsx ~ line 88 ~ allClaimDecrypted ~ allClaimDecrypted",
      //   allClaimDecrypted
      // );
      keyContainer.unlock(newPassword);
      if (dataKey) {
        keyContainer.encryptAndStore(dataKey, "ziden-data-key");
      } else {
        return;
      }
      if (mnemonics !== "") {
        keyContainer.encryptAndStore(mnemonics, "ziden-user-masterseed");
      }
      if (privateKey !== "") {
        keyContainer.encryptAndStore(privateKey, "ziden-privateKeyEncrypted");
      }
      if (authClaim !== "") {
        keyContainer.encryptAndStore(authClaim, "auth-claim");
      }
      if (userID !== "") {
        keyContainer.encryptAndStore(userID, "userID");
      }
      //re encrypt user keys
      keyContainer.setMasterSeed(mnemonics);
      enqueueSnackbar("Change password success!", {
        variant: "success",
      });
      setPage(0);
    } else {
      setHelperText1("Wrong Password!");
    }
  };

  useEffect(() => {
    const handleKeyPress = (event: any) => {
      if (event.keyCode === 13) {
        handleSubmitButton();
      }
    };
    window.addEventListener("keypress", handleKeyPress);
    return () => {
      window.removeEventListener("keypress", handleKeyPress);
    };
  });
  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        pt: 2,
        "& .MuiFormHelperText-root": {
          color: "red",
        },
      }}
    >
      <TextField
        fullWidth
        label="Current password"
        onChange={(e) => setCurrentPassword(e.target.value)}
        sx={{
          mb: 2,
        }}
        type={showPassword ? "text" : "password"}
        InputProps={{
          endAdornment: (
            <Button
              onMouseDown={() => {
                setShowPassword(true);
              }}
              onMouseUp={() => {
                setShowPassword(false);
              }}
              onTouchStart={() => {
                setShowPassword(true);
              }}
              onTouchEnd={() => {
                setShowPassword(false);
              }}
              sx={{
                backgroundColor: "inherit",
                minWidth: "0px",
              }}
            >
              {showPassword ? (
                <VisibilityOffIcon
                  sx={{
                    color: "#9A9A9A",
                  }}
                />
              ) : (
                <VisibilityIcon
                  sx={{
                    color: "#9A9A9A",
                  }}
                />
              )}
            </Button>
          ),
        }}
        helperText={helperText1}
      />
      <TextField
        fullWidth
        label="New password"
        onChange={(e) => setNewPassword(e.target.value)}
        sx={{
          mb: 2,
        }}
        type={showPassword ? "text" : "password"}
        InputProps={{
          endAdornment: (
            <Button
              onMouseDown={() => {
                setShowPassword(true);
              }}
              onMouseUp={() => {
                setShowPassword(false);
              }}
              onTouchStart={() => {
                setShowPassword(true);
              }}
              onTouchEnd={() => {
                setShowPassword(false);
              }}
              sx={{
                backgroundColor: "inherit",
                minWidth: "0px",
              }}
            >
              {showPassword ? (
                <VisibilityOffIcon
                  sx={{
                    color: "#9A9A9A",
                  }}
                />
              ) : (
                <VisibilityIcon
                  sx={{
                    color: "#9A9A9A",
                  }}
                />
              )}
            </Button>
          ),
        }}
        helperText={helperText2}
      />
      <TextField
        fullWidth
        label="Confirm password"
        onChange={(e) => setConfirmPassword(e.target.value)}
        sx={{
          mb: 2,
        }}
        type={showPassword ? "text" : "password"}
        InputProps={{
          endAdornment: (
            <Button
              onMouseDown={() => {
                setShowPassword(true);
              }}
              onMouseUp={() => {
                setShowPassword(false);
              }}
              onTouchStart={() => {
                setShowPassword(true);
              }}
              onTouchEnd={() => {
                setShowPassword(false);
              }}
              sx={{
                backgroundColor: "inherit",
                minWidth: "0px",
              }}
            >
              {showPassword ? (
                <VisibilityOffIcon
                  sx={{
                    color: "#9A9A9A",
                  }}
                />
              ) : (
                <VisibilityIcon
                  sx={{
                    color: "#9A9A9A",
                  }}
                />
              )}
            </Button>
          ),
        }}
        helperText={helperText3}
      />
      <Box
        sx={{
          mt: 2.5,
        }}
      >
        <Button
          fullWidth
          variant="contained"
          onClick={() => handleSubmitButton()}
          sx={{
            mb: 1,
          }}
        >
          Sumbit
        </Button>
      </Box>
    </Box>
  );
};

export default ChangePassword;
