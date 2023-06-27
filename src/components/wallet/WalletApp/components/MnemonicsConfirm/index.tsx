import React from "react";
import { Typography, Grid, TextField } from "@mui/material";
import { Box } from "@mui/system";

interface mnemonicsConfirmProps {
  mnemonicsData: any;
  setMnemonicsConfirm: any;
  pickedIndex: any;
  helperText?: string;
}

const MnemonicsConfirm = ({
  mnemonicsData,
  setMnemonicsConfirm,
  pickedIndex,
  helperText,
}: mnemonicsConfirmProps) => {
  const handleChangeConfirmData = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: string
  ) => {
    setMnemonicsConfirm((prev: any) => {
      return {
        ...prev,
        [index]: e.target.value,
      };
    });
  };
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-evenly",
        pb: 6,
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
        Confirm Recovery Phrase
      </Typography>
      <Typography
        sx={{
          pt: 1,
          pb: 3,
          fontSize: "0.875rem",
          fontWeight: 500,
          color: "#646A71",
          lineHeight: "1.1875rem",
        }}
      >
        Input four words in your recovery phase in correct order
      </Typography>
      <Grid container spacing={1.5} id="demo-mnemonic-input">
        {pickedIndex.map((itemIndex: string, index: number) => {
          return (
            <Grid key={itemIndex + "-" + index} item xs={6}>
              <TextField
                label={parseInt(itemIndex) + 1}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  handleChangeConfirmData(e, itemIndex);
                }}
              />
            </Grid>
          );
        })}
      </Grid>
      {helperText !== "" && (
        <Typography variant="body2" color="#D60000">
          {helperText}
        </Typography>
      )}
    </Box>
  );
};

export default MnemonicsConfirm;
