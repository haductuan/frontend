import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { useState } from "react";
import { NavLink } from "react-router-dom";

import { truncateString } from "src/utils/wallet/walletUtils";
import SearchBar from "../SearchBar";
import { CopyIcon, EmptyIcon } from "src/constants/icon";
import { useSnackbar } from "notistack";

const ProviderDetail = ({ detailData }: { detailData: any }) => {
  const [filteredData, setFilteredData] = useState<any>([]);
  const { enqueueSnackbar } = useSnackbar();
  const specialList = [
    "0d6e6fbc-7a7b-4775-9a4a-506b7500dddc",
    "1660ce93-4779-4d3a-8ec4-45ff01d99450",
  ];
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      enqueueSnackbar("Copied", {
        variant: "success",
      });
    });
  };
  return (
    <Box>
      {detailData && (
        <>
          <Typography
            variant="body2"
            sx={{
              p: 4,
            }}
            color="#646A71"
          >
            {detailData.description}
          </Typography>
          <Box
            px={4}
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              justifyContent: "space-between",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "row", sm: "column" },
                alignItems: { xs: "center", sm: "flex-start" },
              }}
            >
              <Typography variant="body2" color="#646A71" width={"70px"}>
                Issuer ID
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Typography
                  sx={{
                    fontWeight: 600,
                    color: "#646A71",
                    fontSize: "0.875rem",
                  }}
                  noWrap
                >
                  {truncateString(detailData.issuerId || "", 20)}
                </Typography>
                <Button
                  sx={{
                    minWidth: "0px",
                    backgroundColor: "transparent",
                    minHeight: "0px",
                    p: 0,
                    ml: 1,
                  }}
                  onClick={() => {
                    handleCopy(detailData.issuerId);
                  }}
                >
                  <CopyIcon />
                </Button>
              </Box>
            </Box>
            <Box>
              <Typography variant="body2" color="#646A71">
                Contact{" "}
                <span
                  style={{
                    fontWeight: 600,
                    color: "#646A71",
                    fontSize: "0.875rem",
                    paddingLeft: "18px",
                  }}
                >
                  {detailData.contact}
                </span>
              </Typography>
              <Typography mt="5px" variant="body2" color="#646A71">
                Website{" "}
                <a
                  href={detailData.website}
                  target={"_blank"}
                  rel="noreferrer"
                  style={{
                    textDecoration: "none",
                    fontWeight: 600,
                    color: "#646A71",
                    paddingLeft: "18px",
                  }}
                >
                  {detailData.website}
                </a>
              </Typography>
            </Box>
          </Box>
          <Typography px={4} py={2} variant="h3">
            Registered Schemas
          </Typography>
          {detailData && (
            <Box
              sx={{
                px: 4,
                py: 2,
              }}
            >
              <SearchBar
                allData={detailData.schemaRegistries}
                searchCateGories={[
                  { id: "name", label: "Name" },
                  { id: "schemaHash", label: "Schema Hash" },
                  { id: "network", label: "Network" },
                ]}
                setTableData={setFilteredData}
                hidden={[]}
                defaultType="name"
              />
            </Box>
          )}
          <TableContainer
            sx={{
              "& .MuiTableCell-root": {
                pl: "32px",
                borderBottom: "none",
                minWidth: "150px",
              },
            }}
          >
            <Table>
              <TableHead
                sx={{
                  backgroundColor: "#EDF3FC",
                }}
              >
                <TableRow>
                  <TableCell align="left">
                    <Typography>Name</Typography>
                  </TableCell>
                  <TableCell align="left">
                    <Typography>Hash</Typography>
                  </TableCell>
                  <TableCell align="left">
                    <Typography>Network</Typography>
                  </TableCell>
                  <TableCell align="left"></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredData
                  .filter((item: any) => item.isActive) // remove inactive registries
                  ?.map((data: any, index: number) => {
                    return (
                      <TableRow key={data.name + index}>
                        <TableCell align="left">
                          <Typography variant="h6" color="text.secondary">
                            {data.name}
                          </Typography>
                        </TableCell>
                        <TableCell align="left">
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            <Typography variant="body2" color="text.secondary">
                              {truncateString(data.schemaHash, 20)}
                            </Typography>
                            <Button
                              sx={{
                                minWidth: "0px",
                                backgroundColor: "transparent",
                                minHeight: "0px",
                                p: 0,
                                ml: 1,
                              }}
                              onClick={() => {
                                handleCopy(data.schemaHash);
                              }}
                            >
                              <CopyIcon />
                            </Button>
                          </Box>
                        </TableCell>
                        <TableCell align="left">
                          <Typography variant="body2" color="text.secondary">
                            {data.network}
                          </Typography>
                        </TableCell>
                        <TableCell align="left">
                          <NavLink
                            to={
                              specialList.includes(data.registryId)
                                ? `/holder/identity/provider/request/kyc/${data.registryId}`
                                : `/holder/identity/provider/request/${data.registryId}`
                            }
                            style={{ textDecoration: "none" }}
                          >
                            <Button variant="outlined">Request</Button>
                          </NavLink>
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
            {filteredData?.filter((item: any) => item.isActive)?.length ===
              0 && (
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  py: 2,
                }}
              >
                <EmptyIcon />
                <Typography variant="h4" fontWeight={700}>
                  Empty
                </Typography>
              </Box>
            )}
          </TableContainer>
        </>
      )}
    </Box>
  );
};
export default ProviderDetail;
