/* eslint-disable jsx-a11y/alt-text */
import { LoadingButton } from "@mui/lab";
import { Typography, SxProps, Theme, Box } from "@mui/material";
import { useState } from "react";

import { getStatusColor } from "src/pages/holder/Identity/components/OnDevice";
import { parseLabel } from "src/utils/claim";

export interface detailDataType {
  claim_id: string;
  schema_hash: string;
  create_date: number;
  holder_id: string;
  status: string;
  id: string;
  rawData?: {
    [otherProps: string]: string;
  };
  imagesUrl?: string[];
  hidden?: string[];
}
//style
const row: SxProps<Theme> | undefined = (theme: Theme) => {
  return {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    height: "40px",
  };
};
const kycImage: SxProps<Theme> | undefined = (theme: Theme) => {
  return {
    px: {
      xs: 1,
      sm: 4,
      lg: 8,
    },
    py: 2,
    width: "100%",
  };
};
export default function ClaimDetail({
  displayData,
  accept,
  reject,
}: {
  displayData: detailDataType;
  accept: (claimId: string) => Promise<void>;
  reject: (claimId: string) => Promise<void>;
}) {
  console.log("🚀 ~ file: index.tsx:51 ~ displayData:", displayData.imagesUrl);
  const [loading, setLoading] = useState<boolean>(false);
  return (
    <Box>
      {/* Base info */}
      <Box sx={row}>
        <Typography
          variant="body2"
          sx={{
            minWidth: {
              xs: "100px",
              xsm: "150px",
            },
          }}
          color="secondary"
          flexWrap={"wrap"}
        >
          Claim ID
        </Typography>
        <Typography
          noWrap
          fontWeight={500}
          variant="body2"
          color="text.secondary"
        >
          {displayData.claim_id}
        </Typography>
      </Box>
      <Box sx={row}>
        <Typography
          variant="body2"
          sx={{
            minWidth: {
              xs: "100px",
              xsm: "150px",
            },
          }}
          color="secondary"
          flexWrap={"wrap"}
        >
          Schema hash
        </Typography>
        <Typography
          noWrap
          fontWeight={500}
          variant="body2"
          color="text.secondary"
        >
          {displayData.schema_hash}
        </Typography>
      </Box>
      <Box sx={row}>
        <Typography
          variant="body2"
          sx={{
            minWidth: {
              xs: "100px",
              xsm: "150px",
            },
          }}
          color="secondary"
          flexWrap={"wrap"}
        >
          Create date
        </Typography>
        <Typography
          noWrap
          fontWeight={500}
          variant="body2"
          color="text.secondary"
        >
          {new Date(displayData.create_date).toLocaleDateString()}
        </Typography>
      </Box>
      <Box sx={row}>
        <Typography
          variant="body2"
          sx={{
            minWidth: {
              xs: "100px",
              xsm: "150px",
            },
          }}
          color="secondary"
          flexWrap={"wrap"}
        >
          Holder ID
        </Typography>
        <Typography
          noWrap
          fontWeight={500}
          variant="body2"
          color="text.secondary"
        >
          {displayData.holder_id}
        </Typography>
      </Box>
      <Box sx={row}>
        <Typography
          variant="body2"
          sx={{
            minWidth: {
              xs: "100px",
              xsm: "150px",
            },
          }}
          color="secondary"
          flexWrap={"wrap"}
        >
          Status
        </Typography>
        <Typography
          noWrap
          fontWeight={500}
          variant="body2"
          color={getStatusColor(displayData.status)}
        >
          {displayData.status}
        </Typography>
      </Box>
      {/* Kyc data */}
      {displayData.rawData && (
        <>
          {Object.entries(displayData.rawData).map(([key, value], index) => {
            return (
              <Box sx={row} key={index}>
                <Typography
                  variant="body2"
                  sx={{
                    minWidth: {
                      xs: "100px",
                      xsm: "150px",
                    },
                  }}
                  color="secondary"
                  flexWrap={"wrap"}
                >
                  {parseLabel(key)}
                </Typography>
                <Typography
                  noWrap
                  fontWeight={500}
                  variant="body2"
                  color="text.secondary"
                >
                  {value}
                </Typography>
              </Box>
            );
          })}
          {displayData?.imagesUrl && (
            <Box sx={kycImage}>
              {displayData?.imagesUrl?.map((item: string, index: number) => {
                return (
                  <Box
                    sx={{
                      width: "100%",
                      maxWidth: "300px",
                      overflow: "hidden",
                    }}
                  >
                    <img
                      src={item?.toString()}
                      style={{
                        width: "100%",
                        // aspectRatio: 1.5,
                      }}
                    />
                  </Box>
                );
              })}
            </Box>
          )}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mt: 2,
            }}
          >
            <LoadingButton
              loading={loading}
              variant="outlined"
              color="primary"
              onClick={async () => {
                setLoading(true);
                await reject(displayData.claim_id);
                setLoading(false);
              }}
            >
              Reject
            </LoadingButton>
            <LoadingButton
              loading={loading}
              variant="contained"
              color="primary"
              onClick={async () => {
                setLoading(true);
                await accept(displayData.claim_id);
                setLoading(false);
              }}
            >
              Accept
            </LoadingButton>
          </Box>
        </>
      )}
    </Box>
  );
}
