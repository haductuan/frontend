import { Box, Dialog, Typography } from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";
import {
  DELAY,
  DRAW_DETECTION,
  DRAW_LANDMARK,
  DRAW_NOSE,
  HOLD_DELAY,
  NOSE_INDEX,
  NOSE_POINT_SIZE,
} from "src/constants/kyc";
import { checkFaceInFaceArea, checkNoseInNoseArea } from "src/utils/kyc";
import { useSnackbar } from "notistack";
import { useKYCContext } from "src/context/kyc-context";
// import { sleep } from "src/utils/time";
import { zidenKYC } from "src/client/api";
import { useDeviceContext } from "src/context/deviceContext";
// import { sleep } from "src/utils/time";

interface props {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onComplete: () => Promise<void>;
}

const FaceModal = ({ open, setOpen, onComplete }: props) => {
  const livenessCamera = useRef<HTMLVideoElement>(null);
  const canvasElement = useRef<HTMLCanvasElement>(null);
  const captureCanvas = useRef<HTMLCanvasElement>(null);
  const { isDesktop } = useDeviceContext();
  const { VIDEO_HEIGHT, VIDEO_WIDTH, faceBox, noseBox, challengeId, token } =
    useKYCContext();
  const [mediaStream, setMediaStream] = useState<MediaStream>();
  const [isModalLoading, setIsModalLoading] = useState<boolean>(true);
  const [helpText, setHelpText] = useState<string>(
    "Put your face inside the box"
  );
  const [startTime, setStartTime] = useState<number>(Date.now() + 200 * 1000);
  const [step, setStep] = useState<number>(1);
  const [isCameraLoading, setIsCameraLoading] = useState<boolean>(true);
  const [isFaceInFaceArea, setIsFaceInFaceArea] = useState<boolean>(false);
  const [isNoseInNoseArea, setIsNoseInNoseArea] = useState<boolean>(false);
  const [faceAreaBox, setFaceAreaBox] = useState<faceapi.IRect>(
    {} as faceapi.IRect
  );
  const [noseAreaBox, setNoseAreaBox] = useState<faceapi.IRect>(
    {} as faceapi.IRect
  );
  const [isWaiting, setIsWaiting] = useState<boolean>(false);
  const { enqueueSnackbar } = useSnackbar();

  const captureImage = () => {
    if (livenessCamera.current && captureCanvas.current) {
      const video = livenessCamera.current;
      captureCanvas.current.width = video.videoWidth;
      captureCanvas.current.height = video.videoHeight;
      const context2D = captureCanvas.current.getContext("2d");
      context2D?.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
      const image = captureCanvas.current.toDataURL("image/png");
      return image;
    } else return;
  };

  const handlePostFrame = useCallback(async () => {
    if (isWaiting) {
      return;
    }
    setHelpText("Processing");
    const image = captureImage();
    const res = (
      await zidenKYC.put(`/${challengeId}/frames`, {
        timestamp: Date.now(),
        framesBase64: image,
        token: token,
      })
    ).data;
    return res.success;
  }, [challengeId, isWaiting, token]);

  // Get User Camera
  useEffect(() => {
    const fetchMedia = async () => {
      if (open) {
        setStep(1);
        let contrains: MediaStreamConstraints | undefined = {
          audio: false,
          video: {
            width: VIDEO_WIDTH,
            height: VIDEO_HEIGHT,
            facingMode: "user",
          },
        };
        setIsCameraLoading(true);
        setIsWaiting(true);
        try {
          const media = await navigator.mediaDevices.getUserMedia(contrains);
          setMediaStream(media);
          setFaceAreaBox({
            x: Math.floor(faceBox.left),
            y: Math.floor(faceBox.top),
            height: faceBox.height,
            width: faceBox.width,
          });
          setNoseAreaBox({
            x: Math.floor(noseBox.left),
            y: Math.floor(noseBox.top),
            height: noseBox.height,
            width: noseBox.width,
          });
          if (livenessCamera.current) {
            livenessCamera.current.srcObject = media;
            livenessCamera.current.onloadedmetadata = () => {
              livenessCamera.current?.play();
              setIsCameraLoading(false);
            };
          } else {
            enqueueSnackbar("Not have video compoment", {
              variant: "success",
            });
          }
          await zidenKYC.delete(`${challengeId}/deleteFrames`);
          setIsWaiting(false);
          setIsCameraLoading(false);
          setStartTime(Date.now());
        } catch (err: any) {
          enqueueSnackbar(err.message, {
            variant: "error",
          });
        }
      }
    };
    fetchMedia();
  }, [
    open,
    VIDEO_HEIGHT,
    VIDEO_WIDTH,
    faceBox.height,
    faceBox.width,
    noseBox.height,
    noseBox.width,
    enqueueSnackbar,
    faceBox,
    noseBox,
    challengeId,
  ]);
  //load model
  useEffect(() => {
    const loadModel = async () => {
      setIsModalLoading(true);
      await faceapi.nets.tinyFaceDetector.load("/weights");
      await faceapi.nets.faceLandmark68Net.load("/weights");
      setIsModalLoading(false);
      enqueueSnackbar("Models loaded", {
        variant: "success",
        preventDuplicate: true,
      });
    };
    loadModel();
  }, [enqueueSnackbar]);

  const handleStop = useCallback(() => {
    if (livenessCamera.current) {
      livenessCamera.current.pause();
      livenessCamera.current.src = "";
    }
    mediaStream?.getTracks().forEach((track) => {
      track.stop();
    });
    setOpen(false);
  }, [setOpen, mediaStream]);

  const processDetectedFace = useCallback(
    async (
      results: faceapi.WithFaceLandmarks<
        { detection: faceapi.FaceDetection },
        faceapi.FaceLandmarks68
      >[]
    ) => {
      if (canvasElement.current && livenessCamera.current) {
        const dims = faceapi.matchDimensions(canvasElement.current, {
          width: livenessCamera.current.videoWidth,
          height: livenessCamera.current.videoHeight,
        });
        const resizedResults = faceapi.resizeResults(results, dims);
        //DRAW FACE AREA
        const drawBox = new faceapi.draw.DrawBox(faceAreaBox, {
          boxColor: isFaceInFaceArea ? "#96c94a" : "red",
          lineWidth: isDesktop ? 4 : 1,
        });
        await drawBox.draw(canvasElement.current);
        //DRAW NOSE AREA
        if (step === 2) {
          const noseArea = new faceapi.draw.DrawBox(noseAreaBox, {
            boxColor: isNoseInNoseArea ? "#96c94a" : "red",
            lineWidth: isDesktop ? 4 : 1,
          });
          noseArea.draw(canvasElement.current);
        }
        //if detect no face return
        if (resizedResults.length === 0) {
          setStartTime(Date.now());
          setHelpText("put your face in the box");
          setIsFaceInFaceArea(false);
          setIsNoseInNoseArea(false);
          return;
        }
        //check if face in face area box
        const isFaceIn = checkFaceInFaceArea(
          resizedResults[0].detection.box,
          faceAreaBox
        );
        setIsFaceInFaceArea(isFaceIn);
        if (isFaceIn) {
          if (step === 1) {
            setHelpText("Hold still");
            if (Date.now() >= startTime + HOLD_DELAY * 1000) {
              setStartTime(0);
              setIsWaiting(true);
              const res = await handlePostFrame();
              setIsWaiting(false);
              if (res) {
                setStep(2);
              }
              return;
            }
          }
        } else {
          setStartTime(Date.now());
          setHelpText("put your face in the box");
        }
        //check if nose in nose Box
        if (step === 2) {
          setHelpText("Put your nose in correct position");
          const isNoseIn = checkNoseInNoseArea(
            resizedResults[0].landmarks.positions[NOSE_INDEX],
            noseAreaBox
          );
          setIsNoseInNoseArea(isNoseIn);
          if (isNoseIn) {
            setHelpText("Hold still");
            if (startTime === 0) {
              setStartTime(Date.now());
              return;
            }
            if (Date.now() >= startTime + HOLD_DELAY * 1000) {
              setStartTime(0);
              setIsWaiting(true);
              const res = await handlePostFrame();
              setIsWaiting(false);
              if (res) {
                handleStop();
                onComplete();
              }
            }
          } else {
            setStartTime(Date.now());
          }
        }
        if (DRAW_DETECTION) {
          faceapi.draw.drawDetections(canvasElement.current, resizedResults);
        }
        if (DRAW_LANDMARK) {
          faceapi.draw.drawFaceLandmarks(canvasElement.current, resizedResults);
        }
        if (DRAW_NOSE) {
          const nosePoint = resizedResults[0].landmarks.positions[NOSE_INDEX];
          const noseBox = new faceapi.draw.DrawBox(
            {
              x: Math.floor(nosePoint.x - NOSE_POINT_SIZE / 2),
              y: Math.floor(nosePoint.y - NOSE_POINT_SIZE / 2),
              width: NOSE_POINT_SIZE,
              height: NOSE_POINT_SIZE,
            },
            {
              boxColor: "#96c94a",
              lineWidth: isDesktop ? 4 : 1,
            }
          );
          noseBox.draw(canvasElement.current);
        }
      }
    },
    [
      faceAreaBox,
      isFaceInFaceArea,
      noseAreaBox,
      isNoseInNoseArea,
      step,
      startTime,
      handleStop,
      handlePostFrame,
      onComplete,
      isDesktop,
    ]
  );

  const handleDetectFace = useCallback(async () => {
    if (isWaiting) {
      return;
    }
    if (livenessCamera.current) {
      const options = new faceapi.TinyFaceDetectorOptions();
      const res = await faceapi
        .detectAllFaces(livenessCamera.current, options)
        .withFaceLandmarks(false);
      processDetectedFace(res);
    }
  }, [processDetectedFace, isWaiting]);

  useEffect(() => {
    const detectFaceInterval = setInterval(handleDetectFace, DELAY);
    return () => clearInterval(detectFaceInterval);
  }, [handleDetectFace]);

  return (
    <>
      <Dialog
        open={open}
        onClose={() => {
          handleStop();
        }}
        PaperProps={{
          style: {
            borderRadius: "16px",
            margin: "0px",
          },
        }}
      >
        {open && (
          <Box
            sx={{
              width: {
                xs: "350px",
                xsm: "600px",
                lg: "800px",
              },
              height: {
                xs: "600px",
                xsm: "800px",
                lg: "800px",
              },
              borderRadius: 2,
              pt: 5,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {!(isModalLoading || isCameraLoading) && (
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Typography variant="h4" align="center">
                  {helpText}
                </Typography>
              </Box>
            )}
            <Box
              sx={{
                position: "relative",
                visibility: !(isModalLoading || isCameraLoading)
                  ? "visible"
                  : "hidden",
                backgroundColor: "transparent",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <video
                ref={livenessCamera}
                style={{
                  width: "100%",
                  height: "100%",
                  // WebkitTransform: "scaleX(-1)",
                  // transform: "scaleX(-1)",
                }}
                playsInline
                autoPlay
              />
              <canvas
                ref={canvasElement}
                style={{
                  width: "100%",
                  height: "100%",
                  position: "absolute",
                  top: "0px",
                  left: "0px",
                  // WebkitTransform: "scaleX(-1)",
                  // transform: "scaleX(-1)",
                }}
              />
              <canvas
                ref={captureCanvas}
                style={{
                  width: "100%",
                  height: "100%",
                  position: "absolute",
                  top: "0px",
                  left: "0px",
                  WebkitTransform: "scaleX(-1)",
                  transform: "scaleX(-1)",
                  visibility: "hidden",
                }}
              />
            </Box>
          </Box>
        )}
      </Dialog>
    </>
  );
};
export default FaceModal;
