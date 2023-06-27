import { Box } from "@mui/system";
import React from "react";
import { useState, useEffect } from "react";
import { Button, PopperPlacementType, Typography } from "@mui/material";
import WalletApp from "./WalletApp";
import { useIdWalletContext } from "../../context/identity-wallet-context";
import walletIcon from "src/assets/image/icons/walletMobileIcon2x.png";
//dialog
import Dialog from "@mui/material/Dialog";
import { truncateString } from "src/utils/wallet/walletUtils";

const IdentityWallet = ({ type }: { type: number }) => {
  const { open, setOpen, getZidenUserID, updateUserData } =
    useIdWalletContext();
  const [placement, setPlacement] = React.useState<PopperPlacementType>();
  const [zidenDID, setZidenDID] = useState<string>("");

  useEffect(() => {
    async function fetch() {
      await updateUserData();
      const a: string = await getZidenUserID();
      setZidenDID(a);
    }
    fetch();
  }, [getZidenUserID, open, updateUserData]);
  const handleClick =
    (newPlacement: PopperPlacementType) =>
    (event: React.MouseEvent<HTMLElement>) => {
      setOpen((prev: any) => placement !== newPlacement || !prev);
      setPlacement(newPlacement);
    };
  const handleClose = () => {
    setOpen(false);
  };
  return (
    <Box>
      <Dialog
        sx={{
          "& .MuiPaper-root.MuiDialog-paper": {
            m: 0,
            borderRadius: 3,
          },
          "& .MuiDialog-paper": {
            position: {
              xs: "relative",
              xsm: "absolute",
            },
            top: "0px",
            right: "0px",
          },
        }}
        onClose={handleClose}
        open={open}
      >
        {/* Wallet container */}
        <WalletApp />
      </Dialog>
      {/* wallet button */}
      {type !== 2 && (
        <Button
          id="ziden-wallet"
          onClick={handleClick(type === 0 ? "bottom-end" : "bottom-start")}
          variant="contained"
          sx={{
            minWidth: "0px",
            minHeight: "36px",
          }}
        >
          {zidenDID === "" ? (
            <Typography
              noWrap
              sx={{
                width: "150px",
                color: "#FFFFFC",
                fontSize: ".875rem",
              }}
            >
              Identity Wallet
            </Typography>
          ) : (
            <Typography
              noWrap
              sx={{
                width: "150px",
                color: "#FFFFFC",
                fontSize: ".875rem",
                display: "flex",
                alignItems: "center",
              }}
            >
              <img
                style={{ marginRight: "10px" }}
                src={walletIcon}
                alt=""
                width="24px"
                height="24px"
              />{" "}
              {truncateString(zidenDID, 17)}
            </Typography>
          )}
        </Button>
      )}
      {/* wallet icon on mobile */}
      {type === 2 && (
        <Button
          id="ziden-wallet"
          onClick={handleClick("bottom-end")}
          variant="contained"
          sx={{
            minWidth: "10px",
            minHeight: "10px",
            width: "30px",
            height: "32px",
            mr: 2,
          }}
        >
          <img src={walletIcon} alt="" width="24px" height="24px" />
        </Button>
      )}
    </Box>
  );
};
export default IdentityWallet;
