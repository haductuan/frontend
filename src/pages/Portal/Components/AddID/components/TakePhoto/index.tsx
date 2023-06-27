import { Button, CircularProgress, Grid, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { useRef, useState, useEffect } from "react";
import { usePortalContext } from "src/context/PortalContext";
import Webcam from "react-webcam";
import axios from "axios";
import { useSnackbar } from "notistack";
import { urltoFile } from "src/utils/image/imageUtil";
import { Country } from "src/constants";
import { getMostSimilar } from "src/utils/wallet/walletUtils";
import { useDeviceContext } from "src/context/deviceContext";

const TakePhoto = ({ setAddIDMethod }: { setAddIDMethod: any }) => {
  const {
    setActiveStep,
    frontImageFile,
    setFrontImageFile,
    backImageFile,
    setBackImageFile,
    setUserData,
    userToken,
    getUserToken,
  } = usePortalContext();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const { isMobile, isIpad } = useDeviceContext();
  const [isCaptureFront, setIsCaptureFront] = useState(true);
  const [frontImagePreview, setFrontImagePreview] = useState<any>();
  const [backImagePreview, setBackImagePreview] = useState<any>();
  const [loading, setLoading] = useState(false);
  const [facingMode, setFacingMode] = useState<any>({
    facingMode: "user",
  });
  const toggleFacingMode = () => {
    setFacingMode((prev: any) => {
      if (prev.facingMode === "user") {
        return {
          facingMode: { exact: "environment" },
        };
      } else {
        return {
          facingMode: "user",
        };
      }
    });
  };
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

  useEffect(() => {
    if (!backImageFile) {
      setBackImageFile(undefined);
      return;
    }

    const objectUrl = URL.createObjectURL(backImageFile);
    setBackImagePreview(objectUrl);

    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl);
  }, [backImageFile, setBackImageFile]);
  const capture = useRef<any>(null);
  const captureImage = React.useCallback(() => {
    const imageSrc = capture.current.getScreenshot();

    if (isCaptureFront) {
      urltoFile(imageSrc, "front.jpeg", "image/jpeg").then((res) => {
        setFrontImageFile(res);
        setIsCaptureFront((prev: boolean) => !prev);
      });
    } else {
      urltoFile(imageSrc, "back.jpeg", "image/jpeg").then((res) => {
        setBackImageFile(res);
        setIsCaptureFront((prev: boolean) => !prev);
      });
    }
  }, [capture, isCaptureFront, setFrontImageFile, setBackImageFile]);
  const handleBack = () => {
    setAddIDMethod(0);
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
    var bodyFormData = new FormData();
    bodyFormData.append("file0", frontImageFile);
    bodyFormData.append("file1", backImageFile);
    //get token

    //get data
    const res = await axios.post(
      "https://d1.cynopsis.co/service/v2/ocr",
      bodyFormData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: "Bearer " + userToken,
        },
      }
    );

    //check data
    if (res.data?.status_task === "SUCCESS") {
      setUserData({
        name: res.data?.result.full_name.replaceAll("\n", ", ") || "",
        countryOfResidence: res.data?.result.countryOfResidence || "",
        idNumber: res.data?.result.document_number || "",
        gender: res.data?.result.gender,
        dateOfBirth: res.data?.result.date_of_birth || " ",
        idType: res.data?.result.document_type || "",
        nationality: getMostSimilar(
          res.data?.result.nationality || "",
          Country
        ),
        //nationality: "VIETNAM",
        addresses: [res.data?.result.address.replaceAll("\n", ", ") || ""],
        industry: "",
        occupation: "",
      });
      setLoading(false);
      setActiveStep((prev: number) => prev + 1);
    } else {
      enqueueSnackbar("Please check your image!", {
        variant: "warning",
        preventDuplicate: true,
      });
      setLoading(false);
    }
    //setActiveStep((prev: number) => prev + 1);
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
              {/* <CameraAltOutlinedIcon
                  sx={{
                    fontSize: "6rem",
                    color: "#8FA7C9",
                    fontWeight: 400,
                  }}
                /> */}
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
              <Button
                sx={{
                  backgroundColor: "#F7A088",
                  color: "#FFFFFC",
                  borderRadius: 1,
                  "&:hover": {
                    backgroundColor: "#de8a73",
                  },
                  position: "absolute",
                  bottom: "-50px",
                }}
                onClick={captureImage}
              >
                {isCaptureFront ? "Capture Front side" : "Capture Back side"}
              </Button>
              {/* <Button
                   
                  sx={{
                    backgroundColor: "transparent",
                    minWidth: "0px",
                    color: "black",
                    position: "absolute",
                    top: "10px",
                    right: "10px",
                  }}
                  onClick={toggleFacingMode}
                >
                  <CameraswitchIcon />
                </Button> */}
            </Box>
          </Grid>
          <Grid
            item
            xs={12}
            md={12}
            lg={6}
            sx={{
              display: "flex",
              flexDirection: {
                md: "row",
                lg: "column",
              },
              justifyContent: {
                xs: "center",
                lg: "space-between",
              },
              alignItem: {
                lg: "left",
              },
              mt: {
                lg: 0,
                xs: 6,
              },
            }}
          >
            <Box
              sx={{
                width: "100%",
                height: "100%",
                maxWidth: "500px",
                display: "flex",
                flexDirection: {
                  xs: "column",
                  xsm: "row",
                  lg: "column",
                },
                justifyContent: "space-between",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: {
                    xs: "column",
                    lg: "row",
                  },
                  alignItems: {
                    xs: " center",
                    lg: "flex-end",
                  },
                }}
              >
                <Box
                  sx={{
                    width: {
                      xs: "210px",
                      xsm: "180px",
                      md: "180px",
                      lg: "152px",
                      xl: "190px",
                    },
                    minWidth: "152px",
                    aspectRatio: "3/2",
                    background: "#FFF7F5 0% 0% no-repeat padding-box",
                    border: "1px solid #F7A088",
                    borderRadius: "10px",
                    opacity: 1,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
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
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: {
                    xs: "column",
                    lg: "row",
                  },
                  alignItems: {
                    xs: " center",
                    lg: "flex-end",
                  },
                }}
              >
                <Box
                  sx={{
                    width: {
                      xs: "210px",
                      xsm: "180px",
                      md: "180px",
                      lg: "152px",
                      xl: "190px",
                    },
                    minWidth: "152px",
                    aspectRatio: "3/2",
                    background: "#FFF7F5 0% 0% no-repeat padding-box",
                    border: "1px solid #F7A088",
                    borderRadius: "10px",
                    opacity: 1,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {backImageFile && (
                    <img
                      width="100%"
                      height="100%"
                      src={backImagePreview}
                      alt=""
                      style={{ borderRadius: "10px" }}
                    />
                  )}
                  {!backImageFile && (
                    <Typography variant="body2" color="text.secondary">
                      Back side
                    </Typography>
                  )}
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>
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
