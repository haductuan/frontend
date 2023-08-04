import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import Header from "src/components/Header";
import {
  ArrowDownIcon,
  ArrowRightIcon,
  CheckIcon,
  DotLoadingIcon,
  DotLoadingIconLight,
  NotCheckIcon,
} from "src/constants/icon";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { backendServer } from "src/client/api";
import { useIdWalletContext } from "src/context/identity-wallet-context";
import RequirementDetail from "../../Services/Attestation/components/RequirementDetail";
import { useDeviceContext } from "src/context/deviceContext";

const Verification = () => {
  const params: { id: string } = useParams();
  const { isDesktop } = useDeviceContext();
  const [providerData, setProviderData] = useState<{
    title: string;
    description: string;
    logo: string;
    hostBy: string;
  }>();
  const [requireData, setRequireData] = useState<Array<any>>([]);
  const [selected, setSelected] = useState(0);
  const { isUnlocked } = useIdWalletContext();
  const [proofs, setProofs] = useState<Array<any>>();
  const [fetchComplete, setFetchComplete] = useState<boolean>(false);
  useEffect(() => {
    const fetchData = async () => {
      setFetchComplete(false);
      const requestData = (await backendServer.get(`proofs/${params.id}`)).data;
      const serviceId = requestData?.request?.serviceId || "";
      const proofs = requestData?.request?.zkProofs || [];
      setProofs(proofs);
      const serviceDetail = (await backendServer.get(`services/${serviceId}`))
        .data;
      setProviderData({
        title: serviceDetail?.service?.name,
        description: serviceDetail?.service?.description,
        logo: serviceDetail?.service?.verifier?.logoUrl,
        hostBy: serviceDetail?.service?.verifier?.name,
      });
      const requirements = serviceDetail?.service?.requirements?.map(
        (requirement: any, index: number) => {
          console.log("🚀 ~ file: index.tsx:58 ~ fetchData ~ requirement:", requirement)
          return {
            name: requirement.query.propertyName,
            displayName: requirement.title,
            require: requirement.attestation,
            issuerID: requirement.allowedIssuers,
            schemaHash: requirement.schemaHash,
            schemaName: requirement.schema.name,
            filled: "checking",
            value: requirement.query.value,
            operator: requirement.query.operator,
          };
        }
      );
      setRequireData(requirements);
      setFetchComplete(true);
    };
    fetchData();
  }, [params]);
  useEffect(() => {
    const verifyProof = async () => {
      const verifyResult = (
        await backendServer.post(`/proofs/verify`, {
          networkId: "97",
          zkProofs: proofs,
        })
      ).data;
      setRequireData((prev: Array<any>) => {
        return prev.map((item: any, index: number) => {
          return {
            ...item,
            filled: verifyResult?.results[index] ? "checked" : "notChecked",
          };
        });
      });
    };
    if (isUnlocked && fetchComplete && proofs) {
      verifyProof();
    }
  }, [isUnlocked, fetchComplete, proofs]);
  return (
    <Box
      sx={{
        width: "100%",
      }}
    >
      <Header
        title1={providerData?.title}
        by={providerData?.hostBy}
        description={[providerData?.description]}
      />
      <Box
        sx={{
          p: {
            xs: 2,
            xsm: 2,
            md: 3,
            lg: 6,
          },
        }}
      >
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
            lg={5}
            xl={4}
            sx={{
              height: "500px",
              overflowY: "scroll",
              px: "8px",
              pt: "1px",
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
            {requireData.map((item: any, index: number) => {
              return (
                <Button
                  variant="contained"
                  key={index}
                  sx={{
                    maxWidth: "900px",
                    width: "100%",
                    height: "100px",
                    backgroundColor: selected === index ? "#114898" : "#FFFEFC",
                    boxShadow: "0px 2px 8px #0000001F",
                    borderRadius: 4,
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    pl: 4,
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
                  onClick={() => {
                    setSelected(index);
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      width: "100%",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      {item.filled === "checking" &&
                        isUnlocked &&
                        selected !== index && (
                          <DotLoadingIcon sx={{ transform: "scale(0.8)" }} />
                        )}
                      {item.filled === "checking" &&
                        isUnlocked &&
                        selected === index && (
                          <DotLoadingIconLight
                            sx={{ transform: "scale(0.8)" }}
                          />
                        )}
                      {item.filled === "checked" && isUnlocked && <CheckIcon />}
                      {(item.filled === "notChecked" || !isUnlocked) && (
                        <NotCheckIcon />
                      )}
                      <Typography
                        sx={{
                          color: selected === index ? "#FFFFFC" : "#114898",
                          letterSpacing: "0px",
                          opacity: 1,
                          ml: 2,
                        }}
                        variant="h4"
                        textAlign={"left"}
                      >
                        {item.displayName}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        mr: 1,
                      }}
                    >
                      <ArrowRightIcon />
                    </Box>
                  </Box>
                </Button>
              );
            })}
          </Grid>
          <Grid
            item
            xs={12}
            sm={12}
            lg={7}
            xl={8}
            sx={{
              pt: "1px",
            }}
          >
            <Paper
              sx={{
                ml: 1,
                backgroundColor: "FFFFFF",
                p: 3,
                boxShadow: "0px 2px 8px #0000001F",
                borderRadius: 4,
                height: "500px",
              }}
            >
              <RequirementDetail detailData={requireData[selected]} />
            </Paper>
          </Grid>
        </Grid>
        <Grid
          container
          sx={{
            display: isDesktop ? "none" : "flex",
            flexDirection: "column",
          }}
        >
          {requireData?.map((data: any, index: number) => {
            return (
              <Accordion
                key={index}
                sx={{
                  "& .MuiAccordionSummary-root": {
                    background: "#FFFEFC 0% 0% no-repeat padding-box",
                    borderRadius: 4,
                    px: { xs: 3, sm: 4 },
                  },
                  mb: 2,
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
                    fontWeight: 300,
                    color: "#F7A088",
                  },
                  "& .Mui-expanded .MuiTypography-root": {
                    color: "#FFFFFC",
                  },
                  "& .Mui-expanded #dotLoading path": {
                    fill: "#fff",
                  },
                  "& .Mui-expanded #dotLoading circle": {
                    fill: "#fff",
                  },

                  "& .Mui-expanded .MuiButton-root": {
                    color: "#FFFFFF",
                    border: "1px solid #FFFFFF",
                  },
                }}
              >
                <AccordionSummary
                  expandIcon={
                    <ArrowDownIcon sx={{ width: "34px", height: "17px" }} />
                  }
                  sx={{
                    width: "100%",
                    height: "90px",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      width: "100%",
                      mr: 2,
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      {data.filled === "checking" && isUnlocked && (
                        <DotLoadingIcon
                          sx={{ transform: "scale(0.8)", color: "#ffffff" }}
                        />
                      )}
                      {data.filled === "checked" && isUnlocked && (
                        <CheckIcon
                          sx={{
                            width: "20px",
                            height: "20px",
                          }}
                        />
                      )}
                      {data.filled === "notChecked" && isUnlocked && (
                        <NotCheckIcon
                          sx={{
                            width: "20px",
                            height: "20px",
                          }}
                        />
                      )}
                      <Typography
                        sx={{
                          letterSpacing: "0px",
                          opacity: 1,
                          ml: 2,
                        }}
                        variant="h4"
                        textAlign={"left"}
                      >
                        {data.displayName}
                      </Typography>
                    </Box>
                  </Box>
                </AccordionSummary>
                <AccordionDetails
                  sx={{
                    px: 5,
                  }}
                >
                  <RequirementDetail detailData={requireData[index]} />
                </AccordionDetails>
              </Accordion>
            );
          })}
        </Grid>
      </Box>
    </Box>
  );
};
export default Verification;
