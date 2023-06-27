import { Button, CircularProgress, Grid, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { usePortalContext } from "src/context/PortalContext";
// import * as AWS from "amazon-cognito-identity-js";
import axios from "axios";
import { useSnackbar } from "notistack";
import { useIdWalletContext } from "src/context/identity-wallet-context";
import { zidenBackend, zidenBackup } from "src/client/api";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { displayTitle } from "src/context/PortalContext";
import { toBase64 } from "src/utils/image/imageUtil";

const Summary = () => {
  const { setActiveStep, userData, selfieFile, frontImageFile } =
    usePortalContext();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { enqueueSnackbar } = useSnackbar();
  const { isUnlocked, getZidenUserID, keyContainer, checkForDek } =
    useIdWalletContext();
  const params: any = useParams();

  const handleBack = () => {
    setActiveStep((prev: number) => prev - 1);
  };

  const handleGetRegistryData = async () => {
    if (params?.requestID) {
      const res = await zidenBackend.get(
        `/registries/schemas/${params.requestID}`
      );
      return {
        endpointUrl: res.data.registry.endpointUrl,
        schemaHash: res.data.registry.schemaHash,
        issuerID: res.data.registry.issuerId,
      };
    }
  };
  const handleSubmit = async () => {
    if (isUnlocked) {
      setIsLoading(true);
      try {
        await handlePostData();
        enqueueSnackbar("Get claim success!", {
          variant: "success",
          autoHideDuration: 2000,
        });
        setActiveStep((prev: number) => prev + 2);
      } catch (err) {
        console.log("🚀: ", err);
      }
      setIsLoading(false);
    } else {
      enqueueSnackbar("Please unlock your wallet to sumbit!", {
        variant: "warning",
        autoHideDuration: 2000,
      });
    }
  };
  // check for Dek (key for encrypt backup data)
  const handlePostData = async () => {
    const postData = {
      nationality: "",
      countryOfResidence: "",
      gender: "",
      dateOfBirth: "",
      industry: " ",
      occupation: " ",
      addresses: [],
      phoneNumbers: [],
      sourceOfFunds: "",
      emailAddresses: [],
      bankAccounts: [],
      countryOfBirth: "",
      idType: "",
      idNumber: "",
      primary: true,
      ...userData,
    };
    const keys = keyContainer.generateKeyForClaim();
    const privateKey = keys?.privateKey;
    const publicKey = keys?.publicKey;
    const publicKeyArrayForm = Array.from(publicKey);
    const userID = await getZidenUserID();
    const resgistryData: any = await handleGetRegistryData();
    const nationalID = await toBase64(frontImageFile);
    //send form data so server
    const result = await axios.post(
      resgistryData.endpointUrl,
      {
        holderId: userID,
        schemaHash: resgistryData.schemaHash,
        publicKey: publicKeyArrayForm,
        data: {
          individualRecords: [postData],
          isActiveCustomer: true,
          paymentModes: ["VIRTUAL CURRENCY"],
          onboardingMode: "NON FACE-TO-FACE",
          productServiceComplexity: "SIMPLE",
          natureOfBusinessRelationship: "Nature of business relationship",
          users: [],
          domains: [6],
          userId: userID,
        },
        nationalId: nationalID,
        selfie: selfieFile,
      },
      {
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );
    const serverPublicKey = new Uint8Array(result.data.data.serverPublicKey);
    const encodeClaim = new Uint8Array(result.data.data.encodeClaim);
    const nonce = new Uint8Array(result.data.data.nonce);
    const libsodium = keyContainer.getCryptoUtil();
    var decrypted = libsodium.crypto_box_open_easy(
      encodeClaim,
      nonce,
      serverPublicKey,
      privateKey,
      "text"
    );
    const data = JSON.stringify({
      claimId: result.data.data.claimId,
      claim: decrypted,
      schemaHash: resgistryData.schemaHash,
      issuerID: resgistryData.issuerID,
    });
    const dataEncrypted = keyContainer.encryptWithDataKey(data);
    //save data to local storage
    keyContainer.db.insert(
      "ziden-user-claims/" + result.data.data.claimId,
      dataEncrypted
    );
    //backup data
    const backupKeys = keyContainer.generateKeyForBackup();
    let dek = await checkForDek();
    if (!dek) {
      //dek not exist
      //generate dek
      dek = keyContainer.generateDekForBackup();
      const dekEncode = libsodium.crypto_box_seal(
        dek,
        libsodium.from_hex(backupKeys.publicKey),
        "hex"
      );
      //post to server
      await zidenBackup.post("/holder", {
        holderId: userID,
        dek: dekEncode,
      });
    } else {
      // dek exist:
      //get dek from server and decode dek
      dek = libsodium.crypto_box_seal_open(
        libsodium.from_hex(dek),
        libsodium.from_hex(backupKeys.publicKey),
        libsodium.from_hex(backupKeys.privateKey),
        "text"
      );
    }
    const backupNonce = libsodium.randombytes_buf(
      libsodium.crypto_box_NONCEBYTES,
      "hex"
    );
    const dataEncode = libsodium.crypto_secretbox_easy(
      JSON.stringify({
        id: result.data.data.claimId,
        claim: JSON.parse(data).claim,
        issuerID: resgistryData.issuerID,
        schemaHash: JSON.parse(data).schemaHash,
      }),
      libsodium.from_hex(backupNonce),
      libsodium.from_hex(dek),
      "hex"
    );
    await zidenBackup.post("backup?type=ZIDEN", {
      holderId: userID,
      issuerId: resgistryData.issuerID,
      claimId: result.data.data.claimId,
      data: dataEncode,
      nonce: backupNonce,
    });
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
          {Object.keys(userData).map((item: string, index: number) => {
            type userKey = keyof typeof displayTitle;
            const indexKey = item as userKey;
            if (index % 2 === 0) {
              return (
                <Grid key={item + index} item xs={12} sm={5} md={4} py={2}>
                  <Typography variant="body2" color="secondary">
                    {item}
                  </Typography>
                  <Typography variant="h5" color="text.secondary">
                    {/* @ts-ignore */}
                    {userData[item]}
                  </Typography>
                </Grid>
              );
            } else {
              return (
                <Grid key={item + index} item xs={12} sm={7} md={8} py={2}>
                  <Typography variant="body2" color="secondary">
                    {displayTitle[indexKey]}
                  </Typography>
                  <Typography variant="h5" color="text.secondary">
                    {/* @ts-ignore */}
                    {userData[item]}
                  </Typography>
                </Grid>
              );
            }
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
        <Button
          sx={{
            minWidth: "100px",
          }}
          variant="contained"
          onClick={handleSubmit}
        >
          {isLoading ? (
            <CircularProgress
              size={23}
              sx={{
                color: "#FFFFFF",
              }}
            />
          ) : (
            "Submit"
          )}
        </Button>
      </Box>
    </Box>
  );
};
export default Summary;
