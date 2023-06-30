import { Button, Tab, Tabs } from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import Header from "src/components/Header";
import OnDevice from "./components/OnDevice";
import axios from "axios";
import { getAllUserClaim } from "src/utils/db/localStorageDb";
import { useIdWalletContext } from "src/context/identity-wallet-context";
import Await from "./components/Await";
import { zidenIssuer } from "src/client/api";

const Identity = () => {
  const [tab, setTab] = useState<number>(0);
  const [refresh, setRefresh] = useState<number>(0);
  //data
  const {
    keyContainer,
    getZidenUserID,
    isUnlocked,
  } = useIdWalletContext();

  //push narrow victory wedding flower expand like object genuine wear away rocket
  const handleSync = React.useCallback(async () => {
    //@ts-ignore
    const userId = await getZidenUserID();
    console.log("🚀 ~ file: index.tsx:27 ~ handleSync ~ userId:", userId)
    
    const libsodium = keyContainer.getCryptoUtil();
    const keys = keyContainer.generateKeyForBackup();

    const allUserClaimEncode = (await zidenIssuer.get(`/claims/${userId}/retrieve-data`)).data;

    console.log("🚀 ~ file: index.tsx:32 ~ handleSync ~ allUserClaimEncode:", allUserClaimEncode)

    console.log(keys);

    let allUserClaimData: Array<any> = [];
    for (let i = 0; i < allUserClaimEncode.length; i++) {
      const element = allUserClaimEncode[i];
      const claimData = JSON.parse(libsodium.crypto_box_seal_open(libsodium.from_hex(element), libsodium.from_hex(keys.publicKey), libsodium.from_hex(keys.privateKey), "text"));
      console.log("🚀 ~ file: index.tsx:39 ~ allUserClaimEncode.array.forEach ~ claimData:", claimData)
      allUserClaimData.push(claimData);
    }

    // all user claim data
    // [ {claimId: id, claim: [entry], issuerId: id, rawData: stringJson, schemaHash: string} ]

    console.log("🚀 ~ file: index.tsx:37 ~ allUserClaimEncode.array.forEach ~ allUserClaimData:", allUserClaimData)

    //check for backup
    if (allUserClaimData.length > 0) {
      const localClaimId = getAllUserClaim().map((item) => item.id);
      let allDataEncoded: any;
      const resultData = allUserClaimData
        ?.filter((item: any) => {
          //remove existed data
          return !localClaimId.includes(item.claimId);
        })
        .map((claim: any) => {
          return claim
        });
      Promise.allSettled(resultData).then((res) => {
        allDataEncoded = res
          .map((data) => {
            if (data.status === "fulfilled") {
              try {
                const dataDecrypted = JSON.stringify({
                  claimId: data.value.claimId,
                  claim: JSON.stringify({
                    rawData: JSON.parse(data.value?.rawData),
                    claim: data.value?.claim
                  }),
                  schemaHash: data.value?.schemaHash,
                  issuerID: data.value?.issuerId,
                });
                return { id: data.value?.claimId, data: dataDecrypted };
              } catch (err) {
                return false;
              }
            } else {
              return false;
            }
          })
          .filter((item) => item);
        for (let i = 0; i < allDataEncoded.length; i++) {
          const dataEncrypted = keyContainer.encryptWithDataKey(
            allDataEncoded[i].data
          );
          const localDB = keyContainer.db;
          if (localStorage.getItem("mobile-private-key")) {
            //@ts-ignore
            if (window.ReactNativeWebView) {
              //@ts-ignore
              window.ReactNativeWebView.postMessage(
                JSON.stringify({
                  type: "claim",
                  data: allDataEncoded[i].data,
                })
              );
            }
          }
          localDB.insert(
            `ziden-user-claims/${allDataEncoded[i].id}`,
            dataEncrypted
          );
        }
        setRefresh((prev) => prev + 1);
      });
    }
    
  }, [keyContainer, getZidenUserID]);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };
  useEffect(() => {
    if (isUnlocked) {
      handleSync();
    }
  }, [handleSync, isUnlocked]);
  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "left",
      }}
    >
      <Header
        title1="The Holder"
        title2="Manage your identity"
        description={[
          "All identity claims are stored in your devices and can only be accessed by you.",
          "The Holder Portal provides all the tools you need to manage your identity claims and prove who you are. Utilize claims to verify various services without disclosing your personal data, which is ensured by the Zero-knowledge Proof technology.",
        ]}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: {
              xs: "row",
              xsm: "column",
              md: "column",
              lg: "row",
            },
            alignItem: "flex-end",
          }}
        >
          <NavLink
            to={"/holder/identity/provider"}
            style={{ textDecoration: "none" }}
          >
            <Button variant="contained" color="secondary">
              Get new claim
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
              fontWeight: 400,
            },
            "& .Mui-selected": {
              fontWeight: 600,
            },
            backgroundColor: "#F0F0F0",
            borderRadius: 1.5,
            boxShadow: "0px 2px 3px #0000001F",
            mt: 2,
          })}
        >
          <Tab label="On Device" />
          <Tab label="Await" />
        </Tabs> */}
        {tab === 0 && <OnDevice refresh={refresh} />}
        {/* {tab === 1 && <Await />} */}
      </Box>
    </Box>
  );
};

export default Identity;
