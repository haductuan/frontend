import React from "react";
import { Typography, Box, Grid, Button } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { useSnackbar } from "notistack";
interface mnemonicsProps {
  mnemonicsData: any;
}
const Mnemonics = (props: mnemonicsProps) => {
  const { enqueueSnackbar } = useSnackbar();
  const mnemonicsArray =
    props.mnemonicsData !== undefined
      ? Object.values(props.mnemonicsData)
      : [""];

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        justifyContent: "space-evenly",
        pb: 2,
      }}
    >
      <Typography
        sx={{
          fontSize: "1.25rem",
          fontWeight: 700,
          color: "#114898",
          lineHeight: "1.6875rem",
        }}
      >
        Secret Recovery Phrase
      </Typography>
      <Typography
        sx={{
          pt: 1,
          pb: 1,
          fontSize: "0.875rem",
          fontWeight: 500,
          color: "#646A71",
          lineHeight: "1.1875rem",
        }}
      >
        Your Secret Recovery Phrase is a 12-word phrase that is the “master key”
        to your identity wallet, please save.
      </Typography>
      <Typography
        sx={{
          pt: 1,
          pb: 3,
          fontSize: "0.875rem",
          fontWeight: 500,
          color: "#D60000",
          lineHeight: "1.1875rem",
        }}
      >
        WARNING: Never disclose your Secret Recovery Phrase, keep it somewhere
        safe as you might need to resore your data on other devices.
      </Typography>
      <Grid container spacing={1.5} id="demo-mnemonic-display">
        {mnemonicsArray.map((word, index) => {
          return (
            <Grid key={index + "-" + word} item xs={6}>
              <Box
                sx={{
                  p: 1.5,
                  borderRadius: 1,
                  background: "#F2F2F2 0% 0% no-repeat padding-box",
                  textAlign: "center",
                  position: "relative",
                  color: "#000D1C",
                  fontSize: "1rem",
                  fontWeight: 600,
                }}
              >
                <Typography
                  sx={{
                    position: "absolute",
                    top: "5px",
                    left: "5px",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    color: "#7E7E7E",
                    opacity: 0.8,
                  }}
                >
                  {`#${index + 1}`}
                </Typography>
                {`${word}`}
              </Box>
            </Grid>
          );
        })}
      </Grid>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          mt: 1.5,
          color: "#FF4500",
        }}
      >
        <Typography>Copy</Typography>
        <Button
          disableFocusRipple
          sx={{
            minWidth: "0px",
            backgroundColor: "transparent",
          }}
          onClick={() => {
            navigator.clipboard.writeText(mnemonicsArray.join(" ")).then(() => {
              enqueueSnackbar("Mnemnics copied!", {
                variant: "success",
              });
            });
          }}
        >
          <ContentCopyIcon
            sx={{
              color: "#FF4500",
              fontSize: "1.2rem",
            }}
          />
        </Button>
      </Box>
    </Box>
  );
};
export default Mnemonics;
