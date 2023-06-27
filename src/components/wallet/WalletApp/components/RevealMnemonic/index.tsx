import { Button, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import { useIdWalletContext } from "src/context/identity-wallet-context";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { useSnackbar } from "notistack";

const RevealMnemonic = ({ setPage }: any) => {
  const [password, setPassword] = useState<string>("");
  const [mnemonic, setMnemonic] = useState<string>("");
  const [helperText, setHelperText] = useState(" ");
  const [showMnemonic, setShowMnemonic] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { validatePassword, keyContainer } = useIdWalletContext();
  const { enqueueSnackbar } = useSnackbar();

  const saveFile = async (blob: any) => {
    const a = document.createElement("a");
    a.download = "Mnemonic.json";
    a.href = URL.createObjectURL(blob);
    a.addEventListener("click", (e) => {
      setTimeout(() => URL.revokeObjectURL(a.href), 30 * 1000);
    });
    a.click();
  };
  const handleConfirm = async () => {
    setHelperText(" ");
    const validateResult = await validatePassword(password.toString());
    if (validateResult) {
      setMnemonic(keyContainer.getMasterSeedDecrypted());
      setShowMnemonic(true);
    } else {
      setHelperText("In valid password!");
    }
  };

  useEffect(() => {
    const handleKeyPress = (event: any) => {
      if (!showMnemonic) {
        if (event.keyCode === 13) {
          handleConfirm();
        }
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
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ReportProblemIcon
          sx={{
            color: "red",
            fontSize: "5rem",
            my: 1,
          }}
        />
        <Typography
          color={"#000D1C"}
          textAlign={"center"}
          variant="body2"
          fontWeight={400}
        >
          <span
            style={{
              fontWeight: 600,
            }}
          >
            DO NOT share this phrase with anyone!
          </span>{" "}
          as these words can be used to recover your account.
        </Typography>
      </Box>
      {!showMnemonic && (
        <Box>
          <Typography color={"#000D1C"}>Enter password to continue</Typography>
          <TextField
            fullWidth
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type={showPassword ? "text" : "password"}
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
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              pb: 2,
              pt: 0.2,
              width: "100%",
            }}
          >
            <Button variant="contained" fullWidth onClick={handleConfirm}>
              Confirm
            </Button>
          </Box>
        </Box>
      )}
      {showMnemonic && (
        <Box>
          <Typography color={"#000D1C"}>Your secret recovery phrase</Typography>
          <Box
            sx={{
              mt: 0.5,
              p: 0.5,
              border: "1px solid #114898",
              borderRadius: 2,
            }}
          >
            <Typography color={"#000D1C"} textAlign={"center"}>
              {mnemonic}
            </Typography>
          </Box>
          <Box
            sx={{
              width: "100%",
              display: "flex",
              py: 1,
            }}
          >
            <Button
              variant="outlined"
              color="primary"
              sx={{
                width: "100%",
                mr: 0.5,
              }}
              onClick={() => {
                navigator.clipboard.writeText(mnemonic).then(() => {
                  enqueueSnackbar("User ID copied!", {
                    variant: "success",
                  });
                });
              }}
            >
              Copy
            </Button>
            <Button
              variant="outlined"
              color="primary"
              sx={{
                width: "100%",
                ml: 0.5,
              }}
              onClick={() => {
                const obj = { Mnemonic: mnemonic };
                const blob = new Blob([JSON.stringify(obj, null, 2)], {
                  type: "application/json",
                });
                saveFile(blob);
              }}
            >
              Save to file
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default RevealMnemonic;
