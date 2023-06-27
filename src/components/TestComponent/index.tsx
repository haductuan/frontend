import { Box, Button } from "@mui/material";
import Header from "../Header";
import Tour from "reactour";
import { useState, useRef } from "react";
import { TUTORIAL } from "src/configs/appConfig";

const TestComponent = () => {
  const [startIntro, setStartIntro] = useState<boolean>(false);
  const [showStep2, setShowStep2] = useState<boolean>(false);

  return (
    <Box
      sx={{
        width: "100%",
      }}
    >
      <Header title1={"Test"} by={"Ziden dev"} description={["Des1", "Des2"]} />
      <Box
        sx={{
          p: {
            xs: 2,
            xsm: 2,
            md: 3,
            lg: 6,
          },
        }}
      >
        <Button
          id="test-step-1"
          variant="contained"
          onClick={() => {
            console.log("click1");
            setShowStep2(true);
          }}
        >
          Focus here (step 1)
        </Button>
        {showStep2 && (
          <Button
            id="test-step-2"
            variant="contained"
            onClick={() => {
              console.log("click2");
            }}
          >
            Focus here (step 2)
          </Button>
        )}

        <Button
          variant="contained"
          onClick={() => {
            setStartIntro((prev) => !prev);
          }}
        >
          start{" "}
        </Button>
      </Box>
    </Box>
  );
};
export default TestComponent;
