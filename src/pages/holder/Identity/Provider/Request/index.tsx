import {
  Avatar,
  Button,
  FormControl,
  Grid,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import Header from "src/components/Header";
import { useIdWalletContext } from "src/context/identity-wallet-context";
import { schema as zidenSchema } from "@zidendev/zidenjs";
import { zidenBackup, zidenPortal } from "src/client/api";
import { useSnackbar } from "notistack";
import LoadingComponent from "src/components/LoadingComponent";
import axios from "axios";
import { FormTypeMapping } from "src/utils/claim";
import { truncateString } from "src/utils/wallet/walletUtils";

//styling
const infoStyle = (theme: any) => {
  return {
    "& .MuiInputBase-root": {
      borderRadius: 3,
    },
    mb: {
      xs: 1,
      md: 1,
      lg: 2,
    },
    mr: {
      xs: 1,
      md: 1,
      lg: 0,
    },
    maxWidth: { xs: "250px", lg: "600px" },
    minWidth: "250px",
    display: "flex",
    alignItems: "left",
    flexDirection: "column",
    flexGrow: 1,
  };
};

const Request = () => {
  const params: any = useParams();
  const [metaData, setMetaData] = useState<any>({});

  const [formSchema, setFormSchema] = useState<any>();
  const [required, setRequired] = useState<any>();
  const [formData, setFormData] = useState<any>({});
  const [validUntil, setValidUntil] = useState<string>();
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [schemaHash, setSchemaHash] = useState();
  const [issuerID, setIssuerID] = useState<any>();
  const [endPointUrl, setEndpointUrl] = useState<string>("");
  const { enqueueSnackbar } = useSnackbar();
  const { keyContainer, isUnlocked, getZidenUserID, checkForDek } =
    useIdWalletContext();
  const history = useHistory();
  useEffect(() => {
    async function fetchSchema() {
      setIsSuccess(false);
      const registryMetaData = await zidenPortal.get(
        `/registries/${params.requestID}`
      );
      setMetaData(registryMetaData.data?.registry);

      const schemaHash = registryMetaData?.data?.registry?.schema?.schemaHash;
      const schemaDetail = await zidenPortal.get(`/schemas/${schemaHash}`);

      //   setFormSchema(schemaDetail.data.)

      // const response: any = await zidenBackend.get(
      //   `/registries/schemas/${params.requestID}`
      // );

      // const res2: any = await zidenBackend.get(
      //   `/registries/schemas/${params.requestID}/request`
      // );
      // setEndpointUrl(res2?.data?.endpointUrl);
      // setTitleData({
      //   title: res2.data.title,
      //   provider: res2.data.provider,
      //   description: res2.data.description,
      //   logo: res2.data.logoUrl,
      // });
      // setFormSchema(response?.data.schema.properties);
      // setSchemaHash(response?.data.schema.schemaHash);
      // setIssuerID(response?.data.registry.issuerId);
      // setRequired(response?.data.schema.required);
      // setValidUntil(
      //   new Date(Date.now() + response?.data.registry.expiration).toDateString()
      // );
      // ?.setIsSuccess(true);
    }
    fetchSchema();
  }, [params.requestID]);
  // check for Dek (key for encrypt backup data)
  const handleConfirm = async () => {
    if (isUnlocked) {
      for (var i = 0; i < required.length; i++) {
        if (!formData[required[i]]) {
          enqueueSnackbar(`${required[i]} is empty!`, {
            variant: "warning",
          });
          return;
        }
      }
      setLoading(true);
      const libsodium = keyContainer.getCryptoUtil();
      const userID = await getZidenUserID();
      try {
        const keys = keyContainer.generateKeyForClaim();
        const privateKey = keys?.privateKey;
        const publicKey = keys?.publicKey;
        const publicKeyArrayForm = Array.from(publicKey);
        const result = await axios.post(endPointUrl, {
          holderId: userID,
          sessionID: "session1",
          schemaHash: schemaHash,
          publicKey: publicKeyArrayForm,
          data: formData,
        });
        if (result?.data?.data?.error) {
          enqueueSnackbar("Get claim failed!", {
            variant: "error",
          });
          setLoading(false);
          return;
        }
        const serverPublicKey = new Uint8Array(
          result.data.data.serverPublicKey
        );
        const encodeClaim = new Uint8Array(result.data.data.encodeClaim);
        const nonce = new Uint8Array(result.data.data.nonce);
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
          schemaHash: schemaHash,
          issuerID: issuerID,
        });
        // console.log(JSON.parse(JSON.parse(data).claim));
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
        localDB.insert(
          `ziden-user-claims/${result.data.data.claimId}`,
          dataEncrypted
        );
        const backupKeys = keyContainer.generateKeyForBackup();
        //get encryption key (dek)
        let dek = await checkForDek();
        if (!dek) {
          //dek not exist
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
          //decode dek
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
            issuerID: issuerID,
            schemaHash: JSON.parse(data).schemaHash,
          }),
          libsodium.from_hex(backupNonce),
          libsodium.from_hex(dek),
          "hex"
        );
        await zidenBackup.post("backup?type=ZIDEN", {
          holderId: userID,
          issuerId: issuerID,
          claimId: result.data.data.claimId,
          data: dataEncode,
          nonce: backupNonce,
        });
        // console.log(res);
      } catch (err) {
        console.log(err);
      }

      setLoading(false);
      enqueueSnackbar("Get claim success!", {
        variant: "success",
      });
      history.push("/holder/identity");
    } else {
      enqueueSnackbar("Please unlock your wallet!", {
        variant: "warning",
        preventDuplicate: true,
      });
    }
  };
  // backup

  return (
    <>
      {metaData && (
        <Box
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
          }}
        >
          <Header
            title1={metaData?.schema?.name || ""}
            title2={metaData?.issuer?.name || ""}
            description={[metaData?.description]}
          >
            <Avatar
              sx={{
                borderRadius: "50%",
                border: "1px solid #6C8EC1",
                width: "110px",
                height: "110px",
              }}
              alt=""
              src={metaData?.issuer?.logoUrl}
            />
          </Header>
          <Box
            sx={{
              px: {
                xs: 2,
                xsm: 2,
                md: 3,
                lg: 6,
              },
              py: 4,
              height: "100%",
              maxWidth: "1700px",
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} md={12} lg={4}>
                <Box
                  sx={{
                    width: "100%",
                    display: "flex",
                    flexDirection: {
                      xs: "row",
                      md: "row",
                      lg: "column",
                    },
                    flexWrap: "wrap",
                    ml: {
                      xs: 2,
                      xsm: 3,
                      lg: 0,
                    },
                    borderRadius: 4,
                  }}
                >
                  <Box sx={infoStyle}>
                    <Typography
                      variant="body2"
                      color="secondary"
                      sx={{
                        minWidth: "150px",
                      }}
                    >
                      Issuer ID
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      {truncateString(issuerID, 20)}
                    </Typography>
                  </Box>
                  <Box sx={infoStyle}>
                    <Typography
                      variant="body2"
                      color="secondary"
                      sx={{
                        minWidth: "150px",
                      }}
                    >
                      Type
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      On-chain
                    </Typography>
                  </Box>
                  <Box sx={infoStyle}>
                    <Typography
                      variant="body2"
                      color="secondary"
                      sx={{
                        minWidth: "150px",
                      }}
                    >
                      Network
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      BNB chain
                    </Typography>
                  </Box>
                  <Box sx={infoStyle}>
                    <Typography
                      variant="body2"
                      color="secondary"
                      sx={{
                        minWidth: "150px",
                      }}
                    >
                      Valid until
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      {validUntil}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} md={12} lg={8}>
                {isSuccess && (
                  <Paper
                    sx={{
                      width: "100%",
                      boxShadow: "0px 2px 8px #0000001F",
                      p: {
                        xs: 2,
                        xsm: 3,
                        lg: 5,
                      },
                      borderRadius: 4,
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: "1.5rem",
                        color: "#114898",
                        fontWeight: 700,
                        lineHeight: "32.4px",
                        mb: 4,
                      }}
                    >
                      {" "}
                      Your Information
                    </Typography>

                    <FormControl
                      sx={{
                        width: "100%",
                      }}
                    >
                      {formSchema !== undefined &&
                        Object.keys(formSchema).map(
                          (field: any, index: any) => {
                            return (
                              <Box
                                sx={{
                                  "& .MuiInputBase-root": {
                                    borderRadius: 3,
                                  },
                                }}
                                key={formSchema[field]?.title + index}
                              >
                                <TextField
                                  sx={{
                                    mb: 3,
                                  }}
                                  fullWidth
                                  variant="outlined"
                                  placeholder={`Enter ${formSchema[field]?.title}`}
                                  onChange={(e) => {
                                    var value: any = e.target.value;
                                    if (formSchema[field]?.type === "date") {
                                      value = value.replaceAll("-", "");
                                      value = Number(value);
                                    }
                                    if (
                                      formSchema[field]?.propertyName ===
                                      "countryCode"
                                    ) {
                                      value = Number(value);
                                    }
                                    setFormData((prev: any) => {
                                      return {
                                        ...prev,
                                        [field]: value,
                                      };
                                    });
                                  }}
                                  required={required.includes(field)}
                                  label={formSchema[field]?.title}
                                  type={FormTypeMapping(
                                    formSchema[field]?.type
                                  )}
                                  InputLabelProps={
                                    formSchema[field]?.type === "date" ||
                                    formSchema[field]?.type === "datetime-local"
                                      ? { shrink: true }
                                      : {}
                                  }
                                />
                              </Box>
                            );
                          }
                        )}
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "right",
                        }}
                      >
                        <Button
                          variant="contained"
                          sx={{
                            width: "125px",
                            height: "36px",
                            fontSize: "1rem",
                            fontWeight: 500,
                            borderRadius: 1.8,
                            "&:disabled": {
                              backgroundColor: "#114898",
                            },
                          }}
                          onClick={handleConfirm}
                          disabled={loading}
                        >
                          {loading ? (
                            <Box
                              sx={{
                                color: "#FFFFFF",
                                display: "flex",
                                justifyContent: "center",
                              }}
                            >
                              <CircularProgress
                                size={"1.4rem"}
                                color="inherit"
                              />
                            </Box>
                          ) : (
                            "Submit"
                          )}
                        </Button>
                      </Box>
                    </FormControl>
                  </Paper>
                )}
                {!isSuccess && (
                  <Box
                    sx={{
                      width: "100%",
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <CircularProgress />
                  </Box>
                )}
              </Grid>
            </Grid>
          </Box>
        </Box>
      )}
      {!metaData && <LoadingComponent type={2} />}
    </>
  );
};

export default Request;
