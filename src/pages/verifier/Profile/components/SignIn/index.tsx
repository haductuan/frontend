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
  SignedChallenge,
  claim as zidenjsClaim,
  utils as zidenUtils,
} from "@zidendev/zidenjs";
// import {
//   holderGenerateQueryMTPWitness,
//   holderGenerateQueryMTPWitnessWithSignature,
// } from "@zidendev/zidenjs/build/witnesses/queryMTP";
import { useSnackbar } from "notistack";
import {
  generateProof,
  parseIssuerClaimMtp,
  parseNonRevMtp,
} from "src/utils/claim";
import { backendServer } from "src/client/api";
import { ArrowDownIcon } from "src/constants/icon";
import { LoadingButton } from "@mui/lab";
import { userType } from "src/constants";
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
  const [verifierID, setVerifierID] = useState("");
  const [verifiers, setVerifier] = useState<Array<any>>([]);
  const [role, setRole] = useState<any>(1);
  const [isLoading, setIsLoading] = useState(false);
  const history = useHistory();
  const handleSignIn = async () => {
    if (!verifierID) {
      enqueueSnackbar("Please select issuer!", {
        variant: "info",
        autoHideDuration: 2000,
      });
      return;
    }
    setIsLoading(true);
    try {
      const userID = await getZidenUserID();
      const res = (
        await backendServer.get(`verifiers/${verifierID}/operators/${userID}`)
      ).data;
      console.log("🚀 ~ file: index.tsx:74 ~ handleSignIn ~ res:", res);
      const verifierClaimID = res?.claimId;
      if (verifierClaimID) {
        const schemaHash = zidenjsClaim.schemaHashFromBigInt(
          BigInt(String(res.schemaHash))
        );
        const verifierRevNonce = res?.revNonce || 1;
        const verifierVersion = res?.version || 0;
        const valueA = zidenUtils.numToBits(BigInt(role), 32);
        const valueB = zidenUtils.numToBits(BigInt(0), 32);
        const userTree = await keyContainer.getUserTree();
        const verifierClaim = zidenjsClaim.newClaim(
          schemaHash,
          zidenjsClaim.withRevocationNonce(BigInt(verifierRevNonce.toString())),
          zidenjsClaim.withValueData(valueA, valueB),
          zidenjsClaim.withIndexID(userTree.userID),
          zidenjsClaim.withVersion(BigInt(verifierVersion.toString())),
          zidenjsClaim.withIndexData(
            zidenUtils.hexToBuffer(userID, 32),
            zidenUtils.hexToBuffer(verifierID, 32)
          )
        );
        const authClaim = keyContainer.getAuthClaims();
        if (role === 1) {
          try {
            await userTree.insertClaim(verifierClaim, 0);
          } catch (err) {}
        }
        verifierClaim.setRevocationNonce(BigInt(verifierRevNonce.toString()));
        verifierClaim.setVersion(BigInt(verifierVersion.toString()));
        const kYCQueryMTP = (
          await backendServer.get(`/auth/proof/${verifierClaimID}?type=mtp`)
        ).data?.kycQueryMTPInput;
        const kYCnonRevMtp = (
          await backendServer.get(`/auth/proof/${verifierClaimID}?type=nonRevMtp`)
        ).data?.kycQueryMTPInput;
        // sign message
        const challenge = "123456789";
        let sig: any;
        //@ts-ignore
        const privateKeyHex = keyContainer.getKeyDecrypted().privateKey;
        const privateKey = zidenUtils.hexToBuffer(privateKeyHex, 32);
        const challengeBigint = BigInt(challenge);
        const signature = await auth.signChallenge(
          privateKey,
          challengeBigint
        );
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
          claimSchema: BigInt(String(res.schemaHash)),
        };
        const input = await queryMTP.holderGenerateQueryMTPWitnessWithSignature(
          verifierClaim,
          sig,
          authClaim,
          userTree,
          parseIssuerClaimMtp(kYCQueryMTP),
          parseNonRevMtp(kYCnonRevMtp),
          query
        );
        const data = await generateProof(input);
        const jwz = await backendServer.post(`/auth/login/${verifierID}`, {
          proof: data?.proof,
          public_signals: data?.publicSignals,
          circuitId: "string",
          schema: "string",
          algorithm: "string",
          payload: "string",
        });
        if (jwz?.data?.token) {
          keyContainer.db.insert("verifier-jwz", jwz?.data?.token);
          keyContainer.db.insert("verifier-id", verifierID);
          setIsLoading(false);
          history.push("/verifier/detail");
        } else {
          console.log("error");
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
        throw Error("Login failed");
      }
    } catch (err) {
      console.log("🚀 ~ file: index.tsx:195 ~ handleSignIn ~ err:", err);
      enqueueSnackbar(`Login failed!`, {
        variant: "error",
        autoHideDuration: 2000,
      });
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if (
      isUnlocked &&
      localStorage.getItem("ziden-db/verifier-jwz") &&
      localStorage.getItem("ziden-db/verifier-id")
    ) {
      setOpen(false);
      history.push("/verifier/detail");
    } else {
      const fetchVerifier = async () => {
        const userID = await getZidenUserID();        
        const verifierData = (await backendServer.get(`/verifiers?operatorId=${userID}`)).data;
        setVerifier(
          verifierData?.verifiers?.map((verifier: any, inex: number) => {
            return {
              label: verifier.name || "",
              id: verifier["_id"],
            };
          })
        );
      };
      fetchVerifier();
    }
  }, [isUnlocked, history, setOpen]);
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
            to="/verifier/profile/register"
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
            minHeight: "362px",
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
              to integrate your services
            </Typography>
          )}
          {isUnlocked && (
            <>
              <Autocomplete
                fullWidth
                options={verifiers}
                getOptionLabel={(option) => option.label}
                onChange={(e, newValue) => {
                  setVerifierID(newValue.id);
                }}
                sx={selectorStyle}
                popupIcon={<ArrowDownIcon transform="scale(0.5)" />}
                filterOptions={(options, state) => {
                  return options.filter((option) => {
                    return (
                      option.label
                        ?.toLowerCase()
                        ?.includes(state.inputValue?.toLowerCase()) ||
                      option?.id
                        ?.toLowerCase()
                        ?.includes(state.inputValue?.toLowerCase())
                    );
                  });
                }}
                renderInput={(params) => {
                  return <TextField {...params} label="Verifier" />;
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
                          {option.id}
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
                {/* <MenuItem value={2}>Operator</MenuItem> */}
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
