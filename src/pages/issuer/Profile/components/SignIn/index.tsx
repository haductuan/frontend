import {
  Autocomplete,
  Button,
  MenuItem,
  Paper,
  TextField,
  Theme,
  Typography,
} from "@mui/material";

import { Box } from "@mui/system";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { NavLink, useHistory } from "react-router-dom";
import Header from "src/components/Header";
import { useIdWalletContext } from "src/context/identity-wallet-context";
import {
  auth,
  OPERATOR,
  Query,
  queryMTP,
  claim as zidenjsClaim,
  utils as zidenUtils,
} from "@zidendev/zidenjs";
import { useSnackbar } from "notistack";
import { zidenIssuerNew, zidenPortal } from "src/client/api";
import { ArrowDownIcon } from "src/constants/icon";
import { SignedChallenge } from "@zidendev/zidenjs";
import { userType } from "src/constants";
import { LoadingButton } from "@mui/lab";
import {
  generateProof,
  parseIssuerClaimMtp,
  parseNonRevMtp,
} from "src/utils/claim";

//style
const selectorStyle = (theme: Theme) => ({
  my: 2,
  "& .MuiSelect-icon": {
    transform: "scale(0.5)",
    my: "4px",
  },
  "& .MuiSelect-iconOpen": {
    transform: "rotate(180deg) scale(0.5)",
  },
});

const SignIn = () => {
  const { isUnlocked, setOpen, getZidenUserID, keyContainer } =
    useIdWalletContext();
  const { enqueueSnackbar } = useSnackbar();
  const [issuer, serIssuer] = useState<any>({});
  const [issuers, setIssuers] = useState<Array<any>>([]);
  const [role, setRole] = useState<any>(1);
  const [isLoading, setIsLoading] = useState(false);
  const history = useHistory();
  const handleSignIn = async () => {
    if (!issuer?.id) {
      enqueueSnackbar("Please select issuer", {
        autoHideDuration: 1500,
        variant: "warning",
      });
      return;
    }
    setIsLoading(true);
    try {
      const userID = await getZidenUserID();
      const res = await zidenIssuerNew.get(
        `/issuers/${issuer.id}/operators/${userID}`
      );
      const claimID = res.data?.claimId || "";
      const issuerRevNonce = res.data?.revNonce || 9;
      const issuerVersion = res.data?.version || 0;
      const schemaHash = zidenjsClaim.schemaHashFromBigInt(
        BigInt(String(res.data.schemaHash))
      );
      const valueA = zidenUtils.numToBits(BigInt(role), 32);
      const valueB = zidenUtils.numToBits(BigInt(0), 32);
      const userTree = await keyContainer.getUserTree();
      const issuerClaim = zidenjsClaim.newClaim(
        schemaHash,
        zidenjsClaim.withRevocationNonce(BigInt(issuerRevNonce.toString())),
        zidenjsClaim.withValueData(valueA, valueB),
        zidenjsClaim.withIndexID(userTree.userID),
        zidenjsClaim.withVersion(BigInt(issuerVersion.toString())),
        zidenjsClaim.withIndexData(
          zidenUtils.hexToBuffer(userID, 32),
          zidenUtils.hexToBuffer(issuer.id, 32)
        )
      );
      const authClaim = keyContainer.getAuthClaims();
      if (role === 1) {
        try {
          await userTree.insertClaim(issuerClaim, 0);
        } catch (err) {}
      }
      issuerClaim.setRevocationNonce(BigInt(issuerRevNonce.toString()));
      issuerClaim.setVersion(BigInt(issuerVersion.toString()));
      const kYCQueryMtp = await (
        await zidenIssuerNew.get(`/auth/proof/${claimID}?type=mtp`)
      ).data?.kycQueryMTPInput;
      const kYCnonRevMtp = await (
        await zidenIssuerNew.get(`/auth/proof/${claimID}?type=nonRevMtp`)
      ).data?.kycQueryMTPInput;
      // sign message
      const challenge = "123456789";
      let sig: any;
      //@ts-ignore
      const privateKeyHex = keyContainer.getKeyDecrypted().privateKey;
      const privateKey = zidenUtils.hexToBuffer(privateKeyHex, 32);
      const challengeBigint = BigInt(challenge);
      const signature = await auth.signChallenge(privateKey, challengeBigint);
      sig = {
        challenge: challengeBigint,
        challengeSignatureR8x: signature.challengeSignatureR8x,
        challengeSignatureR8y: signature.challengeSignatureR8y,
        challengeSignatureS: signature.challengeSignatureS,
      } as SignedChallenge;
      
      const query: Query = {
        slotIndex: 6,
        operator: OPERATOR.EQUAL,
        values: [BigInt(role)],
        valueTreeDepth: 6,
        from: 0,
        to: 100,
        timestamp: Date.now(),
        claimSchema: BigInt(String(res.data.schemaHash)),
      };
      const input = await queryMTP.holderGenerateQueryMTPWitnessWithSignature(
        issuerClaim,
        sig,
        authClaim,
        userTree,
        parseIssuerClaimMtp(kYCQueryMtp),
        parseNonRevMtp(kYCnonRevMtp),
        query
      );

      const loginProof = await generateProof(input);
      const jwz = (
        await axios.post(issuer.endpoint + `/auth/login/${issuer?.id}`, {
          proof: loginProof?.proof,
          public_signals: loginProof?.publicSignals,
          circuitId: "string",
          schema: "string",
          algorithm: "string",
          payload: "string",
        })
      ).data?.token;
      if (jwz) {
        keyContainer.db.insert("issuer-jwz", jwz);
        keyContainer.db.insert("issuer-id", issuer.id);
        setIsLoading(false);
        history.push("/issuer/detail");
      } else {
        setIsLoading(false);
        throw Error("Login failed");
      }
      setIsLoading(false);
    } catch (err) {
      enqueueSnackbar("Login failed!", {
        variant: "error",
        autoHideDuration: 2000,
      });
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if (
      isUnlocked &&
      localStorage.getItem("ziden-db/issuer-jwz") &&
      localStorage.getItem("ziden-db/issuer-id")
    ) {
      setOpen(false);
      history.push("/issuer/detail");
    } else {
      const fetchIssuer = async () => {
        const issuerData = await zidenPortal.get("/issuers");
        if (issuerData.data?.issuers?.length > 0) {
          setIssuers(
            issuerData.data?.issuers.map((item: any) => {
              return {
                label: item.name || "",
                value: { id: item.issuerId || "", endpoint: item.endpointUrl },
              };
            })
          );
        }
      };
      fetchIssuer();
    }
  }, [isUnlocked, history, setOpen]);

  return (
    <Box>
      <Header
        title1="Become an Identity Provider"
        description={[
          "Any individual or organization can become an Issuer to provide identity sources for the platform. With the Issuer Portal, users can easily issue, update, or revoke any digital documents or credentials on blockchain networks. They can also create custom document standards based on specific requirements.",
        ]}
      >
        <Box sx={{ display: "flex" }}>
          <NavLink
            to="/issuer/profile/register"
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
              Register
            </Button>
          </NavLink>
        </Box>
      </Header>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "center",
          justifyContent: "center",
          pt: 3,
          px: 4,
        }}
      >
        <Paper
          sx={{
            p: 3,
            maxWidth: "488px",
            width: "100%",
            boxShadow: "0px 2px 8px #0000001F",
            borderRadius: 3,
            minHeight: "250px",
          }}
        >
          <Typography variant="h3" mb={2}>
            Sign in
          </Typography>
          {!isUnlocked && (
            <Typography variant="body2" color={"text.secondary"}>
              Please connect your{" "}
              <span
                onClick={() => {
                  setOpen(true);
                }}
                style={{
                  color: "#114898",
                  cursor: "pointer",
                  fontWeight: 500,
                }}
              >
                identity wallet
              </span>{" "}
              to become a provider
            </Typography>
          )}
          {isUnlocked && (
            <>
              <Autocomplete
                fullWidth
                options={issuers}
                sx={selectorStyle}
                onChange={(e, newValue) => {
                  serIssuer(newValue?.value);
                }}
                isOptionEqualToValue={(option, value) => {
                  return option.value.id === value.value.id;
                }}
                popupIcon={<ArrowDownIcon transform="scale(0.5)" />}
                filterOptions={(options, state) => {
                  return options.filter((option) => {
                    return (
                      option.label
                        ?.toLowerCase()
                        ?.includes(state.inputValue?.toLowerCase()) ||
                      option?.value?.id
                        ?.toLowerCase()
                        ?.includes(state.inputValue?.toLowerCase())
                    );
                  });
                }}
                renderInput={(params) => {
                  return <TextField {...params} label="Issuer" />;
                }}
                renderOption={(props, option, state) => {
                  return (
                    <li {...props}>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
                        <Typography variant="body1">{option.label}</Typography>
                        <Typography
                          variant="body2"
                          color="secondary"
                          sx={{
                            wordWrap: "break-word",
                            maxWidth: "400px",
                          }}
                        >
                          {option.value?.id}
                        </Typography>
                      </Box>
                    </li>
                  );
                }}
              ></Autocomplete>
              <TextField
                select
                fullWidth
                label="Role"
                sx={selectorStyle}
                SelectProps={{
                  IconComponent: ArrowDownIcon,
                }}
                value={role}
                onChange={(e) => {
                  setRole(e.target.value);
                }}
              >
                <MenuItem value={1}>Admin</MenuItem>
                <MenuItem value={2}>Operator</MenuItem>
              </TextField>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row-reverse",
                  mt: 4,
                }}
              >
                <LoadingButton
                  loading={isLoading}
                  variant="contained"
                  color="primary"
                  onClick={handleSignIn}
                >
                  Sign in
                </LoadingButton>
              </Box>
            </>
          )}
        </Paper>
      </Box>
    </Box>
  );
};
export default SignIn;
