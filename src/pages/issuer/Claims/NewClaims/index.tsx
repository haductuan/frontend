import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import Tab from "@mui/material/Tab";
import { Tabs } from "@mui/material";
import Header from "src/components/Header";
import ManualInput from "./ManualInput";
import BatchInput from "./BatchInput";
import Summary from "./Summary";
import { validateJWZ } from "src/utils/auth";
import { useIdWalletContext } from "src/context/identity-wallet-context";
import { useHistory } from "react-router-dom";
import { useSnackbar } from "notistack";
import { useIssuerContext } from "src/context/issuerContext";
import LoadingComponent from "src/components/LoadingComponent";
import axios from "axios";

const NewClaims = () => {
  const [tab, setTab] = useState<number>(0);
  const [isDone, setIsDone] = useState<boolean>(false);
  const [schemaData, setSchemaData] = useState<Array<any>>([]);
  const [isSignedIn, setIsSignedIn] = useState(false); // check for jwz and wallet unlock status
  const [allSchema, setAllSchema] = useState<Array<any>>([]);
  const { isUnlocked } = useIdWalletContext();
  const history = useHistory();
  const { enqueueSnackbar } = useSnackbar();
  const { endpointUrl } = useIssuerContext();
  const fetchAllSchemaTypes = async () => {
    const userId = localStorage.getItem("ziden-db/issuer-id");
    const allRegistries = (
      await axios.get(endpointUrl + `/registries?issuerId=${userId}`)
    ).data?.filter((item: any) => item.isActive);
    setAllSchema(
      allRegistries?.map((schema: any, index: number) => {
        return {
          value: { hash: schema.schema?.hash, registryId: schema.id },
          label: schema.schema?.name,
        };
      })
    );
  };
  useEffect(() => {
    if (
      !isUnlocked ||
      !localStorage.getItem("ziden-db/issuer-jwz") ||
      !localStorage.getItem("ziden-db/issuer-id")
    ) {
      enqueueSnackbar("Please unlock your wallet and sign in!", {
        autoHideDuration: 2000,
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
              autoHideDuration: 2000,
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
  useEffect(() => {
    fetchAllSchemaTypes();
  }, []);
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };
  return (
    <>
      {!isSignedIn && <LoadingComponent type={2} />}
      {isSignedIn && (
        <Box>
          <Header
            title1="New Claims"
            description={[
              "Select the suitable schema - document standard for your new claim. Fill the form with the targeted user's DID and other required information.",
              "After you submit, the claims are ready to be published on the blockchain.",
            ]}
          ></Header>
          {!isDone && (
            <Box
              sx={{
                width: "100%",
                px: {
                  xs: 2,
                  xsm: 3,
                  md: 4,
                  lg: 6,
                },
                height: "100%",
              }}
            >
              {/* <Tabs
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
                  my: 3,
                })}
              >
                <Tab   label="Manual Input" />
                <Tab   label="Batch Input" />
              </Tabs> */}
              <Box
                sx={{
                  display: tab === 0 ? "auto" : "none",
                  mt: 5,
                }}
              >
                <ManualInput
                  schemaData={schemaData}
                  setSchemaData={setSchemaData}
                  setIsDone={setIsDone}
                  allSchema={allSchema}
                />
              </Box>
              {/* <Box
                sx={{
                  display: tab === 1 ? "auto" : "none",
                }}
              >
                <BatchInput
                  schemaData={schemaData}
                  setSchemaData={setSchemaData}
                  setIsDone={setIsDone}
                  allSchema={allSchema}
                />
              </Box> */}
            </Box>
          )}
          {isDone && (
            <Box
              sx={{
                width: "100%",
                px: {
                  xs: 0,
                  sm: 1,
                  lg: 8,
                },
                py: {
                  xs: 0,
                  sm: 1,
                  lg: 8,
                },
                height: "100%",
              }}
            >
              <Summary
                schemaData={schemaData}
                setSchemaData={setSchemaData}
                setIsDone={setIsDone}
              />
            </Box>
          )}
        </Box>
      )}
    </>
  );
};
export default NewClaims;
