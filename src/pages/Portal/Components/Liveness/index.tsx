import { Button, CircularProgress, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useState } from "react";
import { usePortalContext } from "src/context/PortalContext";

import liveSuccessIcon from "src/assets/image/icons/livenessSuccess2x.png";
import liveFailIcon from "src/assets/image/icons/livenessFailed2x.png";
import { Subject } from "rxjs";
import axios from "axios";
import {
  LiveTestActions,
  LiveTestComponent,
  LiveTestResult,
  ThemeCustomization,
  LiveTestStates,
} from "react-liveness";
import { LocalConvenienceStoreOutlined } from "@mui/icons-material";
import { urltoFile } from "src/utils/image/imageUtil";
import { useDeviceContext } from "src/context/deviceContext";

interface IState {
  actionController: Subject<LiveTestActions>;
  configs: any;
  serviceBaseUrl: string;
  status: string;
  customization?: ThemeCustomization;
  providerToken?: string;
  selfie: any;
  disableStart: boolean;
  sessionId: string;
  data: string;
  displayLiveness: boolean;
}

const Liveness = () => {
  const {
    setActiveStep,
    frontImageFile,
    userToken,
    getUserToken,
    setSelfieFile,
    userData,
  } = usePortalContext();

  const { isDesktop } = useDeviceContext();
  const isPortrait = window.matchMedia("(orientation: portrait)").matches;
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [isDone, setIsDone] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const handleNext = () => {
    setActiveStep((prevActiveStep: number) => prevActiveStep + 1);
  };
  const [livenessState, setLivenessState] = useState<IState>({
    actionController: new Subject<LiveTestActions>(),
    configs: {
      clientId: "61l1gjse4oj6mlqt37tpa6u4ct",
      clientSecret: "6obind8ku0380n1iahdjmeuj74qhmeukj2jf2i7rvhkngv7eoag",
      domain: "cynopsis",
      region: "ap-southeast-1",
    },
    customization: {
      primaryColor: "teal",
      backgroundColor: "white",
      borderColor: "grey",
      topOffset: 0.5,
      cameraImgPath: "Path to img",
      activityIndicatorImgPath: "Path to img",
      cancelImgPath: "Path to img",
    },
    serviceBaseUrl: "https://d1.cynopsis.co/service",
    status: "Initializing...",
    selfie: null,
    disableStart: true,
    sessionId: "",
    data: "",
    displayLiveness: true,
  });
  const handleBack = () => {
    setActiveStep((prevActiveStep: number) => prevActiveStep - 1);
  };
  const handleFaceConpare = async (image: any) => {
    setIsDone(false);
    setIsSuccess(false);
    setLoading(true);

    try {
      urltoFile(
        "data:text/plain;base64," + image,
        "selfie.jpeg",
        "image/jpeg"
      ).then(async (res) => {
        // console.log("face:", res);
        try {
          if (userToken) {
            var bodyFormData = new FormData();
            bodyFormData.append("file0", res);
            bodyFormData.append("file1", frontImageFile);
            const result = await axios.post(
              "https://d1.cynopsis.co/service/facecompare",
              bodyFormData,
              {
                headers: {
                  "Content-Type": "multipart/form-data",
                  Authorization: "Bearer " + userToken,
                },
              }
            );
            if (result?.data?.status === "MATCHED") {
              setSelfieFile("data:image/jpeg;base64," + image);
              setIsSuccess(true);
              setLoading(false);
              setIsDone(true);
            } else {
              setSelfieFile();
              setIsSuccess(false);
              setLoading(false);
              setIsDone(true);
            }
          } else {
            console.log("Getting userToken, please try one more time");
          }
        } catch (err) {
          setIsSuccess(false);
          setLoading(false);
          setIsDone(true);
        }
      });
    } catch (err) {
      setIsSuccess(false);
      setLoading(false);
      setIsDone(true);
    }
  };
  const onLivenessResult = (result: LiveTestResult) => {
    let status = result.status;
    let data = "";
    switch (status) {
      case LiveTestStates.PASSED:
        handleFaceConpare(result.selfieImageBase64);
        console.log("passed");
        break;
      case LiveTestStates.FAILED:
        console.log("failed");
        data = "Faceid - " + result.faceId;
        break;
      case LiveTestStates.ERROR:
        console.log("error");
        data = "Error Message - " + result.message;
        break;
    }
    setLivenessState((prev: any) => {
      return {
        ...prev,
        status: status,
        sessionId: "SessionId - " + result.sessionId,
        data: data,
        selfie: result.selfieImageBase64,
      };
    });
  };
  const onLivenessReady = () => {
    // allow start
    setLivenessState((prev: any) => {
      return { ...prev, disableStart: false, status: "READY" };
    });
  };
  const toggleLiveness = () => {
    setLivenessState((prev: any) => {
      return {
        ...prev,
        displayLiveness: !livenessState.displayLiveness,
      };
    });
  };
  const onStart = async () => {
    await livenessState.actionController.next(LiveTestActions.START);
    console.log(livenessState);
  };
  return (
    <>
      {userToken && (
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

          {(isDesktop || isPortrait) && (
            <Box
              sx={{
                // background: "#EDF3FA 0% 0% no-repeat padding-box",
                border: "0px solid #8FA7C9",
                borderRadius: "50%",
                opacity: 1,
                height: "300px",
                width: "240px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                my: 2,
              }}
            >
              {isDone && (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    alignItems: "center",
                    height: "100%",
                  }}
                >
                  <Typography
                    textAlign={"center"}
                    variant="h5"
                    color={isSuccess ? "#28C73C" : "#E32D26"}
                  >
                    {isSuccess ? "Liveness Passed" : "Liveness failed"}
                  </Typography>

                  <img
                    width="180px"
                    height="180px"
                    src={isSuccess ? liveSuccessIcon : liveFailIcon}
                    alt=""
                  />
                </Box>
              )}
              {loading && <CircularProgress />}
              {!(isDone || loading) && (
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
                  disabled={livenessState.disableStart}
                  onClick={onStart}
                >
                  <Typography variant="h6" color="#FFFFFF">
                    {livenessState.disableStart ? (
                      <CircularProgress size={25} />
                    ) : (
                      "Start Liveness Test"
                    )}
                  </Typography>
                </Button>
              )}
            </Box>
          )}
          {!(isDesktop || isPortrait) && (
            <Box>
              <Typography>
                Please switch your device to Portrait mode for liveness test
              </Typography>
            </Box>
          )}
          <LiveTestComponent
            actionController={livenessState.actionController}
            configs={livenessState.configs}
            customization={livenessState.customization}
            serviceBaseUrl={livenessState.serviceBaseUrl}
            onLivenessResult={onLivenessResult}
            onLivenessReady={onLivenessReady}
          />
          {isDone && (
            <Button //mobile
              sx={{
                background: "#F7A088 0% 0% no-repeat padding-box",
                borderRadius: "5px",
                width: "120px",
                minHeight: "36px",
                "&:hover": {
                  backgroundColor: "#de8a73",
                },
                mb: 4,
                display: {
                  xs: "block",
                  xsm: "none",
                },
              }}
              disabled={livenessState.disableStart}
              onClick={onStart}
            >
              <Typography variant="h6" color="#FFFFFF">
                {livenessState.disableStart ? (
                  <CircularProgress size={25} />
                ) : (
                  "Start Liveness Test"
                )}
              </Typography>
            </Button>
          )}

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <Button // desktop
              sx={{
                width: "120px",
              }}
              variant="outlined"
              onClick={handleBack}
            >
              Back
            </Button>
            {isDone && (
              <Button
                sx={{
                  background: "#F7A088 0% 0% no-repeat padding-box",
                  borderRadius: "5px",
                  width: "150px",
                  minHeight: "36px",
                  "&:hover": {
                    backgroundColor: "#de8a73",
                  },
                  display: {
                    xs: "none",
                    xsm: "block",
                  },
                }}
                disabled={livenessState.disableStart}
                onClick={onStart}
              >
                <Typography variant="h6" color="#FFFFFF">
                  {livenessState.disableStart ? (
                    <CircularProgress size={25} />
                  ) : (
                    "Start Liveness Test"
                  )}
                </Typography>
              </Button>
            )}

            <Button
              sx={{
                width: "120px",
              }}
              disabled={!(isDone && isSuccess)}
              variant="contained"
              onClick={handleNext}
            >
              Confirm
            </Button>
          </Box>
        </Box>
      )}
      {!userToken && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
            justifyContent: "center",
            height: "100%",
          }}
        >
          <CircularProgress />
        </Box>
      )}
    </>
  );
};

export default Liveness;
