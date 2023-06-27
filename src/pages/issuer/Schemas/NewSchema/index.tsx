import React, { useState, useEffect } from "react";
import { Box, Paper, Step, StepLabel, Stepper } from "@mui/material";
import Header from "src/components/Header";
import GeneralInformation from "./components/GeneralInformation";
import SchemaDetailV2 from "./components/SchemaDetails/SchemaDetailV2";
import { useHistory } from "react-router-dom";
import { useIdWalletContext } from "src/context/identity-wallet-context";
import { useSnackbar } from "notistack";
import { validateJWZ } from "src/utils/auth";
import { useIssuerContext } from "src/context/issuerContext";
import LoadingComponent from "src/components/LoadingComponent";

const NewSchema = () => {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [newSchemaData, setNewSchemaData] = useState<any>({});
  const [isSignedIn, setIsSignedIn] = useState(false); // check for jwz and wallet unlock status
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
      enqueueSnackbar("Please unlock your wallet and sign in!", {
        autoHideDuration: 2000,
        preventDuplicate: true,
        variant: "info",
      });
      history.push("/issuer/profile/signin");
    } else {
      setIsSignedIn(true);
      if (endpointUrl) {
        const validate = async () => {
          const validateResult = await validateJWZ(endpointUrl, "issuer");
          if (!validateResult) {
            enqueueSnackbar("Sign in expired, please sign in again!", {
              autoHideDuration: 2000,
              preventDuplicate: true,
              variant: "info",
            });
            history.push("/issuer/profile/signin");
          }
        };
        validate();
      }
    }
  }, [isUnlocked, enqueueSnackbar, history, endpointUrl]);
  return (
    <>
      {!isSignedIn && <LoadingComponent type={2} />}
      {isSignedIn && (
        <Box>
          <Header
            title1="New Schema"
            description={[
              "A schema describes the standard for every information included in your claims. Each schema is identified by a unique hash and can be registered on multiple networks.",
              "You can register an existing schema or create your own (coming soon).",
            ]}
          />
          <Box
            sx={{
              py: 2,
              px: {
                xs: 2,
                xsm: 3,
                md: 4,
                lg: 6,
              },
            }}
          >
            <Stepper
              alternativeLabel
              sx={{
                maxWidth: "500px",
                mx: "auto",
                "& .Mui-active .MuiSvgIcon-root": {
                  color: "#C0D5F4",
                },
                "& .Mui-disabled .MuiSvgIcon-root": {
                  color: "#F0F0F0",
                },
                "& .MuiStepIcon-text": {
                  fill: "#114898",
                },
                "& .MuiSvgIcon-root": {
                  fontSize: "2rem",
                },
                "& .MuiStepConnector-line": {
                  mt: 0.4,
                },
                "& .MuiStepLabel-label.Mui-disabled": {
                  fontWeight: 400,
                  color: "#646A71",
                },
                "& .MuiStepLabel-label.Mui-active": {
                  fontWeight: 600,
                  color: "#646A71",
                },
                "& .MuiStepLabel-label.Mui-completed": {
                  fontWeight: 600,
                  color: "#646A71",
                },
                "& .MuiStepConnector-root.Mui-disabled .MuiStepConnector-line":
                  {
                    borderBottom: "1px dashed #566474",
                    borderTop: "none",
                  },
                "& .MuiStepConnector-root.Mui-active .MuiStepConnector-line": {
                  borderBottom: "1px solid #566474",
                  borderTop: "none",
                },
                mb: 3,
              }}
              activeStep={activeStep}
            >
              <Step key={0}>
                <StepLabel>General information</StepLabel>
              </Step>
              <Step key={1}>
                <StepLabel>Schema details</StepLabel>
              </Step>
            </Stepper>

            <Paper
              sx={{
                p: 4,
                borderRadius: 4,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <Box
                sx={{
                  display: activeStep === 0 ? "initial" : "none",
                }}
              >
                <GeneralInformation
                  setActiveStep={setActiveStep}
                  setNewSchemaData={setNewSchemaData}
                />
              </Box>
              <Box
                sx={{
                  display: activeStep === 1 ? "initial" : "none",
                }}
              >
                <SchemaDetailV2
                  setActiveStep={setActiveStep}
                  setNewSchemaData={setNewSchemaData}
                  newSchemaData={newSchemaData}
                />
              </Box>
            </Paper>
          </Box>
        </Box>
      )}
    </>
  );
};
export default NewSchema;
