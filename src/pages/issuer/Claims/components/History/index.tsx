import { Box, Button, Grid, Paper, CircularProgress } from "@mui/material";
import axios from "axios";
import React, { useState, useEffect } from "react";
import TableData from "src/components/TableData";
import { useIssuerContext } from "src/context/issuerContext";
import SearchBar from "src/components/SearchBar";

const headers = [
  { id: "no", label: "No" },
  { id: "claim_id", label: "Claim ID" },
  { id: "schema_hash", label: "Schema hash" },
  { id: "create_date", label: "Create date" },
  { id: "holder_id", label: "Holder ID" },
  { id: "status", label: "Status" },
];
const History = (props: any) => {
  const { endpointUrl } = useIssuerContext();
  const jwz = localStorage.getItem("ziden-db/issuer-jwz");
  const [allTableData, setAllTableData] = useState<Array<any>>([]);
  const [tableData, setTableData] = useState<Array<any>>([]);
  const [loading, setLoading] = useState(false);

  const fetchData = React.useCallback(async () => {
    const userId = localStorage.getItem("ziden-db/issuer-id");
    if (endpointUrl && userId) {
      try {
        setLoading(true);
        const result = await axios.get(`${endpointUrl}/claims`, {
          params: { status: ["REVOKED", "ACTIVE"], issuerId: userId },
          headers: {
            Authorization: `${jwz}`,
          },
        });
        const resultData = result.data?.map((item: any, index: number) => {
          const no = index + 1;
          return {
            no: no,
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
  }, [endpointUrl, jwz]);

  const handleUpdate = async () => {
    props.setRefresh((prev: number) => prev + 1);
  };
  useEffect(() => {
    fetchData();
  }, [props.refresh, fetchData]);

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
          height: "85px",
        }}
      ></Box>
    </Paper>
  );
};
export default History;
