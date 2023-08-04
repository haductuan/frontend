import React, { useEffect, useRef, useState } from "react";
import { Box, Button, Grid, Paper, TextField, Typography } from "@mui/material";
import Header from "src/components/Header";
import { UploadIcon } from "src/constants/icon";
import { NavLink, useHistory } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import { useIdWalletContext } from "src/context/identity-wallet-context";
import { useSnackbar } from "notistack";
import { validateJWZ } from "src/utils/auth";
import { LoadingButton } from "@mui/lab";
import { backendServer } from "src/client/api";
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
  const [verifierName, setverifierName] = useState<string>("");
  const [verifierNameHt, setverifierNameHt] = useState<string>(" ");
  const [website, setWebsite] = useState<string>("");
  const [websiteHt, setWebsiteHt] = useState<string>(" ");
  const [description, setDescription] = useState<string>("");
  const [descriptionHt, setDescriptionHt] = useState<string>(" ");
  const [contact, setContact] = useState<string>("");
  const [contactHt, setContactHt] = useState<string>(" ");
  const [logoPreview, setLogoPreview] = useState<any>();
  const { isUnlocked, getZidenUserID } = useIdWalletContext();
  const { enqueueSnackbar } = useSnackbar();

  const handlePostVerifierInfo = async () => {
    try {
      const verifierId = await getZidenUserID();
      let data = new FormData();
      data.append("verifierId", verifierId);
      data.append("name", verifierName);
      data.append("description", description);
      data.append("verifierLogo", logo);
      data.append("contact", contact);
      data.append("website", website);
      await backendServer.post("/verifiers/registration", data);
    } catch (err) {
      throw Error("Register failed");
    }
  };
  const handleRegister = async () => {
    if (isUnlocked) {
      let isComplete = true;
      setverifierNameHt(" ");
      setWebsiteHt(" ");
      setContactHt(" ");
      setDescriptionHt(" ");
      if (!verifierName.trim()) {
        setverifierNameHt("Verifier name is missing");
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
          autoHideDuration: 1500,
          variant: "warning",
        });
        return;
      }
      setLoading(true);
      try {
        await handlePostVerifierInfo();
        enqueueSnackbar("Register success!", {
          autoHideDuration: 1000,
          variant: "success",
        });
        history.push("/verifier/profile");
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
    if (
      isUnlocked &&
      localStorage.getItem("ziden-db/verifier-jwz") &&
      localStorage.getItem("ziden-db/verifier-id")
    ) {
      const validate = async () => {
        const validateResult = await validateJWZ(
          backendServer.getUri(),
          "verifier"
        );
        if (validateResult) {
          history.push("/verifier/profile/detail");
        }
      };
      validate();
    }
  }, [isUnlocked, history]);
  return (
    <Box>
      <Header
        title1="Integrate your Services"
        description={[
          "Verifiers can provide attestation services through the platform. With the Verifier Portal, you can register services with any requirements that others need to fulfill to access. The verification process is secure by smart contracts and users' privacy is protected with zero-knowledge proof techniques.",
        ]}
      >
        <Box sx={{ display: "flex" }}>
          <NavLink
            to="/verifier/profile/signin"
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
                    label="Verifier name"
                    required
                    value={verifierName}
                    onChange={(e) => {
                      setverifierName(e.target.value);
                    }}
                    helperText={verifierNameHt}
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
