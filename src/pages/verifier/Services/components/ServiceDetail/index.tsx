import { Button, Dialog, Grid, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import CircleIcon from "@mui/icons-material/Circle";
import { truncateString } from "src/utils/wallet/walletUtils";
export interface serviceDetailProps {
  openDialog: boolean;
  setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>;
  dialogData?: any;
}
const ServiceDetail = ({
  openDialog,
  setOpenDialog,
  dialogData,
}: serviceDetailProps) => {
  // style
  const titleStyle = (theme: any) => {
    return {
      fontSize: "1rem",
      textAlign: "left",
      py: 1,
    };
  };
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  const getMethod = (id: any) => {
    switch (id) {
      case 0:
        return "Existed";
      case 1:
        return "Matching";
      case 2:
        return "Upper Bound";
      case 3:
        return "Lower Bound";
      case 4:
        return "Membership";
      case 5:
        return "Non-Membership";
      case 6:
        return "Range Check";
      default:
        return "Range Check";
    }
  };
  const getValue = (operator: number, value: any, type: string) => {
    switch (operator) {
      case 0:
        return "";
      case 1:
      case 2:
      case 3:
        return `Value: ${parseValue(value, type)}`;
      case 4:
      case 5:
        return `Value(s): ${parseValue(value, type)
          .toString()
          .replace(",", ", ")}`;
      case 6:
        return `Value(s): ${parseValue(value, type)
          .toString()
          .replace(",", " - ")}`;
      default:
        return `Value(s): ${parseValue(value, type).toString()}`;
    }
  };
  const parseValue = (value: Array<any>, type: string) => {
    if (type === "dateOfBirth") {
      return value.map((item) => {
        const preParse = item.toString();
        return (
          preParse.slice(6, 8) +
          "/" +
          preParse.slice(4, 6) +
          "/" +
          preParse.slice(0, 4)
        );
      });
    } else {
      return value;
    }
  };
  return (
    <Dialog
      PaperProps={{
        style: { borderRadius: "10px", width: "100%" },
      }}
      open={openDialog}
      onClose={handleCloseDialog}
    >
      {dialogData && (
        <Box
          sx={{
            width: "100%",
            p: 3,
            minWidth: "350px",
            maxWidth: "1000px",
          }}
        >
          <Grid container>
            <Grid item xs={6}>
              <Typography color="secondary" variant="body2" sx={titleStyle}>
                Schema
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography color="text.secondary">
                {dialogData.schema?.name || "No name"}
              </Typography>
            </Grid>
          </Grid>
          <Grid container>
            <Grid item xs={6}>
              <Typography color="secondary" variant="body2" sx={titleStyle}>
                Schema Hash
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography color="text.secondary">
                {dialogData.schema?.schemaHash}
              </Typography>
            </Grid>
          </Grid>
          <Grid container>
            <Grid item xs={6}>
              <Typography color="secondary" variant="body2" sx={titleStyle}>
                Allowed issuers
              </Typography>
            </Grid>
            <Grid item xs={6}>
              {dialogData.allowedIssuers?.map((issuer: any, index: number) => {
                return (
                  <Typography key={index} color="text.secondary">
                    <CircleIcon
                      sx={{
                        fontSize: ".5rem",
                        mr: 1,
                      }}
                    />{" "}
                    {truncateString(issuer?.name, 25)}
                  </Typography>
                );
              })}
            </Grid>
          </Grid>
          <Grid container>
            <Grid item xs={6}>
              <Typography color="secondary" variant="body2" sx={titleStyle}>
                Attestation
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography color="text.secondary">
                {dialogData.attestation}
              </Typography>
            </Grid>
          </Grid>
          <Grid container>
            <Grid item xs={6}>
              <Typography color="secondary" variant="body2" sx={titleStyle}>
                Attestation details
              </Typography>
            </Grid>
            <Grid item xs={6}>
              {dialogData.query?.operator !== 0 && (
                <Typography color="text.secondary">
                  <CircleIcon
                    sx={{
                      fontSize: ".5rem",
                      mr: 1,
                    }}
                  />
                  {"Criterion: "}
                  {dialogData.query?.propertyName || "None"}
                </Typography>
              )}
              <Typography color="text.secondary">
                <CircleIcon
                  sx={{
                    fontSize: ".5rem",
                    mr: 1,
                  }}
                />
                {"Method: "}
                {getMethod(dialogData.query?.operator)}
              </Typography>
              {dialogData.query?.operator !== 0 && (
                <Typography color="text.secondary">
                  <CircleIcon
                    sx={{
                      fontSize: ".5rem",
                      mr: 1,
                    }}
                  />
                  {getValue(
                    dialogData.query?.operator,
                    dialogData.query.value,
                    dialogData.query?.propertyName
                  )}
                </Typography>
              )}
            </Grid>
          </Grid>
        </Box>
      )}
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "flex-end",
          px: 3,
          pb: 3,
        }}
      >
        <Button variant="outlined" color="primary" onClick={handleCloseDialog}>
          Close
        </Button>
      </Box>
    </Dialog>
  );
};
export default ServiceDetail;
