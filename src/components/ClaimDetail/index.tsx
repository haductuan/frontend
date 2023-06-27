import { LoadingButton } from "@mui/lab";
import { Typography, SxProps, Theme, Box, CardMedia } from "@mui/material";
import { useState } from "react";

import { getStatusColor } from "src/pages/holder/Identity/components/OnDevice";
import { parseLabel } from "src/utils/claim";

export interface detailDataType {
  claim_id: string;
  schema_hash: string;
  create_date: number;
  holder_id: string;
  status: string;
  kycData: {
    [otherProps: string]: string;
  };
  userImage?: string;
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
      {displayData?.status?.toLowerCase() === "reviewing" && (
        <>
          {Object.entries(displayData.kycData).map(([key, value], index) => {
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
          <Box sx={kycImage}>
            <CardMedia
              sx={{
                width: "100%",
                borderRadius: 2,
              }}
              component="img"
              src={displayData?.userImage}
            />
          </Box>
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
