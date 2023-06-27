import { Button, CircularProgress, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { useState } from "react";
import CreatePasswordForm from "../CreatePasswordForm";
import CloseIcon from "@mui/icons-material/Close";
import zidenLogo from "src/assets/image/logo/ziden_logo_desktop_2x.png";
import { useIdWalletContext } from "src/context/identity-wallet-context";
import { useSnackbar } from "notistack";
import Congrat from "../Congrat";

const CreateWithOraiWallet = ({ goBack }: { goBack: any }) => {
  const [activeStep, setActiveStep] = useState(0);
  const { enqueueSnackbar } = useSnackbar();
  const { keyContainer, updateUserData, setOpen } = useIdWalletContext();
  const [loading, setLoading] = useState<boolean>(false);
  const [passwordFormData, setPasswordFormData] = useState<any>({
    password: "",
    confirm: "",
    checked: false,
  });
  const [helperText, setHelperText] = useState<string>("");

  const handleConfirmStep1 = async () => {
    if (!passwordFormData.password || !passwordFormData.confirm) {
      // check empty field
      setHelperText("Field is empty!");
      return;
    }

    if (passwordFormData.password !== passwordFormData.confirm) {
      // check password match
      setHelperText("Password doesn't match");
      return;
    }
    if (
      passwordFormData.password.length < 8 ||
      passwordFormData.password.length > 30
    ) {
      // check password strenght
      setHelperText("Password length must be between 8 - 30 character!");
      return;
    }
    if (
      passwordFormData.password.charAt(0) !==
      passwordFormData.password.charAt(0).toUpperCase()
    ) {
      // check password uppercase first letter
      setHelperText("Password needs to start with uppercase letter!");
      return;
    }
    if (!passwordFormData.checked) {
      setHelperText("Please agree to our terms of use!");
      return;
    }
    setLoading(true);
    //@ts-ignore
    if (!window.ethereum.version) {
      enqueueSnackbar("Please install orai pro wallet!", {
        variant: "warning",
      });
    } else {
      keyContainer.unlock(passwordFormData.password);
      try {
        //@ts-ignore
        const result = await window.ethereum.request({
          method: "eth_signWithEddsaPrivKey",
          params: ["123456789"],
        });
        const publicKey = JSON.parse(result.result).pub_key.map(
          (partOfKey: any) => {
            return window.zidenParams.F.toObject(
              Uint8Array.from(Buffer.from(partOfKey, "hex"))
            );
          }
        );
        await keyContainer.generateZidenKeyFromPublicKey(publicKey);
        setActiveStep((prev: number) => prev + 1);
      } catch (err) {
        keyContainer.lock();
      }
    }
    setLoading(false);
  };
  return (
    <Box
      sx={{
        width: "100%",
        "& .MuiLinearProgress-root": {
          width: "100%",
        },
        height: "100%",
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
      {!loading && (
        <>
          {activeStep === 0 && (
            <CreatePasswordForm
              helperText={helperText}
              setPasswordFormData={setPasswordFormData}
            />
          )}
          {activeStep === 1 && <Congrat />}
          <Box
            sx={{
              width: "100%",
              mt: 3,
            }}
          >
            <Button
              fullWidth
              sx={{
                height: "36px",
                mb: 1,
              }}
              onClick={() => {
                if (activeStep === 0) {
                  handleConfirmStep1();
                } else {
                  updateUserData();
                }
              }}
              variant="contained"
              color="primary"
            >
              <Typography>
                {activeStep === 0 ? "Confirm" : "I got it"}
              </Typography>
            </Button>
            {activeStep !== 1 && (
              <Button
                sx={{
                  height: "36px",
                }}
                fullWidth
                onClick={goBack}
                variant="outlined"
                color="primary"
              >
                <Typography>Cancel</Typography>
              </Button>
            )}
          </Box>
        </>
      )}
      {loading && (
        <Box
          sx={{
            width: "100%",
            minHeight: "400px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CircularProgress
            sx={{
              width: "100%",
            }}
          />
          <Typography variant="h4" color="text.secondary">
            {" "}
            Signing the message in OPW
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default CreateWithOraiWallet;
