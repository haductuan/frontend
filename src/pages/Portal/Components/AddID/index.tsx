import { Button, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { useRef, useState, useEffect } from "react";

import TakePhoto from "./components/TakePhoto";
import UploadFile from "./components/UploadFile";
const AddID = () => {
  // const { activeStep, setActiveStep } = usePortalContext();
  const [addIDMethod, setAddIDMethod] = useState(0);

  // const handleNext = () => {
  //   setActiveStep((prev: number) => prev + 1);
  // };
  // const handleBack = () => {
  //   setActiveStep((prev: number) => prev - 1);
  // };
  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      {addIDMethod === 0 && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            height: "100%",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <Typography textAlign={"center"} p={3} width="100%">
              Add your National ID
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexDirection: {
                  xs: "column",
                  xsm: "row",
                },
                justifyContent: "center",
                alignItems: "center",
                my: 3,
              }}
            >
              <Button
                sx={{
                  width: "246px",
                  height: "68px",
                  mr: { xs: 0, xsm: 1 },
                  my: 1,
                  backgroundColor: "#F7A088",
                  color: "#FFFFFC",
                  borderRadius: 2.5,
                  "&:hover": {
                    backgroundColor: "#de8a73",
                  },
                }}
                onClick={() => setAddIDMethod(1)}
              >
                <Typography variant="h3">Upload File</Typography>
              </Button>
              <Button
                sx={{
                  width: "246px",
                  height: "68px",
                  ml: { xs: 0, xsm: 1 },
                  my: 1,
                  backgroundColor: "#F7A088",
                  color: "#FFFFFC",
                  borderRadius: 2.5,
                  "&:hover": {
                    backgroundColor: "#de8a73",
                  },
                }}
                onClick={() => setAddIDMethod(2)}
              >
                <Typography variant="h3">Take a photo</Typography>
              </Button>
            </Box>
          </Box>
          {/* <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Button
              sx={{
                minWidth: "100px",
                visibility: "hidden",
              }}
              disabled
              // variant="outlined"
              // onClick={handleBack}
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
              Confirm
            </Button>
          </Box> */}
        </Box>
      )}
      {addIDMethod === 1 && <UploadFile setAddIDMethod={setAddIDMethod} />}
      {addIDMethod === 2 && <TakePhoto setAddIDMethod={setAddIDMethod} />}
    </Box>
  );
};
export default AddID;
