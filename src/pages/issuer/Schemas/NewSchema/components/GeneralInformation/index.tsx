import React, { useState } from "react";
import { Box } from "@mui/material";
import {
  TextField,
  Grid,
  MenuItem,
  RadioGroup,
  Radio,
  FormControlLabel,
  Typography,
} from "@mui/material";
import { useIssuerContext } from "src/context/issuerContext";
import Button from "@mui/material/Button";
import { useHistory } from "react-router-dom";
import { useIdWalletContext } from "src/context/identity-wallet-context";
import { useSnackbar } from "notistack";

export interface registryType {
  schemaHash?: string;
  isserId?: string;
  description?: string;
  expiration?: string;
  updatable?: boolean;
  network?: string;
  endpointUrl?: string;
}
const GeneralInformation = ({
  setActiveStep,
  setNewSchemaData,
}: {
  setActiveStep: any;
  setNewSchemaData: any;
}) => {
  const { networks, endpointUrl, issuerID } = useIssuerContext();
  const { isUnlocked } = useIdWalletContext();
  const { enqueueSnackbar } = useSnackbar();
  const [expirationTime, setExpirationTime] = useState<number>();
  const [registryData, setRegistryData] = useState<registryType>({
    updatable: true,
    endpointUrl: endpointUrl,
    description: "",
  });
  const verifyData = () => {
    if (!registryData["network"]) {
      enqueueSnackbar("Network is empty!", {
        autoHideDuration: 2000,
        variant: "warning",
      });
      return false;
    }
    if (!registryData["endpointUrl"]) {
      enqueueSnackbar("Endpoint URL is empty!", {
        autoHideDuration: 2000,
        variant: "warning",
      });
      return false;
    }
    if (!registryData["expiration"]) {
      enqueueSnackbar("Expiration time is empty!", {
        autoHideDuration: 2000,
        variant: "warning",
      });
      return false;
    }
    return true;
  };
  const handleNext = async () => {
    if (!isUnlocked) {
      return;
    }
    if (!verifyData()) {
      return;
    }
    setNewSchemaData((prev: any) => {
      return {
        ...prev,
        registry: { ...registryData, issuerId: issuerID },
      };
    });
    setActiveStep((prev: number) => {
      return prev + 1;
    });
  };
  const history = useHistory();
  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "400px",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <Grid container spacing={2}>
        <Grid item xs={12} xsm={12} md={12} lg={6}>
          <TextField
            label="Network"
            fullWidth
            select
            value={registryData["network"] || ""}
            onChange={(e) => {
              setRegistryData((prev: registryType) => {
                return {
                  ...prev,
                  network: e.target.value,
                };
              });
            }}
          >
            {networks &&
              networks.map((network: any, index: number) => {
                return (
                  <MenuItem key={index} value={network.networkId}>
                    {" "}
                    {network.name}
                  </MenuItem>
                );
              })}
          </TextField>
        </Grid>
        <Grid item xs={12} xsm={12} md={12} lg={6}>
          <TextField
            label="Endpoint URL"
            fullWidth
            value={endpointUrl}
          ></TextField>
        </Grid>
        <Grid item xs={12} xsm={12} md={12} lg={6}>
          <TextField
            label="Description"
            fullWidth
            value={registryData["description"] || ""}
            onChange={(e) => {
              setRegistryData((prev: registryType) => {
                return {
                  ...prev,
                  description: e.target.value,
                };
              });
            }}
          />
        </Grid>

        <Grid item xs={12} xsm={12} md={12} lg={6}>
          <TextField
            label="Expiration Time (hours)"
            fullWidth
            value={expirationTime || ""}
            type="number"
            onChange={(e) => {
              const exp = e.target.value;
              setExpirationTime(parseInt(exp));
              setRegistryData((prev: registryType) => {
                return {
                  ...prev,
                  expiration: (parseInt(exp) * 3600000).toString(),
                };
              });
            }}
          ></TextField>
        </Grid>
        <Grid
          item
          xs={12}
          xsm={12}
          md={12}
          lg={6}
          sx={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <Typography mx={3}>Updatable</Typography>
          <RadioGroup
            row
            name="Updatable"
            onChange={(e: any) => {
              setRegistryData((prev: registryType) => {
                return {
                  ...prev,
                  updatable: e.target.value === "true" ? true : false,
                };
              });
            }}
            defaultValue={true}
          >
            <FormControlLabel value={true} control={<Radio />} label="Yes" />
            <FormControlLabel value={false} control={<Radio />} label="No" />
          </RadioGroup>
        </Grid>
      </Grid>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          mt: 3,
        }}
      >
        <Button
          variant="outlined"
          color="primary"
          onClick={() => {
            history.push("/issuer/schemas");
          }}
        >
          Cancel
        </Button>
        <Button onClick={handleNext} variant="contained" color="primary">
          Next
        </Button>
      </Box>
    </Box>
  );
};
export default GeneralInformation;
