import { Button, CircularProgress } from "@mui/material";
import { Box } from "@mui/system";
import { Html5Qrcode } from "html5-qrcode";
import { useSnackbar } from "notistack";
import { useState, useRef, useEffect, useCallback, ChangeEvent } from "react";
import { useHistory } from "react-router-dom";
import { handleReadedQRcode } from "./utils";
import { useIdWalletContext } from "src/context/identity-wallet-context";

const QRCodeReader = ({ exitQRReader }: { exitQRReader: () => void }) => {
  const {
    setOpen,
    keyContainer,
    userId,
    checkUserType,
    checkForDek,
    qrCodeData,
    setQrCodeData,
  } = useIdWalletContext();
  const { enqueueSnackbar } = useSnackbar();
  const history = useHistory();
  const [scanner, setScanner] = useState<Html5Qrcode>();
  const [isScanning, setIsScanning] = useState<boolean>();
  useEffect(() => {
    const html5QR = new Html5Qrcode("ziden-QRCode-reader");
    setScanner(html5QR);
    Html5Qrcode.getCameras().then((devices) => {
      setCameras(devices?.map((item) => item.id) || []);
    });
  }, []);
  const inputRef = useRef<HTMLInputElement>(null);
  const [cameraIndex, setCameraIndex] = useState<number>(0);
  const [cameras, setCameras] = useState<Array<string>>([]);
  const handleStop = async () => {
    if (!scanner) {
      return;
    }
    if (scanner?.isScanning) {
      scanner?.stop();
    }
    exitQRReader();
  };
  const toggleCamera = async () => {
    if (cameras.length > 1) {
      if (scanner?.isScanning) {
        await scanner?.stop();
      }
      setCameraIndex((prev) => 1 - prev);
      setIsScanning(false);
    }
  };
  const handleChangeFile = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files?.length === 0) {
      console.log("No file uploaded");
      return;
    } else {
      try {
        await scanner?.stop();
        await scanner
          ?.scanFile(e.target.files[0], true)
          .then((decoded: string) => {
            handleDecoded(decoded);
            exitQRReader();
          });
      } catch (err) {
        enqueueSnackbar("Wrong QR Code image format, please try again", {
          variant: "success",
        });
        setIsScanning(false);
      }
    }
  };
  const handleDecoded = useCallback(
    (decoded: any) => {
      try {
        handleReadedQRcode(
          history,
          decoded,
          keyContainer,
          userId,
          checkUserType,
          checkForDek,
          qrCodeData,
          setQrCodeData
        );
        enqueueSnackbar(`Success`, {
          variant: "success",
          autoHideDuration: 2000,
        });
      } catch (err) {
        enqueueSnackbar(`${err}`, {
          variant: "info",
          autoHideDuration: 2000,
        });
      }
      setOpen(false);
    },
    [
      enqueueSnackbar,
      history,
      setOpen,
      keyContainer,
      userId,
      checkUserType,
      checkForDek,
      qrCodeData,
      setQrCodeData,
    ]
  );
  const handleUploadImage = () => {
    if (inputRef.current?.click()) {
    }
  };
  useEffect(() => {
    if (cameras.length > 0 && scanner && !isScanning) {
      setIsScanning(true);
      scanner?.start(
        { deviceId: cameras[cameraIndex] },
        {
          fps: 2,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1,
        },
        (decodedText: any, decodedResult: any) => {
          handleDecoded(decodedText);
          scanner?.stop();
          exitQRReader();
        },
        () => {}
      );
    }
    return () => {
      if (scanner?.isScanning) {
        scanner?.stop();
      }
    };
  }, [scanner, isScanning, cameras, handleDecoded, cameraIndex, exitQRReader]);
  return (
    <Box>
      <Box
        sx={{
          width: {
            xs: "100%",
            xsm: "450px",
            md: "550px",
          },
          height: {
            xs: "100%",
            xsm: "450px",
            md: "550px",
          },
          minWidth: "376px",
          minHeight: "376px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          id="ziden-QRCode-reader"
          style={{
            width: "100%",
            height: "100%",
            overflow: "hidden",
            borderRadius: "15px",
            objectFit: "fill",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CircularProgress />
        </div>
      </Box>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleChangeFile}
        style={{
          display: "none",
        }}
      />
      <Box
        sx={{
          p: 2,
        }}
      >
        <Button
          variant="contained"
          fullWidth
          sx={{
            mb: 2,
          }}
          onClick={handleUploadImage}
        >
          Upload from file
        </Button>
        {cameras.length > 1 && (
          <Button
            variant="contained"
            fullWidth
            sx={{
              mb: 2,
            }}
            onClick={toggleCamera}
          >
            ChangeCamera
          </Button>
        )}
        <Button
          fullWidth
          variant="contained"
          color="primary"
          onClick={handleStop}
        >
          Cancel
        </Button>
      </Box>
    </Box>
  );
};
export default QRCodeReader;
