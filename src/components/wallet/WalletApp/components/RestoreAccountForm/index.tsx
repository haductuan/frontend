import { Button, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

interface restoreAccountProps {
  setRestoreData: any;
  helperText1: any;
  helperText2: any;
  helperText3: any;
}

const RestoreAccountForm = ({
  setRestoreData,
  helperText1,
  helperText2,
  helperText3,
}: restoreAccountProps) => {
  const [showPassword, setShowPassword] = React.useState<boolean>(false);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        justifyContent: "space-evenly",
        pb: 3,
        "& .MuiFormHelperText-root": {
          color: "#D60000",
        },
      }}
    >
      <Typography
        sx={{
          color: "#114898",
          fontSize: "1.25rem",
          fontWeight: 700,
          lineHeight: "1.6875rem",
        }}
      >
        Restore account
      </Typography>
      <TextField
        sx={{
          mb: 1,
        }}
        placeholder="12-word recovery phase"
        helperText={helperText1}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setRestoreData((prev: any) => {
            return {
              ...prev,
              mnemonics: e.target.value,
            };
          })
        }
      />
      <TextField
        sx={{
          mb: 1,
        }}
        type={showPassword ? "text" : "password"}
        placeholder="enter password"
        helperText={helperText2}
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
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setRestoreData((prev: any) => {
            return {
              ...prev,
              newPassword: e.target.value,
            };
          })
        }
      />
      <TextField
        sx={{
          mb: 1,
        }}
        type={showPassword ? "text" : "password"}
        placeholder="confirm password"
        helperText={helperText3}
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
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setRestoreData((prev: any) => {
            return {
              ...prev,
              newPasswordConfirm: e.target.value,
            };
          })
        }
      />
    </Box>
  );
};

export default RestoreAccountForm;
