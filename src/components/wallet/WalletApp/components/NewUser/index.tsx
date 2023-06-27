import { Button, Typography } from "@mui/material";
import { Box } from "@mui/system";
import CreateIdentity from "../CreateIdentity";
import { useIdWalletContext } from "src/context/identity-wallet-context";
import RestoreIdentity from "../RestoreIdentity";
import zidenLogoOnly from "src/assets/image/logo/zidenLogoOnly.png";
import CloseIcon from "@mui/icons-material/Close";

const NewUser = () => {
  const { createIdMethod, setCreateIdMethod, goBack, setOpen } =
    useIdWalletContext();
  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {createIdMethod === 0 && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-evenly",
            width: "100%",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "right",
              width: "100%",
            }}
          >
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
          <img width="150px" height="150px" src={zidenLogoOnly} alt={"Ziden"} />
          <Typography
            sx={{
              color: "#114898",
              fontSize: "1.25rem",
              fontWeight: 700,
              lineHeight: "1.6875rem",
              py: 2,
            }}
          >
            New to Ziden?
          </Typography>
          <Button
            id="demo-create-account"
            variant="contained"
            sx={{
              width: "200px",
              mb: 2,
              maxWidth: "160px",
              font: "normal normal 600 14px/19px",
              borderRadius: 2,
            }}
            onClick={() => setCreateIdMethod(1)}
          >
            Create Account
          </Button>
          <Button
            sx={{
              width: "250px",
              mb: 3,
              borderRadius: 2,
              maxWidth: "160px",
            }}
            variant="outlined"
            onClick={() => setCreateIdMethod(2)}
          >
            Restore Account
          </Button>
        </Box>
      )}
      {createIdMethod === 1 && <CreateIdentity goBack={goBack} />}
      {createIdMethod === 2 && <RestoreIdentity />}
    </Box>
  );
};

export default NewUser;
