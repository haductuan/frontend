import React, { useState } from "react";
import { Box } from "@mui/system";
import { Grid, Typography } from "@mui/material";
import { useSnackbar } from "notistack";
import { truncateString } from "src/utils/wallet/walletUtils";
import { getStatusColor } from "src/pages/holder/Identity/components/OnDevice";
import { useIdWalletContext } from "src/context/identity-wallet-context";
import { LoadingButton } from "@mui/lab";
import { parseLabel } from "src/utils/claim";

const capitalizeFirstLetter = (string: string) => {
  // format route
  return string.charAt(0).toUpperCase() + string.slice(1);
};

//style
const rowStyle = (theme: any) => {
  return {
    display: "flex",
    flexDirection: "row",
    justifyContent: "left",
    py: ".25rem",
  };
};

const IdentityDetail = ({
  data,
  claimable,
  setRefresh,
}: {
  data: any;
  claimable?: boolean;
  setRefresh?: any;
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const { enqueueSnackbar } = useSnackbar();
  const { keyContainer, getZidenUserID } =
    useIdWalletContext();

  const handleClaim = async () => {
    try {
      setLoading(true);
      const libsodium = keyContainer.getCryptoUtil();
      const userID = await getZidenUserID();
      const stringData = JSON.stringify(data?.claim);
      const saveData = JSON.stringify({
        claimId: data?.id || "",
        claim: stringData,
        schemaHash: data.schemaHash || "",
        issuerID: data?.issuerID || "",
      });
      const dataEncrypted = keyContainer.encryptWithDataKey(saveData);
      const localDB = keyContainer.db;
      //save to local storage
      localDB.insert(`ziden-user-claims/${data?.id}`, dataEncrypted);
      
      enqueueSnackbar("Get claim success!", {
        variant: "success",
      });
      setRefresh((prev: any) => prev + 1);
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };
  return (
    <>
      {data && (
        <Box>
          <Typography variant="h3">Claim name</Typography>
          <Box
            sx={(theme) => ({
              color: theme.palette.text.secondary,
            })}
          >
            <Typography variant="h6" pb={2} pt={4}>
              Information
            </Typography>
            <Grid container spacing={5}>
              <Grid item xs={12} sm={7}>
                <Box sx={rowStyle}>
                  <Typography
                    color="#646A71"
                    sx={{
                      width: "150px",
                      minWidth: "100px",
                    }}
                    variant="body2"
                  >
                    Schema hash
                  </Typography>
                  <Typography variant="body2">
                    {truncateString(data?.schemaHash, 20)}
                  </Typography>
                </Box>
                <Box sx={rowStyle}>
                  <Typography
                    color="#646A71"
                    sx={{
                      width: "150px",
                      minWidth: "100px",
                    }}
                    variant="body2"
                  >
                    Issuer
                  </Typography>
                  <Typography flexWrap={"wrap"} variant="body2">
                    {truncateString(data.issuerID, 20)}
                  </Typography>
                </Box>
                <Box sx={rowStyle}>
                  <Typography
                    color="#646A71"
                    sx={{
                      width: "150px",
                      minWidth: "100px",
                    }}
                    variant="body2"
                  >
                    Status
                  </Typography>
                  <Typography variant="h6" color={getStatusColor(data.status)}>
                    {" "}
                    {data.status}
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} sm={5}>
                <Box sx={rowStyle}>
                  <Typography
                    color="#646A71"
                    sx={{
                      width: "150px",
                      minWidth: "100px",
                    }}
                    variant="body2"
                  >
                    Version
                  </Typography>
                  <Typography variant="body2">
                    {data.version ? BigInt(data.version).toString() : 1}
                  </Typography>
                </Box>
                <Box sx={rowStyle}>
                  <Typography
                    color="#646A71"
                    sx={{
                      width: "150px",
                      minWidth: "100px",
                    }}
                    variant="body2"
                  >
                    Updatable
                  </Typography>
                  <Typography variant="body2">
                    {data.updateable ? "Yes" : "No"}
                  </Typography>
                </Box>
                <Box sx={rowStyle}>
                  <Typography
                    color="#646A71"
                    sx={{
                      width: "150px",
                      minWidth: "100px",
                    }}
                    variant="body2"
                  >
                    Expiration date
                  </Typography>
                  <Typography variant="body2">
                    {new Date(data.expireDate)?.toDateString()}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
          <Box
            sx={(theme) => ({
              color: theme.palette.text.secondary,
            })}
          >
            <Typography variant="h6" pb={2} pt={4}>
              Properties
            </Typography>
            {!data?.claim?.rawData?.individualRecords &&
              Object.keys(data?.claim?.rawData).map(
                (item: any, index: number) => {
                  if (
                    !data?.claim?.rawData[item] ||
                    data?.claim?.rawData[item].length === 0 ||
                    typeof data?.claim?.rawData[item] === "boolean"
                  ) {
                    return null;
                  }
                  if (typeof data?.claim?.rawData[item] === "object") {
                    return (
                      <Box key={index}>
                        <Typography variant="body2" sx={rowStyle}>
                          {parseLabel(item)}
                        </Typography>
                        {Object.keys(data?.claim?.rawData[item]).map(
                          (subItem: any, index: number) => {
                            const displayData =
                              data?.claim?.rawData[item][subItem];
                            if (
                              !displayData ||
                              displayData.length === 0 ||
                              typeof displayData === "boolean"
                            ) {
                              return null;
                            }
                            return (
                              <Box key={index} sx={rowStyle}>
                                <Typography
                                  color="#646A71"
                                  sx={{
                                    width: "150px",
                                    minWidth: "100px",
                                  }}
                                  noWrap
                                  variant="body2"
                                  pl={2}
                                >
                                  {capitalizeFirstLetter(subItem)}
                                </Typography>
                                <Typography variant="body2">
                                  {truncateString(displayData, 20)}
                                </Typography>
                              </Box>
                            );
                          }
                        )}
                      </Box>
                    );
                  } else {
                    return (
                      <Box key={index} sx={rowStyle}>
                        <Typography
                          color="#646A71"
                          sx={{
                            width: "150px",
                            minWidth: "100px",
                          }}
                          noWrap
                          variant="body2"
                        >
                          {parseLabel(item)}
                        </Typography>
                        <Typography variant="body2">
                          {truncateString(data?.claim?.rawData[item], 20)}
                        </Typography>
                      </Box>
                    );
                  }
                }
              )}
          </Box>
          <Box
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: "row",
              justifyContent: "right",
              mt: 5,
            }}
          >
            {claimable && (
              <LoadingButton
                loading={loading}
                sx={{
                  mr: 1.5,
                }}
                variant="outlined"
                // onClick={handleClick}
                onClick={handleClaim}
              >
                Accept
              </LoadingButton>
            )}
          </Box>
        </Box>
      )}
    </>
  );
};
export default IdentityDetail;
