// import TabContext from "@mui/lab/TabContext";
// import TabList from "@mui/lab/TabList";
import Tab from "@mui/material/Tab";
import { Button, Tabs } from "@mui/material";
import { Box } from "@mui/system";
import React, { useState, useEffect } from "react";
import Header from "src/components/Header";
import Issuance from "./components/Issuance";
import Revocation from "./components/Revocation";
import History from "./components/History";
import { NavLink, useHistory } from "react-router-dom";
import { useIdWalletContext } from "src/context/identity-wallet-context";
import { useSnackbar } from "notistack";
import { useIssuerContext } from "src/context/issuerContext";
import { validateJWZ } from "src/utils/auth";
import LoadingComponent from "src/components/LoadingComponent";

const IssuerClaims = () => {
  const [tab, setTab] = useState<number>(0);
  const [refresh, setRefresh] = useState(0);
  const [isSignedIn, setIsSignedIn] = useState(false); // check for jwz and wallet unlock status
  const history = useHistory();
  const { enqueueSnackbar } = useSnackbar();
  const { isUnlocked } = useIdWalletContext();
  const { endpointUrl } = useIssuerContext();
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };

  useEffect(() => {
    if (
      !isUnlocked ||
      !localStorage.getItem("ziden-db/issuer-jwz") ||
      !localStorage.getItem("ziden-db/issuer-id")
    ) {
      enqueueSnackbar("Please unlock your wallet and sign in!", {
        preventDuplicate: true,
        variant: "info",
      });
      history.push("/issuer/profile/signin");
    } else {
      setIsSignedIn(true);
      if (endpointUrl) {
        const validate = async () => {
          const validateResult = await validateJWZ(endpointUrl, "issuer");
          if (!validateResult) {
            enqueueSnackbar("Sign in expired, please sign in again!", {
              preventDuplicate: true,
              variant: "info",
            });
            history.push("/issuer/profile/signin");
          }
        };
        validate();
      }
    }
  }, [isUnlocked, enqueueSnackbar, history, endpointUrl]);
  return (
    <>
      {!isSignedIn && <LoadingComponent type={2} />}
      {isSignedIn && (
        <Box>
          <Header
            title1="Claims Management"
            description={[
              "Issue new claim about other identity and public on your prefered blockchain network.",
              "Issued claims can be revoked once and the action can not be reversed.",
              "Track the history and statuses of all claims you have made.",
            ]}
          >
            <Box>
              <NavLink
                to="/issuer/claims/new-claims"
                style={{ textDecoration: "none" }}
              >
                <Button variant="outlined" color="secondary">
                  New claim
                </Button>
              </NavLink>
            </Box>
          </Header>
          <Box
            sx={{
              width: "100%",
              px: {
                xs: 1,
                sm: 1,
                lg: 6,
              },
            }}
          >
            <Tabs
              variant="fullWidth"
              value={tab}
              onChange={handleChange}
              sx={(theme: any) => ({
                "& .MuiTabs-flexContainer": {
                  height: "60px",
                },
                "& .MuiTabs-indicator": {
                  backgroundColor: "#C0D5F4",
                  height: "100%",
                  opacity: 1,
                  borderRadius: 1.5,
                },
                "& .MuiTab-root": {
                  color: "#114898",
                  zIndex: 2,
                  fontSize: "1.125rem",
                  fontWeight: 500,
                },
                backgroundColor: "#F0F0F0",
                borderRadius: 1.5,
                boxShadow: "0px 2px 3px #0000001F",
                mt: 2,
              })}
            >
              <Tab label="Issuance" />
              <Tab label="Revocation" />
              <Tab label="History" />
            </Tabs>
            <Box
              sx={{
                display: tab === 0 ? "block" : "none",
              }}
            >
              <Issuance refresh={refresh} setRefresh={setRefresh} />
            </Box>

            <Box
              sx={{
                display: tab === 1 ? "block" : "none",
              }}
            >
              <Revocation refresh={refresh} setRefresh={setRefresh} />
            </Box>
            <Box
              sx={{
                display: tab === 2 ? "block" : "none",
              }}
            >
              <History refresh={refresh} setRefresh={setRefresh} />
            </Box>
          </Box>
        </Box>
      )}
    </>
  );
};
export default IssuerClaims;
