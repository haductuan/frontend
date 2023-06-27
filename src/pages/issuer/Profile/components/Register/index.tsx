import React, { useEffect, useRef, useState } from "react";
import { Box, Button, Grid, Paper, TextField, Typography } from "@mui/material";
import Header from "src/components/Header";
import { UploadIcon } from "src/constants/icon";
import { NavLink, useHistory } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import { useIdWalletContext } from "src/context/identity-wallet-context";
import { useSnackbar } from "notistack";
import { validateJWZ } from "src/utils/auth";
import { utils as zidenjsUtils } from "@zidendev/zidenjs";
import axios from "axios";
import { LoadingButton } from "@mui/lab";
import { zidenPortal } from "src/client/api";
import { userType } from "src/constants";
//shared Style
const rowStyle = (theme: any) => {
  return {
    height: "100px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  };
};

const Register = () => {
  const history = useHistory();
  const logoInput = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [logo, setLogo] = useState<any>();
  const [issuerName, setIssuerName] = useState<string>("");
  const [issuerNameHt, setIssuerNameHt] = useState<string>(" ");
  // const [endpointUrl, setEndpointUrl] = useState<string>("");
  const endpointUrl = process.env.REACT_APP_ISSUER_SERVICE;
  // const [email, setEmail] = useState<string>("");
  // const [emailHt, setEmailHt] = useState<string>(" ");
  const [website, setWebsite] = useState<string>("");
  const [websiteHt, setWebsiteHt] = useState<string>(" ");
  const [description, setDescription] = useState<string>("");
  const [descriptionHt, setDescriptionHt] = useState<string>(" ");
  const [contact, setContact] = useState<string>("");
  const [contactHt, setContactHt] = useState<string>(" ");
  const [logoPreview, setLogoPreview] = useState<any>();
  const { isUnlocked, getZidenUserID, keyContainer, checkUserType } =
    useIdWalletContext();
  const { enqueueSnackbar } = useSnackbar();

  const handlePostIssuerInformation = async () => {
    const issuerId = await getZidenUserID();
    let data = new FormData();
    data.append("issuerId", issuerId);
    data.append("name", issuerName);
    data.append("description", description);
    data.append("issuerLogo", logo);
    data.append("contact", contact);
    data.append("website", website);
    data.append(
      "endpointUrl",
      endpointUrl ? endpointUrl : "https://issuer-staging.ziden.io/api/v1"
    );
    await zidenPortal.post("/issuers/registration", data);
  };
  const handleRegister = async () => {
    if (isUnlocked) {
      let isComplete = true;
      setIssuerNameHt(" ");
      setWebsiteHt(" ");
      setContactHt(" ");
      setDescriptionHt(" ");
      if (!issuerName.trim()) {
        setIssuerNameHt("Issuer name is missing");
        isComplete = false;
      }
      if (!website.trim()) {
        setWebsiteHt("Website is missing");
        isComplete = false;
      }
      if (!contact.trim()) {
        setContactHt("Contact is missing");
        isComplete = false;
      }
      if (!description.trim()) {
        setDescriptionHt("Description is missing");
        isComplete = false;
      }
      if (!isComplete) {
        return;
      }
      if (!logo) {
        enqueueSnackbar("Please upload your logo", {
          variant: "warning",
        });
        return;
      }
      setLoading(true);
      try {
        //@ts-ignore
        if (checkUserType() !== userType.oraiWeb) {
          const privateKey = keyContainer.getKeyDecrypted().privateKey;
          const privateKeyBuff = zidenjsUtils.hexToBuffer(privateKey, 32);
          const pubkeyX = window.zidenParams.F.toObject(
            window.zidenParams.eddsa.prv2pub(privateKeyBuff)[0]
          );
          const pubkeyY = window.zidenParams.F.toObject(
            window.zidenParams.eddsa.prv2pub(privateKeyBuff)[1]
          );
          const res = await axios.post(
            `${
              endpointUrl
                ? endpointUrl
                : "https://issuer-staging.ziden.io/api/v1"
            }/issuers/register`,
            {
              // userId: userID,
              pubkeyX: pubkeyX.toString(10),
              pubkeyY: pubkeyY.toString(10),
            }
          );
          if (res.data) {
            await handlePostIssuerInformation();
            enqueueSnackbar("Register success!", {
              variant: "success",
            });
            history.push("/issuer/profile");
          } else {
            enqueueSnackbar("Register failed!", {
              autoHideDuration: 1000,
              variant: "error",
            });
          }
        } else {
          //@ts-ignore
          const result = await window.ethereum.request({
            method: "eth_signWithEddsaPrivKey",
            params: ["123456789"],
          });
          const publicKey = JSON.parse(result.result).pub_key.map(
            (partOfKey: any) => {
              return window.zidenParams.F.toObject(
                Uint8Array.from(Buffer.from(partOfKey, "hex"))
              );
            }
          );
          const res = await axios.post(
            `${
              endpointUrl
                ? endpointUrl
                : "https://issuer-staging.ziden.io/api/v1"
            }/issuers/register`,
            {
              // userId: userID,
              pubkeyX: publicKey[0].toString(10),
              pubkeyY: publicKey[1].toString(10),
            }
          );
          if (res.data) {
            await handlePostIssuerInformation();
            enqueueSnackbar("Register success!", {
              autoHideDuration: 1000,
              variant: "success",
            });
            history.push("/issuer/profile");
          } else {
            enqueueSnackbar("Register failed!", {
              autoHideDuration: 1000,
              variant: "error",
            });
          }
        }
        setLoading(false);
      } catch (err) {
        enqueueSnackbar("Register failed!", {
          autoHideDuration: 1000,
          variant: "error",
        });
        setLoading(false);
      }
    } else {
      enqueueSnackbar("Please unlock your wallet", {
        variant: "info",
      });
    }
  };

  const handleChangeLogoImage = (e: any) => {
    setLogo(e.target.files[0]);
  };
  useEffect(() => {
    if (!logo) {
      setLogoPreview(undefined);
      return;
    }
    const objectUrl = URL.createObjectURL(logo);
    setLogoPreview(objectUrl);
    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl);
  }, [logo]);
  useEffect(() => {
    if (isUnlocked && localStorage.getItem("ziden-db/issuer-jwz")) {
      if (endpointUrl) {
        const validate = async () => {
          const validateResult = await validateJWZ(endpointUrl, "issuer");
          if (validateResult) {
            history.push("/issuer/profile/detail");
          }
        };
        validate();
      }
    }
  }, [isUnlocked, history, endpointUrl]);
  return (
    <Box>
      <Header
        title1="Integrate your Services"
        description={[
          "Any individual or organization can become an Issuer to provide identity sources for the platform. With the Issuer Portal, users can easily issue, update, or revoke any digital documents or credentials on blockchain networks. They can also create custom document standards based on specific requirements.",
        ]}
      >
        <Box sx={{ display: "flex" }}>
          {/* <Button variant="outlined" color="secondary">
            Sign in
          </Button> */}
          <NavLink
            to="/issuer/profile/signin"
            style={{
              textDecoration: "none",
            }}
          >
            <Button
              variant="contained"
              color="secondary"
              sx={{
                ml: 1,
              }}
            >
              Sign in
            </Button>
          </NavLink>
        </Box>
      </Header>
      <Box
        sx={{
          px: {
            xs: 1,
            sm: 1,
            lg: 6,
          },
          pt: 3,
        }}
      >
        <input
          accept=".png,.jpeg,.jpg"
          ref={logoInput}
          id="front-side-input"
          type="file"
          style={{
            display: "none",
          }}
          onChange={handleChangeLogoImage}
        />
        <Paper
          sx={{
            p: 4,
            borderRadius: 3,
          }}
        >
          <Typography variant="h3">Register</Typography>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              py: 2,
              "& .MuiFormHelperText-root": {
                color: "#D60000",
              },
            }}
          >
            <Grid container spacing={4}>
              <Grid item xs={12} lg={6}>
                <Box sx={rowStyle}>
                  <TextField
                    fullWidth
                    label="Issuer name"
                    required
                    value={issuerName}
                    onChange={(e) => {
                      setIssuerName(e.target.value);
                    }}
                    helperText={issuerNameHt}
                  />
                </Box>
                <Box sx={rowStyle}>
                  <TextField
                    fullWidth
                    label="Website"
                    required
                    value={website}
                    onChange={(e) => {
                      setWebsite(e.target.value);
                    }}
                    helperText={websiteHt}
                  />
                </Box>
                <Box sx={rowStyle}>
                  <TextField
                    fullWidth
                    label="Contact"
                    required
                    value={contact}
                    onChange={(e) => {
                      setContact(e.target.value);
                    }}
                    helperText={contactHt}
                  />
                </Box>
              </Grid>
              <Grid item xs={12} lg={6}>
                <Box sx={rowStyle}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: {
                        xs: "column",
                        sm: "row",
                      },
                      alignItems: {
                        xs: "flex-start",
                        sm: "center",
                      },
                      pb: 3,
                    }}
                  >
                    <Typography variant="body1" color="secondary" mr={3} my={1}>
                      Your Logo
                    </Typography>
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => {
                        if (logoInput?.current) {
                          logoInput.current.click();
                        }
                      }}
                      sx={{
                        height: "40px",
                      }}
                    >
                      Upload{" "}
                      <UploadIcon
                        sx={{
                          ml: 2,
                          fontSize: "1rem",
                        }}
                      />
                    </Button>
                  </Box>
                  <Box
                    sx={{
                      backgroundColor: "#EDF3FA",
                      border: "1px solid #8FA7C9",
                      width: "110px",
                      height: "110px",
                      borderRadius: "50%",
                    }}
                  >
                    <Avatar
                      src={logoPreview}
                      sx={{
                        width: "100%",
                        height: "100%",
                      }}
                    />
                  </Box>
                </Box>
                <Box
                  sx={{
                    height: "200px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    pt: 1.5,
                    pb: 1.25,
                  }}
                >
                  <TextField
                    fullWidth
                    sx={{
                      height: "100%",
                      "& .MuiInputBase-root": {
                        height: "100%",
                      },
                    }}
                    InputLabelProps={{ shrink: true }}
                    label="Description"
                    required
                    multiline
                    rows={5}
                    value={description}
                    onChange={(e) => {
                      setDescription(e.target.value);
                    }}
                    helperText={descriptionHt}
                  />
                </Box>
              </Grid>
            </Grid>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <LoadingButton
              loading={loading}
              variant="contained"
              color="primary"
              onClick={handleRegister}
            >
              Register
            </LoadingButton>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};
export default Register;
