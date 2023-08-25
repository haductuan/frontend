/* eslint-disable no-empty-pattern */
import {
  Autocomplete,
  Avatar,
  Button,
  Grid,
  MenuItem,
  NativeSelect,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useRef, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { issuerServerNew, backendServer } from "src/client/api";
import Header from "src/components/Header";
import {
  Query,
  SignedChallenge,
  auth,
  queryMTP,
  schema,
  schema as zidenSchema,
} from "@zidendev/zidenjs";
import { truncateString } from "src/utils/wallet/walletUtils";
import { useIdWalletContext } from "src/context/identity-wallet-context";
import { LoadingButton } from "@mui/lab";
import { useSnackbar } from "notistack";
import { PulseLoadingIcon } from "src/constants/icon";
import {
  flattenData,
  generateProof,
  parseIssuerClaimMtp,
  parseLabel,
  parseNonRevMtp,
} from "src/utils/claim";

import { getAllUserClaim } from "src/utils/db/localStorageDb";
import { utils as zidenUtils } from "@zidendev/zidenjs";
import { Entry } from "@zidendev/zidenjs/build/claim/entry";

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
  const inputRef = useRef<HTMLInputElement>(null);
  const { isUnlocked, keyContainer, updateUserData, userId } =
    useIdWalletContext();
  const params: any = useParams();
  const history = useHistory();
  const [form, setForm] = useState<any>({});
  const [formData, setFormData] = useState<any>({});
  const [required, setRequired] = useState<Array<any>>([]);
  const [metaData, setMetaData] = useState<any>({});
  const [loading, setLoading] = useState<boolean>();
  const [fetching, setFetching] = useState<boolean>(false);
  const [helperText, setHelperText] = useState<any>({});
  const [requirements, setRequirements] = useState<Array<any>>([]);
  const [processedRequireData, setProcessedRequireData] = useState<any>();
  const [allClaims, setAllclaims] = useState<any>();
  const [imageFile, setImageFile] = useState<Blob>();

  useEffect(() => {
    async function fetchSchema() {
      setFetching(true);
      try {
        const registryMetaData = await backendServer.get(
          `/registries/${params.requestID}`
        );
        setRequirements(registryMetaData.data.registry.requirements);
        setMetaData(registryMetaData.data?.registry);
        const schemaHash = registryMetaData?.data?.registry?.schema?.schemaHash;
        const schemaDetail = await backendServer.get(`/schemas/${schemaHash}`);
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
      setLoading(true);
      const witness = await Promise.all(
        processedRequireData.map(async (item: any) => {

          return checkClaimValidation(item.validClaim, item);
        })
      );
      const proofs = await Promise.all(
        witness
          .map(async (result) => {
            if (result?.valid) {
              try {
                const resultProof = await generateProof(result.witness);
                return {
                  proof: resultProof?.proof,
                  publicData: resultProof?.publicSignals,
                };
              } catch (err) {
                throw err;
              }
            } else {
              return null;
            }
          })
          .map((res) => res)
      );

      setHelperText({});

      try {
        // const libsodium = keyContainer.getCryptoUtil();

        const requestBody = new FormData();
        requestBody.append("holderId", userId);
        requestBody.append("registryId", params.requestID);
        requestBody.append("data", JSON.stringify(formData));
        requestBody.append("zkProofs", JSON.stringify(proofs));
        console.log("🚀 ~ file: index.tsx:224 ~ handleConfirm ~ proofs:", proofs)

        if (proofs[0] == null && requirements.length > 0) {
          enqueueSnackbar("Attest requirement failed!", {
            variant: "error",
          });
          setLoading(false);
          return;
        }

        imageFile && requestBody.append("fileUpload", imageFile);
        const result = await issuerServerNew.post(
          `/claims/request/${metaData?.issuer?.issuerId}`,
          requestBody
        );

        const data = JSON.stringify({
          claimId: result.data?.claimId,
          claim: JSON.stringify({
            rawData: result.data?.rawData,
            claim: result.data?.claim,
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

        enqueueSnackbar("Get claim success!", {
          variant: "success",
        });
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
    setLoading(false);
  };

  const checkClaimValidation = React.useCallback(
    async (claimData: any, requirement: any) => {
      try {
        const schemas: any = await backendServer.get(
          `/schemas/${requirement.schemaHash}`
        );

        const slotData = flattenData(
          schema.schemaPropertiesSlot(schemas.data?.schema?.jsonSchema)
        )[requirement.query.propertyName];

        const challengeResponse = await issuerServerNew.get(
          `/registries/${params.requestID}/challenge`
        );
        const challenge = BigInt(challengeResponse.data.challenge?? "1");

        if (isUnlocked && claimData) {
          //get issuer claim from claim data
          const issuerClaimArr = claimData.claim.claim.map((item: any) => {
            return zidenUtils.hexToBuffer(item, 32);
          });
          try {
            const issuerClaim = new Entry(issuerClaimArr);
            const userTree = await keyContainer.getUserTree();
            let sig: SignedChallenge;
            const authClaims = keyContainer.getAuthClaims();
            const parsedValue = requirement.query.value.map((item: any) =>
              BigInt(item)
            );

            const privateKeyHex = keyContainer.getKeyDecrypted().privateKey;
            const privateKey = zidenUtils.hexToBuffer(privateKeyHex, 32);
            const signature = await auth.signChallenge(privateKey, challenge);
            sig = {
              challengeSignatureR8x: signature.challengeSignatureR8x,
              challengeSignatureR8y: signature.challengeSignatureR8y,
              challengeSignatureS: signature.challengeSignatureS,
              challenge: challenge,
            } as SignedChallenge;

            const query: Query = {
              slotIndex: slotData?.slot || 0,
              operator: requirement.query.operator,
              values: parsedValue,
              valueTreeDepth: 6,
              from: slotData?.begin || 0,
              to: slotData?.end || 1,
              timestamp: Date.now(),
              claimSchema: BigInt(String(requirement.schemaHash)),
            };
            const privateKeyBuff = zidenUtils.hexToBuffer(
              keyContainer.getKeyDecrypted().privateKey,
              32
            );
            // const witness =
            //   await queryMTP.holderGenerateQueryMTPWitnessWithSignature(
            //     issuerClaim,
            //     sig,
            //     authClaims,
            //     userTree,
            //     parseIssuerClaimMtp(requirement.issuerClaimMtp),
            //     parseNonRevMtp(requirement.nonRevMtp),
            //     query
            //   );
            const witness =
              await queryMTP.holderGenerateQueryMTPWitnessWithPrivateKey(
                issuerClaim,
                privateKeyBuff,
                authClaims,
                challenge,
                userTree,
                parseIssuerClaimMtp(requirement.issuerClaimMtp),
                parseNonRevMtp(requirement.nonRevMtp),
                query
              );

            let resultWitness = { ...witness };

            try {
              const authPatchRes = (
                await issuerServerNew.get(`/issuers/${userId}/lastest-state`)
              ).data;
              resultWitness.userClaimsRoot = BigInt(authPatchRes.claimsRoot);
              resultWitness.userClaimRevRoot = BigInt(
                authPatchRes.claimRevRoot
              );
              resultWitness.userState = BigInt(authPatchRes.expectedState);
            } catch (err) {}
            return {
              witness: resultWitness,
              valid: true,
            };
          } catch (err) {
            return {
              valid: false,
              err: err,
            };
          }
        }
      } catch (err) {}
    },
    [keyContainer, isUnlocked, userId]
  );

  /**get all user claim */
  useEffect(() => {
    updateUserData();
    const checkAllClaims = async () => {
      const allClaims = getAllUserClaim();
      if (!isUnlocked) {
        enqueueSnackbar("please unlock your wallet", {
          variant: "warning",
          preventDuplicate: true,
        });
      } else {
        const allClaimDecrypted = allClaims.map((item) => {
          const dataDecrypted = keyContainer.decryptWithDataKey(
            item.claimEncrypted
          );
          return {
            id: item.id,
            claim: JSON.parse(JSON.parse(dataDecrypted).claim),
            issuerID: JSON.parse(dataDecrypted).issuerID,
            schemaHash: JSON.parse(dataDecrypted).schemaHash,
          };
        });
        setAllclaims(allClaimDecrypted);
      }
    };
    checkAllClaims();
  }, [isUnlocked, keyContainer, enqueueSnackbar, updateUserData]);

  /**
   *for each requirement:
      filter all claim for:
        - allowed issuers
        - matching schema hashes
        - publish status (if claim is on blocked chain yet)
        - expire date (if claim has expired or not)
        - check claim attesting value based on corresponding required operator:  matching, greater than, less than, in range, etc.
      if pass, return nessesary claim data for generating proof
    return an array of requirements and corresponding valid claim data , pass that array to processedRequireData state 
   */
  useEffect(() => {
    const getUpdatedRequireData = async () => {
      if (allClaims?.length > 0 && requirements?.length > 0) {
        const updatedData = await Promise.all(
          requirements.map(async (data: any) => {
            for (var i = 0; i < allClaims.length; i++) {
              try {
                const claim = allClaims[i];
                // check allow issuer ID
                if (
                  !data.allowedIssuers
                    ?.map((issuer: any) => issuer.issuerId)
                    .includes(claim.issuerID)
                ) {
                  continue;
                }
                // check schema hash
                if (claim.schemaHash !== data.schemaHash) {
                  continue;
                }
                //check claim mtp and nonrev mtp
                let mtpInput, nonRevInput;
                let flattenedRawData = flattenData(claim?.claim?.rawData);
                try {
                  const claimMtp = await issuerServerNew.get(
                    `/claims/${claim.id}/proof?type=mtp`
                  );
                  mtpInput = claimMtp.data?.kycQueryMTPInput;
                  const claimNonRevMtp = await issuerServerNew.get(
                    `/claims/${claim.id}/proof?type=nonRevMtp`
                  );
                  nonRevInput = claimNonRevMtp.data?.kycQueryMTPInput;
                } catch (err) {
                  continue;
                }
                const dataToCheck = parseInt(flattenedRawData[data.query.propertyName]);
                // check expiration time
                const issuerClaimArr = claim.claim?.claim?.map((item: any) => {
                  return zidenUtils.hexToBuffer(item, 32);
                });
                const issuerClaim = new Entry(issuerClaimArr);
                if (
                  parseInt(issuerClaim.getExpirationDate().toString(10)) <
                  Date.now()
                ) {
                  continue;
                }

                // check operator
                switch (data.query.operator) {
                  case 0:
                    return {
                      ...data,
                      validClaim: claim,
                      filled: "checked",
                      issuerClaimMtp: mtpInput,
                      nonRevMtp: nonRevInput,
                    };
                  case 1:
                    if (dataToCheck === data.query.value[0]) {
                      return {
                        ...data,
                        validClaim: claim,
                        filled: "checked",
                        issuerClaimMtp: mtpInput,
                        nonRevMtp: nonRevInput,
                      };
                    }
                    break;
                  case 2:
                    if (dataToCheck < data.query.value[0]) {
                      return {
                        ...data,
                        validClaim: claim,
                        filled: "checked",
                        issuerClaimMtp: mtpInput,
                        nonRevMtp: nonRevInput,
                      };
                    }
                    break;
                  case 3:
                    if (dataToCheck > data.query.value[0]) {
                      return {
                        ...data,
                        validClaim: claim,
                        filled: "checked",
                        issuerClaimMtp: mtpInput,
                        nonRevMtp: nonRevInput,
                      };
                    }
                    break;
                  case 4:
                    if (data.query.value.includes(dataToCheck)) {
                      return {
                        ...data,
                        validClaim: claim,
                        filled: "checked",
                        issuerClaimMtp: mtpInput,
                        nonRevMtp: nonRevInput,
                      };
                    }
                    break;
                  case 5:
                    if (!data.query.value.includes(dataToCheck)) {
                      return {
                        ...data,
                        validClaim: claim,
                        filled: "checked",
                        issuerClaimMtp: mtpInput,
                        nonRevMtp: nonRevInput,
                      };
                    }
                    break;
                  case 6:
                    if (
                      data.query.value[0] <= dataToCheck &&
                      dataToCheck <= data.value[1]
                    ) {
                      return {
                        ...data,
                        validClaim: claim,
                        filled: "checked",
                        issuerClaimMtp: mtpInput,
                        nonRevMtp: nonRevInput,
                      };
                    }
                    break;
                  default:
                    break;
                }
              } catch (error) {
                console.log("🚀 ~ file: index.tsx:563 ~ requirements.map ~ error:", error)
                continue;
              }
            }
            return {
              ...data,
              filled: "notChecked",
            };
          })
        );
        setProcessedRequireData(updatedData);
      } else {
        const updatedData = requirements?.map((data: any) => {
          return {
            ...data,
            filled: "notChecked",
          };
        });
        setProcessedRequireData(updatedData);
      }
    };
    getUpdatedRequireData();
  }, [requirements, allClaims]);

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
                  <Box sx={infoStyle}>
                    <Typography
                      variant="body2"
                      color="secondary"
                      sx={{
                        minWidth: "150px",
                      }}
                    >
                      Requirements
                    </Typography>
                    <Box>
                      {requirements.map((item, index: number) => {
                        let issueBy = [];
                        for (let i = 0; i < item.allowedIssuers.length; i++) {
                          issueBy.push(item.allowedIssuers[i].name);
                        }
                        const OPERATOR_TYPE = ["existed", "matching", "upper bound", "greater than", "membership", "non membership", "in range"];
                        const operator = item.query.operator;
                        let value: any;
                        if (operator < 4) {
                          value = item.query.value[0];
                        } else { 
                          value = item.query.value;
                        }
                        return (
                          <Typography
                            variant="body1"
                            color="text.secondary"
                          >{`- Description: ${item.attestation}; Schema: ${item.schema.name}; Issue By: ${issueBy}; ${item.query.propertyName} is ${OPERATOR_TYPE[operator]} ${value}`}</Typography>
                        );
                      })}
                    </Box>
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
                    <>
                      <input
                        style={{
                          display: "none",
                        }}
                        type="file"
                        accept="image/png, image/gif, image/jpeg"
                        ref={inputRef}
                        onChange={(e) => {
                          // setImageFile()
                          if (e.target.files) {
                            setImageFile(e.target.files[0]);
                          }
                        }}
                      />
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => {
                          inputRef.current?.click();
                        }}
                      >
                        {imageFile ? "Image uploaded" : "Upload image"}
                      </Button>
                    </>
                  )}
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
