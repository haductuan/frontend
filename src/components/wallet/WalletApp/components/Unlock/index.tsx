import { TextField, Typography, Button } from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import { useIdWalletContext } from "src/context/identity-wallet-context";
//icon
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import zidenLogoOnly from "src/assets/image/logo/zidenLogoOnly.png";
import CloseIcon from "@mui/icons-material/Close";

import ConfirmReset from "../ConfirmReset";
const Unlock = () => {
  const { unlockWallet, updateUserData, setOpen } = useIdWalletContext();
  const [helperText, setHelperText] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isReset, setIsReset] = useState<Boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleConfirm = async () => {
    const unlockResult = await unlockWallet(password);
    if (unlockResult) {
      await updateUserData();
    } else {
      setHelperText("wrong password!");
    }
  };
  useEffect(() => {
    const handleKeyPress = (event: any) => {
      if (event.keyCode === 13) {
        handleConfirm();
      }
    };
    window.addEventListener("keypress", handleKeyPress);
    return () => {
      window.removeEventListener("keypress", handleKeyPress);
    };
  });
  return (
    <>
      {!isReset && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-end",
              width: "100%",
            }}
          >
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
          <img width="150px" height="150px" src={zidenLogoOnly} alt={"Ziden"} />
          <Typography
            sx={{
              color: "#114898",
              fontSize: "1.25rem",
              fontWeight: 700,
              lineHeight: "1.6875rem",
              py: 2,
            }}
          >
            Welcome Back!
          </Typography>
          <TextField
            fullWidth
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            type={showPassword ? "text" : "password"}
            placeholder="Enter Password"
            sx={{
              mb: 3,
            }}
            helperText={helperText}
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
          />
          <Button fullWidth variant="contained" onClick={handleConfirm}>
            Unlock
          </Button>

          <Typography
            sx={{
              fontSize: "0.75rem",
              fontWeight: 400,
              color: "#646A71",
            }}
          >
            or{" "}
            <span
              style={{
                fontWeight: 700,
                color: "#114898",
                cursor: "pointer",
              }}
              onClick={() => {
                // setCreateIdMethod(2);
                // setIsNewUser(true);
                // console.log("coming soon!");
                setIsReset(true);
              }}
            >
              Reset Wallet
            </span>
          </Typography>
        </Box>
      )}
      {isReset && <ConfirmReset setIsReset={setIsReset} />}
    </>
  );
};

export default Unlock;
