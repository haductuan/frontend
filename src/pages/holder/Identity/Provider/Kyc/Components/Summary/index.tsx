import { Button, Grid, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useSnackbar } from "notistack";
import { useIdWalletContext } from "src/context/identity-wallet-context";
import { useState } from "react";
import { displayTitle } from "src/context/PortalContext";

import { useKYCContext } from "src/context/kyc-context";
import { parseLabel } from "src/utils/claim";
import { LoadingButton } from "@mui/lab";
import { zidenIssuerNew, zidenKYC } from "src/client/api";
import { useParams } from "react-router-dom";
import { userType } from "src/constants";

const Summary = () => {
  const { setActiveStep, userData, kycUserId, metaData } = useKYCContext();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { enqueueSnackbar } = useSnackbar();
  const params: any = useParams();
  const {
    isUnlocked,
    keyContainer,
    getZidenUserID,
    checkUserType,
  } = useIdWalletContext();
  const handleBack = () => {
    setActiveStep((prev: number) => prev - 1);
  };

  const handleSubmit = async () => {
    if (isUnlocked) {
      setIsLoading(true);
      try {
        await handleGetClaimData();
        enqueueSnackbar("Get claim success!", {
          variant: "success",
        });
        setActiveStep((prev: number) => prev + 2);
      } catch (err: any) {
        enqueueSnackbar(err.message, {
          variant: "success",
        });
      }
      setIsLoading(false);
    } else {
      enqueueSnackbar("Please unlock your wallet to sumbit!", {
        variant: "warning",
      });
    }
  };
  const handleGetClaimData = async () => {
    try {
      const libsodium = keyContainer.getCryptoUtil();
      const userID = await getZidenUserID();
      const result = await zidenIssuerNew.post(
        `/claims/request/${metaData?.issuerId}`,
        {
          holderId: userID,
          registryId: params.requestID,
          data: userData,
        }
      );

      const data = JSON.stringify({
        claimId: result.data?.claimId,
        claim: JSON.stringify({
          rawData: result.data?.rawData,
          claim: result.data?.claim
        }),
        schemaHash: metaData?.schemaHash,
        issuerID: metaData?.issuerId,
      });

      await zidenKYC.post("profile", {
        id: kycUserId,
        name: userData.name,
        documentId: userData.documentId,
        issuerId: metaData?.issuerId,
        claimId: result.data?.claimId,
        dob: userData.dateOfBirth,
        sex: userData.gender,
        nationality: userData.nationality,
        addresses: userData.addresses,
      });
      const dataEncrypted = keyContainer.encryptWithDataKey(data);
      const localDB = keyContainer.db;
      if (localStorage.getItem("mobile-private-key")) {
        //@ts-ignore
        if (window.ReactNativeWebView) {
          //@ts-ignore
          window.ReactNativeWebView.postMessage(
            JSON.stringify({
              type: "claim",
              data: data,
            })
          );
        }
      }
      //save to local storage
      localDB.insert(`ziden-user-claims/${result.data.claimId}`, dataEncrypted);
      if (result?.data?.data?.error) {
        throw Error("Get claim failed");
      }
      const userPlatform = checkUserType();
      //Auto backup
      //@ts-ignore
      
      const backupKeys = keyContainer.generateKeyForBackup();
      
    } catch (err: any) {
      throw Error(err.message);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        justifyContent: "space-between",
        height: "100%",
      }}
    >
      <Box>
        <Typography pb={3}>Basic Info</Typography>
      </Box>
      <Box
        sx={{
          width: "100%",
        }}
      >
        <Grid container spacing={2}>
          {Object.keys(userData)?.map((item: string, index: number) => {
            type userKey = keyof typeof displayTitle;
            const indexKey = item as userKey;
            return (
              <Grid
                key={index}
                item
                xs={12}
                sm={index % 2 === 0 ? 5 : 7}
                md={index % 2 === 0 ? 4 : 8}
                py={2}
              >
                <Typography variant="body2" color="secondary">
                  {parseLabel(displayTitle[indexKey])}
                </Typography>
                <Typography variant="h5" color="text.secondary">
                  {/* @ts-ignore */}
                  {userData[item]}
                </Typography>
              </Grid>
            );
          })}
        </Grid>
      </Box>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Button
          sx={{
            minWidth: "100px",
          }}
          variant="outlined"
          onClick={handleBack}
        >
          Back
        </Button>
        <LoadingButton
          loading={isLoading}
          sx={{
            minWidth: "100px",
          }}
          variant="contained"
          onClick={handleSubmit}
        >
          Submit
        </LoadingButton>
      </Box>
    </Box>
  );
};
export default Summary;
