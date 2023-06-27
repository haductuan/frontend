import { Button, CircularProgress, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useCallback, useState } from "react";

import liveSuccessIcon from "src/assets/image/icons/livenessSuccess2x.png";
import liveFailIcon from "src/assets/image/icons/livenessFailed2x.png";

import { useKYCContext } from "src/context/kyc-context";
import FaceModal from "./components/FaceModal";
// import { useIdWalletContext } from "src/context/identity-wallet-context";
import { zidenKYC } from "src/client/api";

const Liveness = () => {
  const { setActiveStep, challengeId, token } = useKYCContext();
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [isDone, setIsDone] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [startLiveness, setStartLiveness] = useState<boolean>(false);
  const handleNext = () => {
    setActiveStep((prevActiveStep: number) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep: number) => prevActiveStep - 1);
  };
  const handleFaceConpare = useCallback(async () => {
    setLoading(true);
    const verifyResult = (
      await zidenKYC.post(`/${challengeId}/verify`, {
        token: token,
      })
    ).data;
    if (verifyResult.message === "success") {
      setIsSuccess(true);
      setLoading(false);
      setIsDone(true);
    } else {
      console.log("err: ", verifyResult.message);
      setIsSuccess(false);
      setLoading(false);
      setIsDone(true);
    }
  }, [challengeId, token]);

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
          justifyContent: "space-between",
          height: "100%",
        }}
      >
        <Typography variant="h5" color="text.secondary">
          Get ready for your video selfie
        </Typography>
        <FaceModal
          open={startLiveness}
          setOpen={setStartLiveness}
          onComplete={handleFaceConpare}
        />
        {!loading && (
          <Box
            sx={{
              border: "0px solid #8FA7C9",
              borderRadius: "50%",
              opacity: 1,
              height: "300px",
              width: "240px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              alignItems: "center",
              my: 2,
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              {isDone && (
                <>
                  <Typography
                    textAlign={"center"}
                    variant="h5"
                    color={isSuccess ? "#28C73C" : "#E32D26"}
                    pb={2}
                  >
                    {isSuccess ? "Liveness Passed" : "Liveness failed"}
                  </Typography>
                  <img
                    width="180px"
                    height="180px"
                    src={isSuccess ? liveSuccessIcon : liveFailIcon}
                    alt=""
                  />
                </>
              )}
            </Box>
            <Button
              sx={{
                background: "#F7A088 0% 0% no-repeat padding-box",
                borderRadius: "10px",
                width: "150px",
                minHeight: "40px",
                "&:hover": {
                  backgroundColor: "#de8a73",
                },
              }}
              // disabled={!isUnlocked}
              onClick={() => {
                setStartLiveness(true);
              }}
            >
              Start Liveness Test
            </Button>
          </Box>
        )}
        {loading && <CircularProgress />}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <Button
            sx={{
              width: "120px",
            }}
            variant="outlined"
            onClick={handleBack}
          >
            Back
          </Button>
          <Button
            sx={{
              width: "120px",
            }}
            variant="contained"
            onClick={handleNext}
            disabled={!isSuccess}
          >
            Confirm
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default Liveness;
