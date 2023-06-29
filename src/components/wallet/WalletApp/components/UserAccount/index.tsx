import React, { useState, useEffect } from "react";
import { Box } from "@mui/system";
import { Button, Typography, CircularProgress, Dialog } from "@mui/material";
import { useIdWalletContext } from "src/context/identity-wallet-context";
import ChangePassword from "../ChangePassword";

//icon
import zidenLogo from "src/assets/image/logo/ziden_logo_desktop_2x.png";
import CloseIcon from "@mui/icons-material/Close";
import userIcon from "src/assets/image/wallet/userAvatar2x.png";
import copyIcon from "src/assets/image/icons/copyIcon2x.png";
import { useSnackbar } from "notistack";
import { truncateString } from "src/utils/wallet/walletUtils";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";

import {
  ChangePasswordIcon,
  DeleteIcon,
  LogoutIcon,
  QRCodeIcon,
  RevealMnemonicIcon,
} from "src/constants/icon";
import ConfirmReset from "../ConfirmReset";
import RevealMnemonic from "../RevealMnemonic";
import { userType } from "src/constants";
import QRCodeReader from "../QRCodeReader";
const UserAccount = () => {
  const { getZidenUserID, setOpen, lockWallet, checkUserType } =
    useIdWalletContext();
  const { enqueueSnackbar } = useSnackbar();
  const [zidenDID, setZidenDID] = useState<string>("");
  const [isReset, setIsReset] = useState<Boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  //QR Code
  const [openQR, setOpenQR] = useState<boolean>(false);
  const startQRReader = () => {
    setOpenQR(true);
  };
  const exitQRReader = () => {
    setOpenQR(false);
  };

  //
  useEffect(() => {
    async function fetch() {
      const a: string = await getZidenUserID();
      setZidenDID(a);
    }
    fetch();
  }, [getZidenUserID]);
  const [page, setPage] = useState(0);

  const buttonStyle = (theme: any) => {
    return {
      border: "none",
      color: "#646A71",
      backgroundColor: "transparent",
      fontSize: "1rem",
      fontWeight: 500,
      lineHeight: "21px",
      display: "flex",
      justifyContent: "left",
      alignItems: "center",
      "&:hover": {
        border: "none",
        color: "#646A71",
        backgroundColor: "transparent",
        opacity: 0.9,
      },
      mb: 1,
      pl: 0.5,
      position: "relative",
    };
  };
  return (
    <>
      <Dialog
        open={openQR}
        PaperProps={{
          style: {
            borderRadius: "16px",
            margin: 0,
          },
        }}
      >
        <QRCodeReader exitQRReader={exitQRReader} />
      </Dialog>
      {!isReset && (
        <Box
          sx={{
            width: "100%",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              mt: 0,
              mb: 3,
            }}
          >
            {page === 0 ? (
              <img width={"83px"} height={"25px"} src={zidenLogo} alt="Ziden" />
            ) : (
              <Button
                sx={{
                  minWidth: "0px",
                  backgroundColor: "inherit",
                  display: "flex",
                  justifyContent: "center",
                }}
                onClick={() => setPage(0)}
              >
                <ArrowBackIosIcon
                  sx={{
                    color: "#646A71",
                    width: "25px",
                  }}
                />
              </Button>
            )}

            <Button
              sx={{
                minWidth: "0px",
                mr: -1,
                backgroundColor: "transparent",
              }}
              onClick={() => setOpen(false)}
            >
              <CloseIcon
                sx={{
                  color: "#646A71",
                  fontSize: "1.4rem",
                }}
              />
            </Button>
          </Box>
          <Box
            sx={{
              py: 1,
              borderBottom: "1px solid #FAC3B2",
              display: "flex",
              width: "100%",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography
              noWrap
              sx={{
                color: "#000D1C",
                fontSize: "0.875rem",
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
              }}
            >
              <img
                src={userIcon}
                width="34px"
                height="34px"
                style={{ marginRight: "15px" }}
                alt=""
              />
              {truncateString(zidenDID, 20)}
            </Typography>
            <Button
              sx={{
                minWidth: 0,
                backgroundColor: "transparent",
              }}
              onClick={() => {
                navigator.clipboard.writeText(zidenDID).then(() => {
                  enqueueSnackbar("User ID copied!", {
                    variant: "success",
                  });
                });
              }}
            >
              <img
                src={copyIcon}
                width="25px"
                height="25px"
                style={{}}
                alt=""
              />
            </Button>
          </Box>
          {page === 0 && (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                pt: 4,
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <Button
                sx={buttonStyle}
                fullWidth
                variant="outlined"
                onClick={() => {
                  setPage(1);
                }}
              >
                <ChangePasswordIcon
                  sx={{
                    marginRight: 2,
                  }}
                />
                Change password
              </Button>
              {checkUserType() === userType.web && (
                <Button
                  sx={buttonStyle}
                  fullWidth
                  onClick={() => {
                    setPage(2);
                  }}
                  variant="outlined"
                >
                  <RevealMnemonicIcon
                    sx={{
                      mr: 2,
                    }}
                  />
                  Reveal Recovery Phrase
                </Button>
              )}
              <Button
                sx={buttonStyle}
                fullWidth
                variant="outlined"
                onClick={startQRReader}
              >
                <QRCodeIcon
                  sx={{
                    mr: 2,
                  }}
                />
                Scan QR Code
              </Button>
              <Button
                sx={buttonStyle}
                fullWidth
                onClick={() => {
                  setIsReset(true);
                }}
                variant="outlined"
              >
                <DeleteIcon
                  sx={{
                    mr: 2,
                  }}
                />
                Delete Wallet
              </Button>
              <Button
                sx={buttonStyle}
                fullWidth
                onClick={() => {
                  // logout();
                  lockWallet();
                  setOpen(false);
                  // updateUserData();
                }}
                variant="outlined"
              >
                <LogoutIcon
                  sx={{
                    mr: 2,
                  }}
                />
                Lock wallet
              </Button>
            </Box>
          )}
          {page === 1 && <ChangePassword setPage={setPage} />}
          {/* {page === 2 && <RequirePassword setPage={setPage} />} */}
          {page === 2 && <RevealMnemonic setPage={setPage} />}
        </Box>
      )}
      {isReset && <ConfirmReset setIsReset={setIsReset} />}
    </>
  );
};

export default UserAccount;
