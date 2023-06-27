import React, { useState } from "react";
import { Typography, Box, Input, TextField, Button, Link } from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

interface passwordFormType {
  password: string;
  confirm: string;
}

interface passwordFormProps {
  setPasswordFormData: any;
  helperText: string;
}
const CreatePasswordForm = (props: passwordFormProps) => {
  const [checked, setChecked] = React.useState(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleCheckBoxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
    props.setPasswordFormData((prev: passwordFormType) => {
      return {
        ...prev,
        checked: event.target.checked,
      };
    });
  };
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        justifyContent: "space-between",
      }}
    >
      <Box
        sx={{
          width: "100%",
        }}
        id="demo-password-input"
      >
        <Typography
          sx={{
            fontSize: "1.25rem",
            fontWeight: 700,
            color: "#114898",
            lineHeight: "1.6875rem",
            pb: 1,
          }}
        >
          Create password
        </Typography>
        <TextField
          type={showPassword ? "text" : "password"}
          fullWidth
          variant="outlined"
          onChange={(e) => {
            props.setPasswordFormData((prev: passwordFormType) => {
              return {
                ...prev,
                password: e.target.value,
              };
            });
          }}
          placeholder="Enter password"
          sx={{
            pb: 2,
          }}
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
        <TextField
          type={showPassword ? "text" : "password"}
          fullWidth
          variant="outlined"
          onChange={(e) => {
            props.setPasswordFormData((prev: passwordFormType) => {
              return {
                ...prev,
                confirm: e.target.value,
              };
            });
          }}
          placeholder="Confirm password"
          sx={{
            pb: 0.5,
          }}
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
        {props.helperText !== "" && (
          <Typography variant="body2" color="#D60000">
            {props.helperText}
          </Typography>
        )}
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
        }}
      >
        <Checkbox
          id="demo-term-of-use-checkbox"
          checked={checked}
          onChange={handleCheckBoxChange}
          inputProps={{ "aria-label": "controlled" }}
          sx={{
            ml: -1.5,
            "& .MuiSvgIcon-root": {
              color: "#F7A088",
            },
          }}
        />
        <Typography
          fontSize={"0.75rem"}
          display={"flex"}
          alignItems={"center"}
          color={"secondary"}
          fontWeight={500}
        >
          I have read and agree to
          <Link
            href="https://docs.ziden.io/terms-and-policies/terms-of-service"
            target="_blank"
            style={{
              fontWeight: 700,
              marginLeft: "5px",
              display: "inline-block",
              textDecoration: "none",
              color: "#114898",
            }}
          >
            the terms of use
          </Link>
        </Typography>
      </Box>
    </Box>
  );
};

export default CreatePasswordForm;
