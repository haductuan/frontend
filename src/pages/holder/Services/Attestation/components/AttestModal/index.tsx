import { Button, Dialog, Typography } from "@mui/material";
import { Box, style } from "@mui/system";
import React from "react";
import {
  CheckIcon,
  DotLoadingIcon,
  NotCheckIcon,
  PendingIcon,
} from "src/constants/icon";
import { AttestStatus } from "../..";

const AttestModal = ({
  open,
  setOpen,
  geningProofStatus,
  verifyStatus,
}: any) => {
  const rowStyle = (theme: any) => {
    return {
      display: "flex",
      fexDirection: "row",
      alignItems: "flex-start",
    };
  };
  return (
    <Dialog
      open={open}
      PaperProps={{
        style: {
          borderRadius: "12px",
        },
      }}
    >
      <Box
        sx={{
          p: 4,
          minWidth: { xs: "250px", md: "400px" },
          minHeight: { xs: "260px" },
        }}
      >
        <Typography variant="h3" pb="1rem">
          Attestation proof
        </Typography>
        <Box sx={rowStyle}>
          <Box
            sx={{
              mt: 0.6,
            }}
          >
            {geningProofStatus === AttestStatus.Executing && <DotLoadingIcon />}
            {geningProofStatus === AttestStatus.Success && <CheckIcon />}
            {geningProofStatus === AttestStatus.Fail && <NotCheckIcon />}
          </Box>
          <Typography variant="body1" color="secondary" ml={2} py=".1rem">
            Generating proof
          </Typography>
        </Box>
        <Box
          sx={{
            height: "25px",
            borderLeft: "1px dashed #707070",
            ml: 1.44,
          }}
        />
        <Box sx={rowStyle}>
          <Box sx={{ mt: 0.6 }}>
            {verifyStatus === AttestStatus.Pending && <PendingIcon />}
            {verifyStatus === AttestStatus.Executing && <DotLoadingIcon />}
            {verifyStatus === AttestStatus.Success && <CheckIcon />}
            {verifyStatus === AttestStatus.Fail && <NotCheckIcon />}
          </Box>
          <Typography variant="body1" color="secondary" ml={2} py=".1rem">
            Sending to the attestation service
          </Typography>
        </Box>
        <Box
          sx={{
            width: "100%",
            mt: 3,
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <Button
            onClick={() => {
              setOpen(false);
            }}
            variant="contained"
            color="primary"
          >
            Confirm
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
};

export default AttestModal;
