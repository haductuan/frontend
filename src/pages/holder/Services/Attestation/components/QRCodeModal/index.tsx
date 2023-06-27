import { Box, Dialog, Typography } from "@mui/material";
import { QRCodeSVG } from "qrcode.react";
interface props {
  openQRModal: boolean;
  setOpenQR: React.Dispatch<React.SetStateAction<boolean>>;
  data: any;
}
const QRCodeModal = ({ openQRModal, setOpenQR, data }: props) => {
  const stringData = JSON.stringify({
    version: "0",
    action: "verify",
    uri: data || "",
    data: {},
  });
  return (
    <Dialog
      open={openQRModal}
      onClose={() => {
        setOpenQR(false);
      }}
      PaperProps={{
        style: {
          borderRadius: "16px",
        },
      }}
    >
      <Box
        sx={{
          minWidth: {
            xs: "340px",
            md: "400px",
          },
          minHeight: {
            xs: "340px",
            md: "400px",
          },
          p: 3,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            p: 5,
          }}
        >
          <QRCodeSVG
            style={{
              width: "100%",
              height: "100%",
            }}
            value={stringData}
          />
        </Box>
        <Typography align="center">
          Scan this QR code to get your verification result
        </Typography>
      </Box>
    </Dialog>
  );
};
export default QRCodeModal;
