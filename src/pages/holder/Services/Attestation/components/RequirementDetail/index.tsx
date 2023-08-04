import { Grid, Paper, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import { CheckIcon, DotLoadingIcon, NotCheckIcon } from "src/constants/icon";
import { useIdWalletContext } from "src/context/identity-wallet-context";

const RequirementDetail = ({ detailData }: any) => {
  console.log("🚀 ~ file: index.tsx:8 ~ RequirementDetail ~ detailData:", detailData)
  const OPERATOR_TYPE = ["Existed", "Matching", "Upper bound", "Greater than", "Membership", "Non-Membership", "In range"];

  const { isUnlocked } = useIdWalletContext();
  const rowStyle = (theme: any) => {
    return {
      display: "flex",
      flexDirection: "row",
      alignItems: "flex-start",
      py: 1.5,
      minWidth: "0px",
    };
  };
  return (
    <>
      {detailData && (
        <Box>
          <Box
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h3" py={3}>
              Detail
            </Typography>
            {detailData.launch}
          </Box>
          <Grid container sx={rowStyle}>
            <Grid item xs={4} sm={3}>
              <Typography
                variant="body1"
                sx={{
                  fontWeight: 500,
                }}
                color="text.secondary"
              >
                Title
              </Typography>
            </Grid>
            <Grid item xs={8} sm={9}>
              <Typography
                variant="body1"
                color="text.secondary"
                ml={2}
                fontWeight={400}
                noWrap
              >
                {detailData.displayName || ""}
              </Typography>
            </Grid>
          </Grid>
          <Grid container sx={rowStyle}>
            <Grid item xs={4} sm={3}>
              <Typography
                variant="body1"
                sx={{
                  fontWeight: 500,
                }}
                color="text.secondary"
              >
                Attestation
              </Typography>
            </Grid>
            <Grid item xs={8} sm={9}>
              <Typography
                variant="body1"
                color="text.secondary"
                ml={2}
                fontWeight={400}
                sx={{
                  width: "100%",
                }}
              >
                {detailData.require || ""}
              </Typography>
            </Grid>
          </Grid>
          <Grid container sx={rowStyle}>
            <Grid item xs={4} sm={3}>
              <Typography
                variant="body1"
                sx={{
                  fontWeight: 500,
                }}
                color="text.secondary"
              >
                Schema
              </Typography>
            </Grid>
            <Grid item xs={8} sm={9}>
              <Typography
                variant="body1"
                color="text.secondary"
                ml={2}
                fontWeight={400}
                sx={{
                  wordBreak: "break-word",
                }}
              >
                {detailData.schemaName || ""}
              </Typography>
            </Grid>
          </Grid>
          <Grid container sx={rowStyle}>
            <Grid item xs={4} sm={3}>
              <Typography
                variant="body1"
                sx={{
                  fontWeight: 500,
                }}
                color="text.secondary"
              >
                Property
              </Typography>
            </Grid>
            <Grid item xs={8} sm={9}>
              <Typography
                variant="body1"
                color="text.secondary"
                ml={2}
                fontWeight={400}
                sx={{
                  width: "100%",
                }}
              >
                {detailData.name || ""}
              </Typography>
            </Grid>
          </Grid>
          <Grid container sx={rowStyle}>
            <Grid item xs={4} sm={3}>
              <Typography
                variant="body1"
                sx={{
                  fontWeight: 500,
                }}
                color="text.secondary"
              >
                Query
              </Typography>
            </Grid>
            <Grid item xs={8} sm={9}>
              <Typography
                variant="body1"
                color="text.secondary"
                ml={2}
                fontWeight={400}
                sx={{
                  width: "100%",
                }}
              >
                {OPERATOR_TYPE[detailData.operator] || ""}
              </Typography>
            </Grid>
          </Grid>
          <Grid container sx={rowStyle}>
            <Grid item xs={4} sm={3}>
              <Typography
                variant="body1"
                sx={{
                  fontWeight: 500,
                }}
                color="text.secondary"
              >
                Value
              </Typography>
            </Grid>
            <Grid item xs={8} sm={9}>
              <Typography
                variant="body1"
                color="text.secondary"
                ml={2}
                fontWeight={400}
                sx={{
                  width: "100%",
                }}
              >
                {detailData.value.join(', ') || ""}
              </Typography>
            </Grid>
          </Grid>
          <Grid container sx={rowStyle}>
            <Grid item xs={4} sm={3}>
              <Typography
                variant="body1"
                sx={{
                  fontWeight: 500,
                }}
                color="text.secondary"
              >
                Allowed Issuers
              </Typography>
            </Grid>
            <Grid item xs={8} sm={9}>
              {detailData.issuerID.map((id: any, index: any) => {
                return (
                  <Typography
                    key={id.issuerId || index}
                    variant="body1"
                    color="text.secondary"
                    ml={2}
                    fontWeight={400}
                    sx={{
                      width: {
                        lg: "100%",
                        md: "100%",
                        sm: "400px",
                        xsm: "230px",
                        xs: "160px",
                      },
                      // wordWrap: "break-word",
                    }}
                    noWrap
                  >
                    {id.name}
                  </Typography>
                );
              })}
            </Grid>
          </Grid>
          <Grid container sx={rowStyle}>
            <Grid item xs={4} sm={3}>
              <Typography
                variant="body1"
                sx={{
                  fontWeight: 500,
                }}
                noWrap
                color="text.secondary"
              >
                Valid
              </Typography>
            </Grid>
            <Grid item xs={8} sm={9}>
              <Typography variant="body1" color="text.secondary" ml={2}>
                {detailData.filled === "checking" && isUnlocked && (
                  <DotLoadingIcon sx={{ transform: "scale(0.8)" }} />
                )}
                {detailData.filled === "checked" && isUnlocked && <CheckIcon />}
                {(detailData.filled === "notChecked" || !isUnlocked) && (
                  <NotCheckIcon />
                )}
              </Typography>
            </Grid>
          </Grid>
        </Box>
      )}
    </>
  );
};
export default RequirementDetail;
