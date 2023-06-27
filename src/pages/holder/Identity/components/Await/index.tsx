import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Badge,
  Button,
  Collapse,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import { useIdWalletContext } from "src/context/identity-wallet-context";
import IdentityDetail from "src/components/IdentityDetail";
import { useDeviceContext } from "src/context/deviceContext";
import { ArrowDownIcon, ArrowRightIcon, EmptyIcon } from "src/constants/icon";
import SearchBar from "src/components/SearchBar";
import { zidenBackup, zidenPortal } from "src/client/api";
import { userType } from "src/constants";
import { getAllUserClaim } from "src/utils/db/localStorageDb";
import UnlockWalletWarning from "../UnlockWalletWarning";
import LoadingClaim from "../LoadingClaim";

const Await = () => {
  const [awaitData, setAwaitData] = useState<any>();
  const [metaData, setMetaData] = useState<Array<any>>([]);
  const [detailData, setDetailData] = useState<any>();
  const { isUnlocked, getZidenUserID, checkUserType } = useIdWalletContext();
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(-1);
  const [refresh, setRefresh] = useState<number>(0);
  const offset = 1;
  const [open, setOpen] = React.useState(false);
  const [filteredData, setFilteredData] = useState<Array<any>>([]);
  const { isDesktop } = useDeviceContext();

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const userId = await getZidenUserID();
        const allUserClaimData = await zidenBackup.get(
          `backup?holderId=${userId}`
        );
        //check for awaiting claims
        const allClaims = (await zidenPortal.get(`claims?holderId=${userId}`))
          ?.data;
        let OndeviceClaimId: Array<any> = [];
        if (checkUserType() === userType.oraiWeb) {
          OndeviceClaimId = getAllUserClaim().map((claim) => claim.id);
        } else {
          OndeviceClaimId = allUserClaimData.data?.data?.map(
            (item: any) => item.claimId
          );
        }
        const awatingClaims = allClaims?.filter((claim: any) => {
          return !OndeviceClaimId.includes(claim.claimId);
        });
        setAwaitData(awatingClaims);
        setLoading(false);
      } catch (err) {}
    };
    fetchData();
  }, [refresh, getZidenUserID, checkUserType]);

  React.useEffect(() => {
    if (awaitData) {
      setMetaData(
        awaitData.map((data: any) => {
          return {
            name: data.schema?.name,
            issuedBy: data?.issuer?.name,
            status: data?.status,
            claimData: {
              id: data.claimId,
              claim: {
                rawData: data?.data,
                claim: data?.entry,
              },
              issuerID: data?.issuer?.issuerId,
              schemaHash: data?.schema?.schemaHash,
              status: data?.status,
            },
          };
        })
      );
    }
  }, [awaitData]);

  const handleClick = (e: any, index: number, status: string) => {
    setSelected(selected === index ? -1 : index);
    setOpen(selected === index ? false : true);
  };

  useEffect(() => {
    setOpen(false);
    setSelected(-1);
  }, [filteredData]);
  return (
    <Box
      sx={{
        px: {
          xs: 2,
          xsm: 2,
          md: 3,
          lg: 0,
        },
        py: 4,
        minHeight: "calc(100vh - 420px)",
        display: "flex",
        flexDirection: "column",
        width: "100%",
      }}
    >
      {metaData?.length > 0 && isUnlocked && (
        <Box
          sx={{
            pb: 3,
          }}
        >
          <SearchBar
            allData={metaData}
            searchCateGories={[
              { id: "name", label: "Name" },
              { id: "issuedBy", label: "Issued by" },
              { id: "status", label: "Status" },
            ]}
            setTableData={setFilteredData}
            defaultType="name"
          />
        </Box>
      )}
      {metaData?.length > 0 && (
        <>
          <Grid
            container
            sx={{
              display: isDesktop ? "flex" : "none",
            }}
          >
            <Grid
              item
              xs={12}
              sm={12}
              lg={4}
              sx={{
                height: "510px",
                overflowY: "scroll",
                paddingLeft: "-10px",
                pr: "8px",
                pt: "2px",
                scrollSnapType: "y mandatory",
                "&::-webkit-scrollbar": {
                  height: "0px",
                  width: "4px",
                  display: "initial",
                },
                "&::-webkit-scrollbar-thumb": {
                  background: "rgb(17,72,152, 0.2)",
                  borderRadius: "3px",
                },
              }}
            >
              {filteredData.map((data, index) => {
                return (
                  <Button
                    variant="contained"
                    key={data.name + index}
                    sx={{
                      maxWidth: "900px",
                      width: "100%",
                      height: "110px",
                      backgroundColor:
                        selected === index ? "#114898" : "#FFFEFC",
                      boxShadow: "0px 2px 8px #0000001F",
                      borderRadius: 4,
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      pl: 4,
                      ml: "1px",
                      mb: 2,
                      "&:hover": {
                        background:
                          selected === index
                            ? "#114898 0% 0% no-repeat padding-box"
                            : "#FFFEFC 0% 0% no-repeat padding-box",
                      },
                      scrollMargin: "2px",
                      scrollSnapAlign: "start",
                      opacity: 1,
                    }}
                    onClick={(e) => {
                      setDetailData(data.claimData);
                      handleClick(e, index, data.status);
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                      }}
                    >
                      <Typography
                        sx={{
                          color: selected === index ? "#FFFFFC" : "#114898",
                          letterSpacing: "0px",
                          opacity: 1,
                        }}
                        variant="h4"
                      >
                        {data.name}
                      </Typography>
                      <Typography
                        sx={{
                          color: selected === index ? "#FFFFFC" : "#646A71",
                          letterSpacing: "0px",
                          opacity: 1,
                        }}
                        variant="small"
                      >
                        Issued by{" "}
                        <span style={{ fontWeight: 500 }}>{data.issuedBy}</span>
                      </Typography>
                    </Box>
                    <Box>
                      <ArrowRightIcon />
                    </Box>
                  </Button>
                );
              })}
            </Grid>
            <Grid item xs={12} sm={12} lg={8}>
              <Collapse in={open} sx={{ marginTop: offset + "px" }}>
                <Paper
                  sx={{
                    backgroundColor: "FFFFFF",
                    p: 3,
                    ml: 1,
                    boxShadow: "0px 2px 8px #0000001F",
                    borderRadius: 4,
                  }}
                >
                  <IdentityDetail
                    data={detailData}
                    claimable={true}
                    setRefresh={setRefresh}
                  />
                </Paper>
              </Collapse>
            </Grid>
          </Grid>
          <Grid
            container
            spacing={2}
            sx={{ display: isDesktop ? "none" : "block" }}
          >
            {filteredData?.map((data, index) => {
              return (
                <Grid item xs={12} key={data.name + index}>
                  <Accordion
                    sx={{
                      "& .MuiAccordionSummary-root": {
                        background: "#FFFEFC 0% 0% no-repeat padding-box",
                        borderRadius: 4,
                        px: 5,
                      },
                      "& .MuiAccordionSummary-root.Mui-expanded": {
                        background: "#114898 0% 0% no-repeat padding-box",
                      },
                      "&.MuiPaper-root": {
                        borderRadius: 4,
                        boxShadow: "0px 2px 8px #0000001F",
                      },
                      "&.MuiAccordion-root:before": {
                        position: "relative",
                      },
                      "&	.MuiSvgIcon-root": {
                        fontSize: "4rem",
                        fontWeight: 300,
                        color: "#F7A088",
                      },
                      "& .Mui-expanded .MuiTypography-root": {
                        color: "#FFFFFC",
                      },
                      "& .Mui-expanded .MuiButton-root": {
                        color: "#FFFFFF",
                        border: "1px solid #FFFFFF",
                      },
                    }}
                  >
                    <Badge
                      color="primary"
                      sx={{
                        width: "100%",
                      }}
                    >
                      <AccordionSummary
                        expandIcon={
                          <ArrowDownIcon
                            sx={{ width: "34px", height: "17px" }}
                          />
                        }
                        sx={{
                          width: "100%",
                          height: "110px",
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "flex-start",
                            mr: 2,
                          }}
                        >
                          <Typography
                            sx={{
                              color: selected === index ? "#FFFFFC" : "#114898",
                              letterSpacing: "0px",
                              opacity: 1,
                            }}
                            variant="h4"
                          >
                            {data.name}
                          </Typography>
                          <Typography
                            sx={{
                              color: selected === index ? "#FFFFFC" : "#646A71",
                              letterSpacing: "0px",
                              opacity: 1,
                            }}
                            variant="small"
                          >
                            Issued by {data.issuedBy}
                          </Typography>
                        </Box>
                      </AccordionSummary>
                    </Badge>
                    <AccordionDetails
                      sx={{
                        px: 5,
                      }}
                    >
                      <IdentityDetail
                        claimable={true}
                        data={data.claimData}
                        setRefresh={setRefresh}
                      />
                    </AccordionDetails>
                  </Accordion>
                </Grid>
              );
            })}
          </Grid>
        </>
      )}
      {metaData?.length === 0 && !loading && isUnlocked && (
        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
            alignItems: "center",
            pt: 5,
          }}
        >
          <EmptyIcon />
          <Typography mt={1} variant="h3">
            No awating claims
          </Typography>
        </Box>
      )}
      {loading && <LoadingClaim />}
      {!isUnlocked && <UnlockWalletWarning />}
    </Box>
  );
};

export default Await;
