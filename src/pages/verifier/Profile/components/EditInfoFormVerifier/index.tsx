import { LoadingButton } from "@mui/lab";
import {
  Avatar,
  Box,
  Button,
  Grid,
  TextField,
  Typography,
} from "@mui/material";

import React, { useState, useRef } from "react";
import { zidenPortal } from "src/client/api";
import { EditIcon, UploadIcon } from "src/constants/icon";
import { useIdWalletContext } from "src/context/identity-wallet-context";
import { useVerifierContext } from "src/context/verifierContext";
enum Editable {
  Name = "name",
  Contact = "contact",
  Website = "website",
  None = "none",
}

const EditInfoFormVerifier = ({ handleClose }: { handleClose: () => void }) => {
  const { profile, fetchVerifierProfile, verifierId } = useVerifierContext();
  const { keyContainer } = useIdWalletContext();
  const [editable, setEditable] = useState<Editable>(Editable.None);
  const logoInput = useRef<HTMLInputElement>(null);
  const [logoPreview, setLogoPreview] = useState<any>(profile?.logo || "");
  const [loading, setLoading] = useState<boolean>(false);
  //init info for edit
  const [name, setName] = useState<string>(profile?.name || "None");
  const [editContact, setContact] = useState<string>(
    profile?.contact || "None"
  );
  const [website, setWebsite] = useState(profile?.website || "");
  const [description, setDescription] = useState<string>(
    profile?.description || ""
  );
  const [logo, setLogo] = useState<any>();

  const handleEdit = (type: Editable) => {
    setEditable(type);
  };
  const disableEdit = () => {
    handleEdit(Editable.None);
  };
  const rowStyle = (theme: any) => {
    return {
      display: "flex",
      flexDirection: "row",
      alignItems: "flex-start",
      justifyContent: "space-between",
      my: 0.5,
    };
  };
  const infoStyle = (theme: any) => {
    return {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
    };
  };
  const handleChangeLogoImage = (e: any) => {
    setLogo(e.target.files[0]);
  };

  const handleConfirm = async () => {
    const jwz = keyContainer.db.get("verifier-jwz");
    setLoading(true);
    try {
      let bodyData = new FormData();
      bodyData.append("name", name);
      bodyData.append("description", description);
      bodyData.append("contact", editContact);
      bodyData.append("website", website);
      if (logo) {
        bodyData.append("verifierLogo", logo);
      }
      await zidenPortal.put(`/verifiers/${verifierId}/profiles`, bodyData, {
        headers: {
          Authorization: `${jwz}`,
        },
      });
      await fetchVerifierProfile();
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
    handleClose();
  };

  React.useEffect(() => {
    if (!logo) {
      // setLogoPreview(undefined);
      return;
    }
    const objectUrl = URL.createObjectURL(logo);
    setLogoPreview(objectUrl);
    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl);
  }, [logo]);

  return (
    <Box
      sx={{
        py: 3,
        px: {
          xs: 3,
          md: 5,
        },
      }}
    >
      <Typography
        onClick={() => {
          handleEdit(Editable.None);
        }}
        variant="h3"
        pb={3}
      >
        Edit information
      </Typography>
      <Grid
        container
        spacing={5}
        sx={{
          "& .MuiInputBase-root": {
            color: "#000D1C",
          },
        }}
      >
        <Grid item xs={12} md={6}>
          <Grid container sx={rowStyle}>
            <Grid item xs={5}>
              <Typography variant="body1" color="secondary" fontWeight={400}>
                Name
              </Typography>
            </Grid>
            <Grid item xs={7}>
              <Box sx={infoStyle}>
                {editable === Editable.Name && (
                  <TextField
                    fullWidth
                    onChange={(e) => {
                      setName(e.target.value);
                    }}
                    variant="standard"
                    autoFocus
                    value={name}
                  />
                )}
                {editable !== Editable.Name && (
                  <Typography
                    sx={{
                      width: "100%",
                    }}
                    noWrap
                    variant="body1"
                    fontWeight={500}
                    color={"text.secondary"}
                  >
                    {name}
                  </Typography>
                )}
                <Button
                  onClick={(e) => {
                    handleEdit(Editable.Name);
                    e.stopPropagation();
                  }}
                  sx={{
                    minWidth: "0px",
                    minHeight: "0px",
                    backgroundColor: "transparent",
                  }}
                >
                  <EditIcon />
                </Button>
              </Box>
            </Grid>
          </Grid>
          <Grid container sx={rowStyle}>
            <Grid item xs={5}>
              <Typography variant="body1" color="secondary" fontWeight={400}>
                Contact
              </Typography>
            </Grid>
            <Grid item xs={7}>
              <Box sx={infoStyle}>
                {editable === Editable.Contact && (
                  <TextField
                    fullWidth
                    onChange={(e) => {
                      setContact(e.target.value);
                    }}
                    variant="standard"
                    autoFocus
                    value={editContact}
                  />
                )}
                {editable !== Editable.Contact && (
                  <Typography
                    sx={{
                      width: "100%",
                    }}
                    noWrap
                    color={"text.secondary"}
                    variant="body1"
                    fontWeight={500}
                  >
                    {editContact}
                  </Typography>
                )}
                <Button
                  disableRipple
                  onClick={(e) => {
                    handleEdit(Editable.Contact);
                    e.stopPropagation();
                  }}
                  sx={{
                    minWidth: "0px",
                    minHeight: "0px",
                    backgroundColor: "transparent",
                  }}
                >
                  <EditIcon />
                </Button>
              </Box>
            </Grid>
          </Grid>
          <Grid container sx={rowStyle}>
            <Grid item xs={5}>
              <Typography variant="body1" color="secondary" fontWeight={400}>
                Website
              </Typography>
            </Grid>
            <Grid item xs={7}>
              <Box sx={infoStyle}>
                {editable === Editable.Website && (
                  <TextField
                    fullWidth
                    onChange={(e) => {
                      setWebsite(e.target.value);
                    }}
                    variant="standard"
                    autoFocus
                    value={website}
                  />
                )}
                {editable !== Editable.Website && (
                  <Typography
                    sx={{
                      width: "100%",
                    }}
                    noWrap
                    color={"text.secondary"}
                    variant="body1"
                    fontWeight={500}
                  >
                    {website}
                  </Typography>
                )}
                <Button
                  disableRipple
                  onClick={(e) => {
                    handleEdit(Editable.Website);
                    e.stopPropagation();
                  }}
                  sx={{
                    minWidth: "0px",
                    minHeight: "0px",
                    backgroundColor: "transparent",
                  }}
                >
                  <EditIcon />
                </Button>
              </Box>
            </Grid>
          </Grid>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              pt: 3.5,
            }}
            onClick={disableEdit}
          >
            <Box>
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
              <Button
                variant="outlined"
                color="primary"
                disableRipple
                onClick={() => {
                  if (logoInput?.current) {
                    logoInput.current.click();
                  }
                }}
                sx={{
                  height: "40px",
                }}
              >
                Upload logo{" "}
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
                width: "83px",
                height: "83px",
                borderRadius: "50%",
              }}
            >
              <Avatar
                src={logoPreview}
                variant="circular"
                sx={{
                  width: "100%",
                  height: "100%",
                  backgroundColor: "#EDF3FA",
                  "& .MuiSvgIcon-root": {
                    display: "none",
                  },
                }}
              />
            </Box>
          </Box>
        </Grid>
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            px: 1,
          }}
          onClick={disableEdit}
        >
          <TextField
            multiline
            label="Description"
            fullWidth
            rows={8}
            sx={{ mt: 1 }}
            onChange={(e) => {
              setDescription(e.target.value);
            }}
            value={description}
          />
        </Grid>
      </Grid>
      <Box
        sx={{
          pt: 4,
          display: "flex",
          justifyContent: "flex-end",
          pb: 1,
        }}
        onClick={disableEdit}
      >
        <Button
          disableRipple
          variant="outlined"
          sx={{
            mr: 1,
          }}
          onClick={handleClose}
        >
          Cancel
        </Button>
        <LoadingButton
          loading={loading}
          disableRipple
          variant="contained"
          onClick={handleConfirm}
        >
          Done
        </LoadingButton>
      </Box>
    </Box>
  );
};

export default EditInfoFormVerifier;
