import { Box } from "@mui/system";
import { Button } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import zidenIcon from "src/assets/image/logo/Ziden_icon2x.png";
import IdentityWallet from "src/components/wallet";
import { useLocation } from "react-router-dom";

const MobileHeader = ({ toogleDrawer }: { toogleDrawer: any }) => {
  const currentRoute = useLocation();

  return (
    <Box
      sx={{
        position: "absolute",
        top: "0px",
        width: "100%",
        height: "54px",
        zIndex: 10000,
        backgroundColor: "#FFFFFC",
        boxShadow: "0px 3px 6px #0000000D",
      }}
    >
      <Box
        sx={{
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <Button
            sx={{
              minWidth: "50px",
              backgroundColor: "transparent",
            }}
            onClick={() => toogleDrawer()}
          >
            <MenuIcon
              sx={{
                color: "#114898",
              }}
            />
          </Button>
          <img src={zidenIcon} alt={"ziden"} width={"30px"} height={"30px"} />
        </Box>
        {!(currentRoute.pathname === "/get-start") && (
          <IdentityWallet type={2} />
        )}
      </Box>
    </Box>
  );
};
export default MobileHeader;
