import {
  Autocomplete,
  Button,
  FormControl,
  Grid,
  MenuItem,
  TextField,
} from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import { usePortalContext } from "src/context/PortalContext";
import { useSnackbar } from "notistack";
import { userDataType } from "src/context/context";
import { Country, Industry, Occupation } from "src/constants";
import { getMostSimilar } from "src/utils/wallet/walletUtils";

const NationalIDForm = () => {
  const { setActiveStep, userData, setUserData } = usePortalContext();
  const { enqueueSnackbar } = useSnackbar();
  const [formData, setFormData] = useState<userDataType>({
    ...userData,
  });

  const requiredData = [
    // { key: "title", value: "Title" },
    { key: "name", value: "Full name" },
    { key: "countryOfResidence", value: "Country of resident" },
    { key: "nationality", value: "Nationality" },
    { key: "idNumber", value: "Citizen/Passport ID" },
    { key: "gender", value: "Gender" },
    { key: "dateOfBirth", value: "Date of birth" },
    { key: "industry", value: "Industry" },
    { key: "occupation", value: "Occupation" },
    { key: "addresses", value: "Addresses" },
  ];
  useEffect(() => {
    enqueueSnackbar("Please check your information!", {
      variant: "info",
      preventDuplicate: true,
    });
  }, [enqueueSnackbar]);
  useEffect(() => {
    if (userData) {
      setFormData(userData);
    }
  }, [userData]);
  const handleNext = () => {
    for (var i = 0; i < requiredData.length; i++) {
      const indexKey = requiredData[i].key as keyof typeof formData;
      const dataToCheck = formData[indexKey];

      if (dataToCheck === "" || !dataToCheck) {
        enqueueSnackbar(`${requiredData[i].value} is empty!`, {
          variant: "warning",
          autoHideDuration: 2000,
          preventDuplicate: true,
        });
        return;
      }
    }
    setUserData(formData);
    localStorage.removeItem("zoom.lk");
    setActiveStep((prev: number) => prev + 1);
  };
  const handleBack = () => {
    setActiveStep((prev: number) => prev - 1);
  };
  const handleChange = (value: any, key: string) => {
    setFormData((prev: any) => {
      return {
        ...prev,
        [key]: value,
      };
    });
  };
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        height: "100%",
      }}
    >
      <FormControl>
        <Grid container spacing={2}>
          <Grid item xs={12} md={12} lg={2}>
            <TextField
              label="Title"
              fullWidth
              value={formData?.title || ""}
              onChange={(e) => handleChange(e.target.value, "title")}
              select
            >
              <MenuItem value={"DR"}>DR</MenuItem>
              <MenuItem value={"MR"}>MR</MenuItem>
              <MenuItem value={"MS"}>MS</MenuItem>
              <MenuItem value={"MRS"}>MRS</MenuItem>
              <MenuItem value={"MDM"}>MDM</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} md={12} lg={4}>
            <TextField
              label="Full name"
              fullWidth
              required
              value={formData?.name || " "}
              onChange={(e) => handleChange(e.target.value, "name")}
            />
          </Grid>
          <Grid item xs={12} md={12} lg={6}>
            <TextField
              label="Addresses"
              required
              fullWidth
              value={formData?.addresses || " "}
              onChange={(e) => handleChange([e.target.value], "addresses")}
            />
          </Grid>
          <Grid item xs={12} md={12} lg={6}>
            <Autocomplete
              id="Country of residence"
              options={Country}
              autoHighlight
              getOptionLabel={(option) => option}
              onChange={(e, newValue) => {
                handleChange(newValue, "countryOfResidence");
              }}
              value={getMostSimilar(
                formData?.countryOfResidence || "",
                Country
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Country of residence"
                  fullWidth
                  required
                />
              )}
            />
          </Grid>
          <Grid item xs={12} md={12} lg={6}>
            <Autocomplete
              id="Nationality"
              options={Country}
              autoHighlight
              getOptionLabel={(option) => option}
              value={getMostSimilar(formData?.nationality || "", Country)}
              onChange={(e, newValue) => handleChange(newValue, "nationality")}
              renderInput={(params) => (
                <TextField {...params} label="Nationality" fullWidth required />
              )}
            />
          </Grid>
          <Grid item xs={12} md={12} lg={6}>
            <TextField
              label="Citizen/Passport ID"
              required
              fullWidth
              value={formData?.idNumber || ""}
              onChange={(e) => handleChange(e.target.value, "idNumber")}
            />
          </Grid>
          <Grid item xs={12} md={12} lg={6}>
            <Autocomplete
              id="Industry"
              options={Industry}
              autoHighlight
              getOptionLabel={(option) => option}
              onChange={(e, newValue) => handleChange(newValue, "industry")}
              value={getMostSimilar(formData.industry || "", Industry)}
              renderInput={(params) => (
                <TextField {...params} label="Industry" fullWidth required />
              )}
            />
          </Grid>
          <Grid item xs={12} md={12} lg={2}>
            <TextField
              label="Gender"
              fullWidth
              required
              onChange={(e) => handleChange(e.target.value, "gender")}
              value={formData?.gender || " "}
              select
            >
              <MenuItem value={"MALE"}>MALE</MenuItem>
              <MenuItem value={"FEMALE"}>FEMALE</MenuItem>
              <MenuItem value={"OTHER"}>OTHER</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} md={12} lg={4}>
            <TextField
              label="Date of birth"
              required
              fullWidth
              value={formData?.dateOfBirth || ""}
              type="date"
              onChange={(e) => handleChange(e.target.value, "dateOfBirth")}
            />
          </Grid>
          <Grid item xs={12} md={12} lg={6}>
            <Autocomplete
              id="Occupation"
              options={Occupation}
              autoHighlight
              getOptionLabel={(option) => option}
              onChange={(e, newValue) => handleChange(newValue, "occupation")}
              value={getMostSimilar(formData.occupation || "", Occupation)}
              renderInput={(params) => (
                <TextField {...params} label="Occupation" fullWidth required />
              )}
            />
          </Grid>
          <Grid item xs={12} md={12} lg={6}></Grid>
        </Grid>
      </FormControl>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Button
          sx={{
            minWidth: "100px",
          }}
          variant="outlined"
          onClick={handleBack}
        >
          Back
        </Button>
        <Button
          sx={{
            minWidth: "100px",
          }}
          variant="contained"
          onClick={handleNext}
        >
          Next
        </Button>
      </Box>
    </Box>
  );
};

export default NationalIDForm;
