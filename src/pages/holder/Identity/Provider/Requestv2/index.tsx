/* eslint-disable no-empty-pattern */
import {
  Autocomplete,
  Avatar,
  Grid,
  MenuItem,
  NativeSelect,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { zidenBackup, zidenIssuerNew, zidenPortal } from "src/client/api";
import Header from "src/components/Header";
import { schema as zidenSchema } from "@zidendev/zidenjs";
import { truncateString } from "src/utils/wallet/walletUtils";
import { useIdWalletContext } from "src/context/identity-wallet-context";
import { LoadingButton } from "@mui/lab";
import { useSnackbar } from "notistack";
import { PulseLoadingIcon } from "src/constants/icon";
import { parseLabel } from "src/utils/claim";
import { userType } from "src/constants";

const dataTypeMaping = (type: string) => {
  switch (type) {
    case "std:str":
      return "text";
    case "std:int32":
      return "number";
    case "std:double":
      return "number";
    case "std:bool":
      return "checkbox";
    case "std:date":
      return "date";
    default:
      return "text";
  }
};

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

const Requestv2 = () => {
  const { enqueueSnackbar } = useSnackbar();
  const {
    isUnlocked,
    keyContainer,
    getZidenUserID,
    checkForDek,
  } = useIdWalletContext();
  const params: any = useParams();
  const history = useHistory();
  const [form, setForm] = useState<any>({});
  const [formData, setFormData] = useState<any>({});
  const [required, setRequired] = useState<Array<any>>([]);
  const [metaData, setMetaData] = useState<any>({});
  const [loading, setLoading] = useState<boolean>();
  const [fetching, setFetching] = useState<boolean>(false);
  const [helperText, setHelperText] = useState<any>({});

  useEffect(() => {
    async function fetchSchema() {
      setFetching(true);
      try {
        const registryMetaData = await zidenPortal.get(
          `/registries/${params.requestID}`
        );
        setMetaData(registryMetaData.data?.registry);
        const schemaHash = registryMetaData?.data?.registry?.schema?.schemaHash;
        const schemaDetail = await zidenPortal.get(`/schemas/${schemaHash}`);
        let {
          "@name": {},
          "@id": {},
          "@hash": {},
          "@required": {},
          ...schemaToDisplay
        } = zidenSchema.getInputSchema(schemaDetail.data.schema?.jsonSchema);
        setForm(schemaToDisplay);
        setRequired(schemaDetail.data.schema?.jsonSchema["@required"]);
      } catch (err) {
        setFetching(false);
      }
      setFetching(false);
    }
    fetchSchema();
  }, [params.requestID]);
  //input: datatype, context data, replace all none std type with context data , if type="std:obj" replace all sub props with contextData
  const handleChangeFormData = (field: string, value: any, type: string) => {
    let processedValue = value;
    if (type === "std:date") {
      let temp = value.replaceAll("-", "");
      processedValue = Number(temp);
    }
    setFormData((prev: any) => {
      return {
        ...prev,
        [field]: processedValue,
      };
    });
  };
  const handleChangeFormSubData = (
    field: string,
    subField: string,
    value: any,
    type: string
  ) => {
    let processedValue = value;
    if (type === "std:date") {
      let temp = value.replaceAll("-", "");
      processedValue = Number(temp);
    }
    setFormData((prev: any) => {
      const subFieldData = prev[field] || {};
      return {
        ...prev,
        [field]: {
          ...subFieldData,
          [subField]: processedValue,
        },
      };
    });
  };

  //send request data to server and receive claim
  const handleConfirm = async () => {
    if (isUnlocked) {
      let isValid = true;
      setHelperText({});
      for (const require of required) {
        if (formData[require] !== 0 && !formData[require]) {
          setHelperText((prev: any) => {
            return { ...prev, [require]: `${parseLabel(require)} is Missing` };
          });
          isValid = false;
        }
      }
      if (!isValid) {
        return;
      }
      try {
        setLoading(true);
        const libsodium = keyContainer.getCryptoUtil();
        const userID = await getZidenUserID();

        const result = await zidenIssuerNew.post(
          `/claims/request/${metaData?.issuer?.issuerId}`,
          {
            holderId: userID,
            registryId: params.requestID,
            data: formData,
          }
        );

        const data = JSON.stringify({
          claimId: result.data?.claimId,
          claim: JSON.stringify({
            rawData: result.data?.rawData,
            claim: result.data?.claim
          }),
          schemaHash: metaData.schema?.schemaHash,
          issuerID: metaData.issuer.issuerId,
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
        localDB.insert(
          `ziden-user-claims/${result.data.claimId}`,
          dataEncrypted
        );

        if (result?.data?.data?.error) {
          enqueueSnackbar("Get claim failed!", {
            variant: "error",
          });
          setLoading(false);
          return;
        }

        //Auto backup
        //@ts-ignore
        const backupKeys = keyContainer.generateKeyForBackup();
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
            id: result.data?.claimId,
            claim: JSON.parse(data).claim,
            issuerID: metaData.issuer.issuerId,
            schemaHash: metaData.schema?.schemaHash,
          }),
          libsodium.from_hex(backupNonce),
          libsodium.from_hex(dek),
          "hex"
        );
        await zidenBackup.post("backup?type=ZIDEN", {
          holderId: userID,
          issuerId: metaData.issuer.issuerId,
          claimId: result.data?.claimId,
          data: dataEncode,
          nonce: backupNonce,
        });
        
        enqueueSnackbar("Get claim success!", {
          variant: "success",
        });
        setLoading(false);
        history.push("/holder/identity");
      } catch (err) {
        setLoading(false);
        enqueueSnackbar("Get claim failed!", {
          variant: "error",
        });
      }
    } else {
      enqueueSnackbar("Please unlock your wallet!", {
        variant: "info",
      });
    }
  };
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
              height: "100%",
              maxWidth: "1700px",
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              width: "100%",
              mt: 3,
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
                      {truncateString(metaData?.issuer?.issuerId || "", 20)}
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
                      {metaData.network?.name || ""}
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
                      {new Date(
                        Date.now() + metaData.expiration
                      ).toDateString()}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} md={12} lg={8}>
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
                    "& .MuiFormHelperText-root": {
                      color: "#F7A993",
                    },
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
                  {!fetching &&
                    form &&
                    Object.keys(form).map((item: any, index: number) => {
                      const inputData = form[item];
                      if (inputData["@type"] === "std:obj") {
                        const {
                          "@type": {},
                          "@id": {},
                          ...subData
                        } = inputData;
                        return (
                          <Box
                            key={index}
                            sx={{
                              mt: 4,
                              p: {
                                xs: 2,
                                xsm: 2,
                                md: 3,
                                lg: 3,
                              },
                              borderRadius: 2,
                              // border: "1px solid rgba(0, 0, 0, 0.23)",
                              position: "relative",
                              boxShadow: "inset 0px -1px 6px #00000029",
                              background: "#EFEFEF 0% 0% no-repeat padding-box",
                            }}
                          >
                            <Typography
                              sx={{
                                fontSize: "1rem",
                                px: "5px",
                                color: "#000d1c",
                                position: "absolute",
                                top: "-32px",
                                left: "0px",
                              }}
                            >
                              {parseLabel(item)}
                              {required?.includes(item) && "*"}
                            </Typography>
                            {Object.keys(subData).map(
                              (subItem: any, index: number) => {
                                const values = subData[subItem]["@values"];
                                const display = subData[subItem]["@display"];
                                if (values?.length > 0) {
                                  if (display?.length > 0) {
                                    const options = values.map(
                                      (value: any, index: number) => {
                                        return {
                                          label: display[index],
                                          value: value,
                                        };
                                      }
                                    );
                                    return (
                                      <Autocomplete
                                        key={index}
                                        options={options}
                                        renderInput={(params) => (
                                          <TextField
                                            {...params}
                                            sx={{
                                              my: 2,
                                            }}
                                            label={parseLabel(subItem)}
                                          />
                                        )}
                                        onChange={(e, newValue: any) => {
                                          handleChangeFormSubData(
                                            item,
                                            subItem,
                                            newValue.value,
                                            subData[subItem]["@type"]
                                          );
                                        }}
                                      />
                                    );
                                  } else {
                                    return (
                                      <Box
                                        key={index}
                                        sx={{
                                          position: "relative",
                                        }}
                                      >
                                        <Typography
                                          sx={{
                                            position: "absolute",
                                            top: "-9px",
                                            left: "0px",
                                            fontSize: "1rem",
                                            transform: "scale(0.75)",
                                            backgroundColor: "#FFFFFC",
                                            px: "5px",
                                            color: "#000d1c",
                                            zIndex: 2,
                                          }}
                                        >
                                          {parseLabel(subItem)}
                                        </Typography>
                                        <NativeSelect
                                          key={index}
                                          disableUnderline
                                          sx={{
                                            my: 2,
                                            height: "56px",
                                            border:
                                              "1px solid rgba(0, 0, 0, 0.23)",
                                            borderRadius: "10px",
                                            pl: "10px",
                                            "& .MuiSvgIcon-root": {
                                              mr: 1,
                                            },
                                            "& ul": {
                                              py: 1,
                                            },
                                          }}
                                          // label={parseLabel(subItem)}
                                          inputProps={{
                                            name: parseLabel(subItem),
                                            id: "uncontrolled-native",
                                          }}
                                          onChange={(e) => {
                                            handleChangeFormSubData(
                                              item,
                                              subItem,
                                              e.target.value,
                                              subData[subItem]["@type"]
                                            );
                                          }}
                                          fullWidth
                                        >
                                          {values?.map(
                                            (valueItem: any, index: number) => {
                                              return (
                                                <option
                                                  style={{
                                                    fontSize: "1rem",
                                                  }}
                                                  value={valueItem}
                                                >
                                                  {valueItem}
                                                </option>
                                              );
                                            }
                                          )}
                                        </NativeSelect>
                                      </Box>
                                    );
                                  }
                                } else {
                                  return (
                                    <TextField
                                      key={index}
                                      sx={{
                                        my: 2,
                                      }}
                                      label={parseLabel(subItem)}
                                      fullWidth
                                      type={dataTypeMaping(form[item]["@type"])}
                                      InputLabelProps={{
                                        shrink:
                                          form[item]["@type"] === "std:date"
                                            ? true
                                            : undefined,
                                      }}
                                      onChange={(e) => {
                                        handleChangeFormSubData(
                                          item,
                                          subItem,
                                          e.target.value,
                                          subData[subItem]["@type"]
                                        );
                                      }}
                                    />
                                  );
                                }
                              }
                            )}
                            <Typography
                              variant="body2"
                              sx={{ color: "#F7A993" }}
                            >
                              {helperText[item]}
                            </Typography>
                          </Box>
                        );
                      } else {
                        const values = inputData["@values"];
                        const display = inputData["@display"];
                        if (values?.length > 0) {
                          if (display?.length > 0) {
                            const options = values.map(
                              (value: any, index: number) => {
                                return {
                                  label: display[index],
                                  value: value,
                                };
                              }
                            );
                            return (
                              <Autocomplete
                                key={index}
                                options={options}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    sx={{
                                      my: 1,
                                    }}
                                    required={required?.includes(item)}
                                    label={parseLabel(item)}
                                    helperText={helperText[item] || " "}
                                  />
                                )}
                                onChange={(e, newValue: any) => {
                                  handleChangeFormData(
                                    item,
                                    newValue.value,
                                    form[item]["@type"]
                                  );
                                }}
                              />
                            );
                          } else {
                            return (
                              <TextField
                                key={index}
                                sx={{
                                  my: 1,
                                }}
                                select
                                label={parseLabel(item)}
                                required={required?.includes(item)}
                                fullWidth
                                onChange={(e) => {
                                  handleChangeFormData(
                                    item,
                                    e.target.value,
                                    form[item]["@type"]
                                  );
                                }}
                                helperText={helperText[item] || " "}
                              >
                                {values?.map(
                                  (valueItem: any, index: number) => {
                                    return (
                                      <MenuItem key={index} value={valueItem}>
                                        {valueItem}
                                      </MenuItem>
                                    );
                                  }
                                )}
                              </TextField>
                            );
                          }
                        } else {
                          return (
                            <TextField
                              key={index}
                              sx={{
                                my: 1,
                              }}
                              label={parseLabel(item)}
                              required={required?.includes(item)}
                              fullWidth
                              type={dataTypeMaping(form[item]["@type"])}
                              InputLabelProps={{
                                shrink:
                                  form[item]["@type"] === "std:date"
                                    ? true
                                    : undefined,
                              }}
                              onChange={(e) => {
                                handleChangeFormData(
                                  item,
                                  e.target.value,
                                  form[item]["@type"]
                                );
                              }}
                              helperText={helperText[item] || " "}
                            />
                          );
                        }
                      }
                    })}
                  {!fetching && (
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        mt: 2,
                      }}
                    >
                      <LoadingButton
                        loading={loading}
                        sx={{
                          width: "125px",
                          height: "36px",
                          fontSize: "1rem",
                          fontWeight: 500,
                          borderRadius: 1.8,
                        }}
                        variant="contained"
                        color="primary"
                        onClick={handleConfirm}
                      >
                        Submit
                      </LoadingButton>
                    </Box>
                  )}
                  {fetching && (
                    <Box
                      sx={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <PulseLoadingIcon />
                    </Box>
                  )}
                </Paper>
              </Grid>
            </Grid>
          </Box>
        </Box>
      )}
    </>
  );
};
export default Requestv2;
