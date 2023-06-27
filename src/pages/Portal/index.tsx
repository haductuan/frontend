import * as React from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import AddID from "./Components/AddID";
import NationalIDForm from "./Components/NationalIDForm";
import Liveness from "./Components/Liveness";
import PortalContextProvider, {
  usePortalContext,
} from "src/context/PortalContext";
import Summary from "./Components/Summary";
import KYCProgress from "./Components/KYCProcess";
import Header from "src/components/Header";
import { Paper } from "@mui/material";
import { zidenBackend } from "src/client/api";
//icon
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
const steps = [
  "Add National ID",
  "Require form",
  "Liveness test",
  "Summary",
  "KYC progress",
];

const PortalsContent = () => {
  const { activeStep, setActiveStep } = usePortalContext();
  const [titleData, setTitleData] = useState<any>();
  const isStepOptional = (step: number) => {
    return step === 1;
  };
  const params: any = useParams();
  useEffect(() => {
    const fetch = async () => {
      const res2: any = await zidenBackend.get(
        `/registries/schemas/${params.requestID}/request`
      );
      setTitleData({
        title: res2.data.title,
        provider: res2.data.provider,
        description: res2.data.description,
        logo: res2.data.logoUrl,
      });
    };
    fetch();
  }, []);
  // const handleNext = () => {
  //   setActiveStep((prevActiveStep: number) => prevActiveStep + 1);
  // };

  // const handleBack = () => {
  //   setActiveStep((prevActiveStep: number) => prevActiveStep - 1);
  // };
  // useEffect(() => {
  //   console.log(window.screen.orientation.angle);
  // }, []);
  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      {titleData && (
        <Header
          title1={titleData.title}
          title2={titleData.provider}
          description={[titleData.description]}
        >
          <img
            style={{
              borderRadius: "50%",
            }}
            width="110px"
            height="110px"
            alt=""
            src={titleData.logo}
          />
        </Header>
      )}

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          p: {
            xs: 1,
            xsm: 3,
            lg: 6,
          },
          height: "100%",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",

            width: "100%",
          }}
        >
          <Stepper
            sx={{
              width: "100%",
              "& .MuiSvgIcon-root": {
                fontSize: "2rem",
              },
              "& .MuiStepConnector-line": {
                mt: 0.4,
              },
              "& .MuiSvgIcon-root.Mui-completed": {
                color: "#52B95F",
              },
              "& .MuiStepIcon-text": {
                display: "none",
              },
              "& .Mui-active .MuiSvgIcon-root": {
                border: "2px solid #114898",
                borderRadius: "50%",
                color: "#F8F8F8",
              },
              "& .Mui-disabled .MuiSvgIcon-root": {
                border: "2px solid #7994C1",
                borderRadius: "50%",
                color: "#F8F8F8",
              },

              "& .MuiStepLabel-label": {
                fontSize: "0.875rem",
                fontWeight: 500,
                color: "#566475",
                pb: 1,
              },
              "& .MuiStepLabel-labelContainer": {
                display: "flex",
                justifyContent: "center",
                width: "100%",
              },
              "& .MuiStepLabel-label.Mui-active": {
                fontWeight: 700,
                color: "#114898",
                borderBottom: "3px solid #114898",
                width: "100%",
                maxWidth: "150px",
              },
              "& .MuiStepConnector-root.Mui-completed .MuiStepConnector-line": {
                border: "1px solid #566474",
              },
              "& .MuiStepConnector-root.Mui-active .MuiStepConnector-line": {
                border: "1px solid #566474",
              },
              "& .MuiStepConnector-root.Mui-disabled .MuiStepConnector-line": {
                border: "1px dashed #566474",
              },
            }}
            activeStep={activeStep}
            alternativeLabel
          >
            {steps.map((label, index) => {
              const stepProps: { completed?: boolean } = {};
              const labelProps: {
                optional?: React.ReactNode;
              } = {};

              return (
                <Step key={label} {...stepProps}>
                  <StepLabel id={"PortalStep" + activeStep} {...labelProps}>
                    {label}
                  </StepLabel>
                </Step>
              );
            })}
          </Stepper>
        </Box>
        <Paper
          sx={{
            boxShadow: "0px 3px 5px 2px rgba(0, 0, 0, 0.1)",
            borderRadius: 4,
            height: "100%",
            width: "100%",
            p: {
              xs: 2,
              xsm: 2,
              md: 4,
            },
            maxWidth: "1600px",
            maxHeight: "900px",
            minHeight: "520px",
          }}
        >
          {activeStep === 0 && <AddID />}
          {activeStep === 1 && <NationalIDForm />}
          {activeStep === 2 && <Liveness />}
          {activeStep === 3 && <Summary />}
          {activeStep === 5 && <KYCProgress />}
        </Paper>
      </Box>
    </Box>
  );
};
export default function KYCPortals() {
  return (
    <PortalContextProvider>
      <PortalsContent />
    </PortalContextProvider>
  );
}
