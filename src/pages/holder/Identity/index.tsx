import { Button, Tab, Tabs } from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import Header from "src/components/Header";
import OnDevice from "./components/OnDevice";
import { zidenBackup } from "src/client/api";
import axios from "axios";
import { getAllUserClaim } from "src/utils/db/localStorageDb";
import { useIdWalletContext } from "src/context/identity-wallet-context";
import Await from "./components/Await";
import { userType } from "src/constants";

const Identity = () => {
  const [tab, setTab] = useState<number>(0);
  const [refresh, setRefresh] = useState<number>(0);
  //data
  const {
    keyContainer,
    getZidenUserID,
    isUnlocked,
    checkUserType,
    checkForDek,
  } = useIdWalletContext();

  //push narrow victory wedding flower expand like object genuine wear away rocket
  const handleSync = React.useCallback(async () => {
    //@ts-ignore
    const userId = await getZidenUserID();
    const libsodium = keyContainer.getCryptoUtil();
    const keys = keyContainer.generateKeyForBackup();
    //get encryption key (dek)
    let dek = await checkForDek();
    if (!dek) {
      //dek not exist
      dek = keyContainer.generateDekForBackup();
      const dekEncode = libsodium.crypto_box_seal(
        dek,
        libsodium.from_hex(keys.publicKey),
        "hex"
      );
      //post to server
      await zidenBackup.post("/holder", {
        holderId: userId,
        dek: dekEncode,
      });
    } else {
      // dek exist:
      //decode dek
      dek = libsodium.crypto_box_seal_open(
        libsodium.from_hex(dek),
        libsodium.from_hex(keys.publicKey),
        libsodium.from_hex(keys.privateKey),
        "text"
      );
    }
    const allUserClaimData = await zidenBackup.get(
      `backup?holderId=${userId}`
    );

    //check for backup
    if (allUserClaimData.data?.data?.length > 0) {
      const localClaimId = getAllUserClaim().map((item) => item.id);
      let allDataEncoded: any;
      const resultData = allUserClaimData.data?.data
        ?.filter((item: any) => {
          //remove existed data
          return !localClaimId.includes(item.claimId);
        })
        .map((claim: any) => {
          return axios.get(claim.accessUri);
        });
      Promise.allSettled(resultData).then((res) => {
        allDataEncoded = res
          .map((data) => {
            if (data.status === "fulfilled") {
              try {
                const nonce = data.value?.data?.nonce;
                const dataDecrypted = libsodium.crypto_secretbox_open_easy(
                  libsodium.from_hex(data.value?.data?.data),
                  libsodium.from_hex(nonce),
                  libsodium.from_hex(dek),
                  "text"
                );
                return { id: data.value?.data?.claimId, data: dataDecrypted };
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
    
  }, [keyContainer, getZidenUserID, checkForDek]);

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
        </Tabs>
        {tab === 0 && <OnDevice refresh={refresh} />}
        {tab === 1 && <Await />}
      </Box>
    </Box>
  );
};

export default Identity;
