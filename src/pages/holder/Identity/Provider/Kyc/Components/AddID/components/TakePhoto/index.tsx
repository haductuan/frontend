import { Button, CircularProgress, Grid, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import { useSnackbar } from "notistack";
import { toBase64, urltoFile } from "src/utils/image/imageUtil";
import { useDeviceContext } from "src/context/deviceContext";
import { useKYCContext } from "src/context/kyc-context";
import { zidenKYC } from "src/client/api";

const TakePhoto = ({ setAddIDMethod }: { setAddIDMethod: any }) => {
  const { setActiveStep, frontImageFile, setFrontImageFile, startChallenge } =
    useKYCContext();
  const { enqueueSnackbar } = useSnackbar();
  const { isMobile, isIpad } = useDeviceContext();
  const [frontImagePreview, setFrontImagePreview] = useState<any>();

  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (!frontImageFile) {
      setFrontImageFile(undefined);
      return;
    }
    const objectUrl = URL.createObjectURL(frontImageFile);
    setFrontImagePreview(objectUrl);
    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl);
  }, [frontImageFile, setFrontImageFile]);
  const capture = useRef<any>(null);
  const captureImage = React.useCallback(() => {
    const imageSrc = capture.current.getScreenshot();
    urltoFile(imageSrc, "front.jpeg", "image/jpeg").then((res) => {
      setFrontImageFile(res);
    });
  }, [capture, setFrontImageFile]);
  const handleBack = () => {
    setAddIDMethod(0);
  };
  const handleNext = () => {
    setActiveStep((prev: number) => prev + 1);
  };
  const handleConfirm = async () => {
    setLoading(true);
    if (!frontImageFile) {
      enqueueSnackbar("Front image is required!", {
        variant: "warning",
        preventDuplicate: true,
      });
      setLoading(false);
      return;
    }
    const imageBase64 = await toBase64(frontImageFile);
    const result = (
      await zidenKYC.post(`id`, {
        imageBase64: imageBase64,
      })
    ).data;
    if (result.message === "success") {
      await startChallenge(result.userId);
      setLoading(false);
      handleNext();
    } else {
      enqueueSnackbar("Please check your image!", {
        variant: "info",
        preventDuplicate: true,
      });
      setLoading(false);
    }
  };
  return (
    <React.Fragment>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography
          variant="h3"
          sx={{
            pb: {
              xs: 2,
              xsm: 3,
              lg: 4,
            },
          }}
        >
          {" "}
          Preview your camera
        </Typography>

        <Grid
          spacing={2}
          container
          sx={{
            width: "100%",
            pb: {
              xs: 2,
              xsm: 6,
              lg: 8,
            },
          }}
        >
          <Grid
            item
            xs={12}
            md={12}
            lg={6}
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: {
                xs: "center",
                xsm: "center",
                md: "center",
                lg: "right",
              },
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                background: "#EDF3FA 0% 0% no-repeat padding-box",
                border: "1px solid #8FA7C9",
                borderRadius: "10px",
                opacity: 1,
                width: "500px",
                minHeight: "209px",
                aspectRatio: "3/2",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                position: "relative",
              }}
            >
              <Webcam
                ref={capture}
                audio={false}
                height={"100%"}
                screenshotFormat="image/jpeg"
                width={"100%"}
                videoConstraints={
                  isIpad || isMobile
                    ? {
                        facingMode: { exact: "environment" },
                      }
                    : {
                        facingMode: "user",
                      }
                }
              />
            </Box>
          </Grid>
          <Grid
            item
            xs={12}
            md={12}
            lg={6}
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: {
                xs: "center",
                xsm: "center",
                md: "center",
                lg: "left",
              },
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                aspectRatio: "3/2",
                background: "#FFF7F5 0% 0% no-repeat padding-box",
                border: "1px solid #F7A088",
                borderRadius: "10px",
                opacity: 1,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "500px",
                minHeight: "209px",
              }}
            >
              {frontImageFile && (
                <img
                  width="100%"
                  height="100%"
                  src={frontImagePreview}
                  alt=""
                  style={{ borderRadius: "10px" }}
                />
              )}
              {!frontImageFile && (
                <Typography variant="body2" color="text.secondary">
                  Front side*
                </Typography>
              )}
            </Box>
          </Grid>
        </Grid>
        <Button
          sx={{
            backgroundColor: "#F7A088",
            color: "#FFFFFC",
            borderRadius: 1,
            "&:hover": {
              backgroundColor: "#de8a73",
            },
          }}
          onClick={captureImage}
        >
          Capture
        </Button>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Button
          sx={{
            minWidth: "100px",
          }}
          variant="outlined"
          onClick={handleBack}
        >
          Back
        </Button>

        <Button
          sx={{
            minWidth: "100px",
          }}
          variant="contained"
          onClick={handleConfirm}
          disabled={loading}
        >
          {loading ? <CircularProgress size={25} /> : "Confirm"}
        </Button>
      </Box>
    </React.Fragment>
  );
};
export default TakePhoto;
