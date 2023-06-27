import { Button, StepButton, StepLabel } from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect } from "react";

import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import { useState } from "react";
import { useIdWalletContext } from "src/context/identity-wallet-context";
import zidenLogo from "src/assets/image/logo/ziden_logo_desktop_2x.png";
import CloseIcon from "@mui/icons-material/Close";
//pages
import CreatePasswordForm from "../CreatePasswordForm";
import Mnemonics from "../Mnemonics";
import MnemonicsConfirm from "../MnemonicsConfirm";
import Congrat from "../Congrat";

interface createIdentityProps {
  goBack: any;
}

const CreateIdentity = ({ goBack }: createIdentityProps) => {
  const { keyContainer, updateUserData, setOpen } = useIdWalletContext();
  const [activeStep, setActiveStep] = useState(0);
  //passwordform state
  const [passwordFormData, setPasswordFormData] = useState({
    password: "",
    confirm: "",
    checked: false,
  });

  const [pFHelperText, setPFHleperText] = useState<string>(""); // password form helper text
  // mnemonic state
  const [mnemonicsData, setMnemonicsData] = useState<any>();
  const [mnemonics, setMnemonics] = useState("");
  // confirm page state
  const [mnemonicsConfirm, setMnemonicsConfirm] = useState<any>();
  const [pickedIndex, setPickedIndex] = useState<any>([]);
  const [mnHelperText, setMnHelpertText] = useState("");

  //handle confirm button
  const handleConfirmStep1 = () => {
    if (!passwordFormData.password || !passwordFormData.confirm) {
      // check empty field
      setPFHleperText("Field is empty!");
      return;
    }

    if (passwordFormData.password !== passwordFormData.confirm) {
      // check password match
      setPFHleperText("Password doesn't match");
      return;
    }
    if (
      passwordFormData.password.length < 8 ||
      passwordFormData.password.length > 30
    ) {
      // check password strenght
      setPFHleperText("Password length must be between 8 - 30 character!");
      return;
    }
    if (
      passwordFormData.password.charAt(0) !==
      passwordFormData.password.charAt(0).toUpperCase()
    ) {
      // check password uppercase first letter
      setPFHleperText("Password needs to start with uppercase letter!");
      return;
    }
    if (!passwordFormData.checked) {
      setPFHleperText("Please agree to our terms of use!");
      return;
    }
    keyContainer.unlock(passwordFormData.password);
    const generatedMnemonics = keyContainer.generateMasterSeed();
    setMnemonics(generatedMnemonics);
    var mnemonicsObject: { [index: number]: string } = {};
    generatedMnemonics.split(" ").map((word: string, index: number) => {
      // convert mnemonics string to mnemonic object
      mnemonicsObject[index] = word;
      return 0;
    });
    setMnemonicsData(mnemonicsObject);
    //choose random 4 word from mnemonics
    const allkeys: Array<string> = Object.keys(mnemonicsObject);
    const random = [...allkeys].sort(() => 0.5 - Math.random());
    setPickedIndex(
      random.slice(0, 4).sort((a: string, b: string) => {
        return parseInt(a) - parseInt(b);
      })
    );
    setActiveStep((prev) => prev + 1);
  };
  const handleConfirmStep2 = () => {
    setActiveStep((prev) => prev + 1);
  };
  const checkFinalConfirm = () => {
    let isValid = true;
    if (!mnemonicsConfirm) {
      setMnHelpertText("Please fill all required word!");
      return false;
    }
    for (const k in mnemonicsConfirm) {
      if (!mnemonicsConfirm[k]) {
        setMnHelpertText("Please fill all required word!");
        isValid = false;
        break;
      }
      if (mnemonicsData[k] !== mnemonicsConfirm[k]) {
        setMnHelpertText("Wrong position!");
        isValid = false;
        break;
      }
    }
    return isValid;
  };

  const handleFinalConfirm = async () => {
    const isValid = checkFinalConfirm();
    if (isValid) {
      keyContainer.setMasterSeed(mnemonics);
      await keyContainer.generateZidenKeyFromMasterSeed(mnemonics);
      setActiveStep((prev: number) => prev + 1);
      // updateUserData();
    }
  };
  const handleConfirm = () => {
    switch (activeStep) {
      case 0:
        handleConfirmStep1();
        break;
      case 1:
        handleConfirmStep2();
        break;
      case 2:
        handleFinalConfirm();
        break;
      // case 3:
      //   handleFinalConfirm();
      //   break;
      default:
        break;
    }
  };
  useEffect(() => {
    const handleKeyPress = (event: any) => {
      if (event.keyCode === 13) {
        if (activeStep < 3) {
          handleConfirm();
        }
        if (activeStep === 3) {
          updateUserData();
        }
      }
    };
    window.addEventListener("keypress", handleKeyPress);
    return () => {
      window.removeEventListener("keypress", handleKeyPress);
    };
  });
  const steps = [
    "Select master blaster campaign settings",
    "Create an ad group",
    "Create an ad",
  ];
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
      <Stepper
        sx={{
          "& .MuiSvgIcon-root.Mui-completed": {
            color: "#52B95F",
          },
          "& .Mui-disabled .MuiSvgIcon-root": {
            color: "#ECECEC",
            border: "2px solid #ECECEC",
            borderRadius: "50%",
            boxSizing: "border-box",
          },
          "& .Mui-disabled .MuiStepIcon-text": {
            fill: "#929292",
          },

          "& .Mui-active .MuiSvgIcon-root": {
            border: "2px solid #114898",
            borderRadius: "50%",
            color: "#ECECEC",
            boxSizing: "border-box",
          },
          "& .Mui-active .MuiStepIcon-text": {
            fill: "#929292",
          },
        }}
        nonLinear={false}
        activeStep={activeStep}
        alternativeLabel
      >
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel />
          </Step>
        ))}
      </Stepper>
      <Box
        sx={{
          mt: 3,
        }}
      >
        {activeStep === 0 && (
          <CreatePasswordForm
            helperText={pFHelperText}
            setPasswordFormData={setPasswordFormData}
          />
        )}
        {activeStep === 1 && <Mnemonics mnemonicsData={mnemonicsData} />}
        {activeStep === 2 && (
          <MnemonicsConfirm
            mnemonicsData={mnemonicsData}
            setMnemonicsConfirm={setMnemonicsConfirm}
            pickedIndex={pickedIndex}
            helperText={mnHelperText}
          />
        )}
        {activeStep === 3 && <Congrat />}
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        {activeStep < 3 && (
          <Button
            id="demo-confirm-button"
            fullWidth
            variant="contained"
            component={StepButton}
            onClick={() => handleConfirm()}
            sx={{
              mb: 1,
              height: "36px",
              "& .MuiStepLabel-label": {
                color: "#FFFFFC",
                fontWeight: 600,
                fontSize: "0.875rem",
              },
            }}
          >
            Confirm
          </Button>
        )}
        {activeStep === 3 && (
          <Button
            id="demo-close-button"
            fullWidth
            onClick={() => updateUserData()}
            variant="contained"
            sx={{
              mb: 1,
            }}
          >
            I got it
          </Button>
        )}

        {activeStep !== 0 && activeStep < 3 && (
          <Button
            component={StepButton}
            variant="outlined"
            onClick={() => setActiveStep((prev) => prev - 1)}
            sx={{
              mb: 1,
            }}
          >
            Back
          </Button>
        )}
        {activeStep === 0 && (
          <Button variant="outlined" onClick={() => goBack()}>
            Back
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default CreateIdentity;
