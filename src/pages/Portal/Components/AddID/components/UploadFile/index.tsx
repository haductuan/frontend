import { Button, CircularProgress, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { useRef, useState, useEffect } from "react";
import { usePortalContext } from "src/context/PortalContext";
import axios from "axios";
import { useSnackbar } from "notistack";
import { Country } from "src/constants";
import { getMostSimilar } from "src/utils/wallet/walletUtils";

const UploadFile = ({ setAddIDMethod }: { setAddIDMethod: any }) => {
  const {
    setActiveStep,
    setUserData,
    frontImageFile,
    setFrontImageFile,
    backImageFile,
    setBackImageFile,
    userToken,
  } = usePortalContext();
  const { enqueueSnackbar } = useSnackbar();
  const frontImage = useRef<HTMLInputElement>(null);
  const backImage = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [frontImagePreview, setFrontImagePreview] = useState<any>();
  const [backImagePreview, setBackImagePreview] = useState<any>();

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

  const handleBack = () => {
    setAddIDMethod(0);
  };
  const handleNext = () => {
    setAddIDMethod(0);
  };
  const handleChangeFrontImage = (e: any) => {
    setFrontImageFile(e.target.files[0]);
  };
  const handleChangeBackImage = (e: any) => {
    setBackImageFile(e.target.files[0]);
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
      <Box>
        <Typography
          variant="h5"
          textAlign={"center"}
          color="#000D1C"
          width="100%"
          pb={6}
        >
          Upload files
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
          }}
        >
          <input
            accept=".png,.jpeg,.jpg"
            ref={frontImage}
            id="front-side-input"
            type="file"
            style={{
              display: "none",
            }}
            onChange={handleChangeFrontImage}
          />
          <input
            accept=".png,.jpeg,.jpg"
            ref={backImage}
            id="back-side-input"
            type="file"
            style={{
              display: "none",
            }}
            onChange={handleChangeBackImage}
          />
          <Box
            sx={{
              width: {
                xs: "100%",
                xsm: "50%",
                lg: "40%",
                xl: "31%",
              },
              minWidth: "150px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              mr: 1,
              aspectRatio: "3/2",
              pt: 3,
            }}
          >
            <Button
              sx={{
                width: "100%",
                height: "100%",
                background: "#FFF7F5 0% 0% no-repeat padding-box",
                border: "1px solid #F7A088",
                borderRadius: "10px",
                opacity: 1,
                mb: 1,
                color: "#F7A088",
              }}
              onClick={() => {
                if (frontImage?.current) {
                  frontImage.current.click();
                }
              }}
            >
              {frontImageFile ? (
                <img
                  src={frontImagePreview}
                  alt=""
                  width={"100%"}
                  height={"100%"}
                />
              ) : (
                "Front side*"
              )}
            </Button>

            <Typography variant="body1" color="text.secondary">
              Front size*
            </Typography>
          </Box>
          <Box
            sx={{
              width: {
                xs: "100%",
                xsm: "50%",
                lg: "40%",
                xl: "31%",
              },
              minWidth: "150px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              ml: { xs: 0, xsm: 1 },
              aspectRatio: "3/2",
              pt: 3,
            }}
          >
            <Button
              sx={{
                width: "100%",
                height: "100%",
                background: "#FFF7F5 0% 0% no-repeat padding-box",
                border: "1px solid #F7A088",
                borderRadius: "10px",
                opacity: 1,
                mb: { xs: 0, xsm: 1 },
                color: "#F7A088",
              }}
              onClick={() => {
                if (backImage?.current) {
                  backImage.current.click();
                }
              }}
            >
              {backImageFile ? (
                <img
                  src={backImagePreview}
                  alt=""
                  width={"100%"}
                  height={"100%"}
                />
              ) : (
                " Back side"
              )}
            </Button>
            <Typography variant="body1" color="text.secondary">
              Back size
            </Typography>
          </Box>
        </Box>
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

export default UploadFile;
