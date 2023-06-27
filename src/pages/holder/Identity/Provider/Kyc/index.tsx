import * as React from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import AddID from "./Components/AddID";
import NationalIDForm from "./Components/NationalIDForm";
import Liveness from "./Components/Liveness";
import Summary from "./Components/Summary";
import KYCProgress from "./Components/KYCProcess";
import Header from "src/components/Header";
import { Avatar, Paper } from "@mui/material";
import { zidenPortal } from "src/client/api";
//icon
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import KYCContextProvider, { useKYCContext } from "src/context/kyc-context";
const steps = [
  "Add National ID",
  "Require form",
  "Liveness test",
  "Summary",
  "KYC progress",
];

const KYCContext = () => {
  const { activeStep, metaData, setMetadata } = useKYCContext();
  const params: any = useParams();
  useEffect(() => {
    const fetch = async () => {
      const res2: any = (
        await zidenPortal.get(`/registries/${params.requestID}`)
      ).data?.registry;
      setMetadata({
        title: res2?.schema.name,
        issuerName: res2?.issuer.name,
        description: res2?.description,
        logoUrl: res2?.issuer.logoUrl,
        issuerId: res2?.issuer.issuerId,
        schemaHash: res2?.schema?.schemaHash,
      });
    };
    fetch();
  }, [params.requestID, setMetadata]);

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <Header
        title1={metaData?.title}
        title2={metaData?.issuerName}
        description={[metaData?.description]}
      >
        <Avatar
          style={{
            borderRadius: "50%",
            width: "110px",
            height: "110px",
          }}
          alt=""
          src={metaData?.logoUrl}
        />
      </Header>

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
    <KYCContextProvider>
      <KYCContext />
    </KYCContextProvider>
  );
}
