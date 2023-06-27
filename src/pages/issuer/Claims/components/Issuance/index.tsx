import { Button, Grid, Paper, CircularProgress } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import React, { useState, useEffect } from "react";
import TableData from "src/components/TableData";
import { useIssuerContext } from "src/context/issuerContext";
import { auth, utils as zidenUtils } from "@zidendev/zidenjs";
import SearchBar from "src/components/SearchBar";
import { useIdWalletContext } from "src/context/identity-wallet-context";
import { useSnackbar } from "notistack";
import { LoadingButton } from "@mui/lab";
import { userType } from "src/constants";

const headers = [
  { id: "claim_id", label: "Claim ID" },
  { id: "schema_hash", label: "Schema hash" },
  { id: "create_date", label: "Create date" },
  { id: "holder_id", label: "Holder ID" },
  { id: "status", label: "Status" },
];

const Issuance = (props: any) => {
  //const
  const jwz = localStorage.getItem("ziden-db/issuer-jwz");
  //context
  const { endpointUrl, issuerID } = useIssuerContext();
  const { isUnlocked, checkUserType, keyContainer, userId } =
    useIdWalletContext();
  const { enqueueSnackbar } = useSnackbar();
  //state
  const [allTableData, setAllTableData] = useState<Array<any>>([]);
  const [tableData, setTableData] = useState<Array<any>>([]);
  const [loading, setLoading] = useState(false);
  const [signing, setSigning] = useState(false);
  // function
  const fetchData = React.useCallback(async () => {
    if (issuerID) {
      setLoading(true);
      try {
        const result = await axios.get(`${endpointUrl}/claims`, {
          params: {
            status: ["REVIEWING", "PENDING", "REJECTED"],
            issuerId: issuerID,
          },
          headers: {
            Authorization: `${jwz}`,
          },
        });
        const resultData = result.data?.map((item: any, index: number) => {
          // var dataRow = [];
          return {
            id: item.claimId,
            claim_id: item.claimId,
            schema_hash: item.schemaHash,
            create_date: item.createAt,
            holder_id: item.holderId,
            status: item.status,
            hidden: [],
          };
        });
        setAllTableData(resultData);
        setTableData(resultData);
        setLoading(false);
      } catch (err) {
        setLoading(false);
      }
    }
  }, [endpointUrl, jwz, issuerID]);
  const handlePublish = async () => {
    try {
      setSigning(true);
      const userId = localStorage.getItem("ziden-db/issuer-id");
      const result = await axios.get(
        `${endpointUrl}/claims/publish-challenge/${userId}`,
        {
          headers: {
            Authorization: `${jwz}`,
          },
        }
      );
      if (!result.data?.challenge || result.data?.challenge === "0") {
        enqueueSnackbar(`No new claims to publish`, {
          preventDuplicate: true,
          variant: "error",
        });
        setSigning(false);
        return;
      } else {
        const challenge = result.data?.challenge;
        if (!isUnlocked) {
          enqueueSnackbar("Please unlock your wallet!", {
            variant: "warning",
          });
          return;
        }
        let sig;
        
        const challengeBigint = BigInt(challenge);
        const privateKeyHex = keyContainer.getKeyDecrypted().privateKey;
        const privateKey = zidenUtils.hexToBuffer(privateKeyHex, 32);
        const signature = await auth.signChallenge(
          privateKey,
          challengeBigint
        );
        sig = {
          challenge: challenge,
          challengeSignatureR8x: signature.challengeSignatureR8x.toString(),
          challengeSignatureR8y: signature.challengeSignatureR8y.toString(),
          challengeSignatureS: signature.challengeSignatureS.toString(),
        };
        
        const resultPublish = await axios.post(
          `${endpointUrl}/claims/publish/${userId}`,
          {
            signature: sig,
          },
          {
            headers: {
              Authorization: `${jwz}`,
              "Content-Type": "application/json",
              accept: "application/json",
            },
          }
        );
        setSigning(false);
        if (resultPublish.data) {
          enqueueSnackbar("Publish success!", {
            preventDuplicate: true,
            variant: "success",
          });
          // await fetchData();
          props.setRefresh((prev: number) => prev + 1);
        } else {
          enqueueSnackbar(`Publish failed`, {
            preventDuplicate: true,
            variant: "error",
          });
        }
      }
    } catch (err) {
      setSigning(false);
    }
    setSigning(false);
    // }
  };

  const handleUpdate = () => {
    props.setRefresh((prev: number) => prev + 1);
  };

  useEffect(() => {
    if (endpointUrl) {
      fetchData();
    }
  }, [props.refresh, endpointUrl, fetchData]);
  return (
    <Paper
      sx={{
        my: 2,
        borderRadius: 3,
      }}
    >
      <Grid
        container
        sx={{
          px: 4,
        }}
      >
        <Grid
          item
          xs={12}
          xsm={8}
          md={8}
          lg={6}
          sx={{
            py: 3,
          }}
        >
          <SearchBar
            allData={allTableData}
            searchCateGories={headers}
            setTableData={setTableData}
            hidden={[0, 3]}
          />
        </Grid>
        <Grid item xs={12} xsm={4} md={4} lg={6}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "flex-end",
              height: "100%",
            }}
          >
            <Button
              sx={{
                mb: {
                  xs: 3,
                  xsm: 0,
                },
                width: {
                  xs: "100%",
                  xsm: "auto",
                },
              }}
              variant="contained"
              color="secondary"
              onClick={handleUpdate}
            >
              Refresh data
            </Button>
          </Box>
        </Grid>
      </Grid>
      {!loading && (
        <TableData
          type="status"
          headers={headers}
          data={tableData}
          update={handleUpdate}
        />
      )}
      {loading && (
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
      <Box
        sx={{
          px: 4,
          pt: {
            xs: 9,
            md: 3,
          },
          pb: 3,
        }}
      >
        <Box>
          <LoadingButton
            loading={signing}
            sx={{
              width: {
                xs: "100%",
                md: "auto",
              },
              my: 0.5,
            }}
            variant="contained"
            color="primary"
            onClick={handlePublish}
            disabled={userId !== issuerID}
          >
            Publish claims
          </LoadingButton>
        </Box>
      </Box>
    </Paper>
  );
};
export default Issuance;
