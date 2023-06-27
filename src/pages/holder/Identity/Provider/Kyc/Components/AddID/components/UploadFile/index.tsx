import { Button, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { useRef, useState, useEffect } from "react";
import { useSnackbar } from "notistack";
import { Country } from "src/constants";
import { getMostSimilar } from "src/utils/wallet/walletUtils";
import { useKYCContext } from "src/context/kyc-context";
import { zidenKYC } from "src/client/api";
import { toBase64 } from "src/utils/image/imageUtil";
import { LoadingButton } from "@mui/lab";

const UploadFile = ({ setAddIDMethod }: { setAddIDMethod: any }) => {
  const { setActiveStep, startChallenge, frontImageFile, setFrontImageFile } =
    useKYCContext();
  const { enqueueSnackbar } = useSnackbar();
  const frontImage = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(false);
  const [frontImagePreview, setFrontImagePreview] = useState<any>();

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

  const handleBack = () => {
    setAddIDMethod(0);
  };
  const handleNext = () => {
    setActiveStep((prev: number) => prev + 1);
  };
  const handleChangeFrontImage = (e: any) => {
    setFrontImageFile(e.target.files[0]);
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
          <Box
            sx={{
              width: {
                xs: "100%",
                sm: "60%",
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
        <LoadingButton
          loading={loading}
          sx={{
            minWidth: "100px",
          }}
          variant="contained"
          onClick={handleConfirm}
          disabled={loading}
        >
          Confirm
        </LoadingButton>
      </Box>
    </React.Fragment>
  );
};

export default UploadFile;
