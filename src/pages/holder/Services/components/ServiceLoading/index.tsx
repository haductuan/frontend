import { Box, Skeleton } from "@mui/material";

const ServiceLoading = () => {
  const numSkeleton = 6;
  return (
    <Box
      sx={{
        opacity: 0.4,
      }}
    >
      {[...Array(numSkeleton)].map((item: any, index: number) => {
        return (
          <Skeleton
            key={index}
            sx={{
              transform: "scale(1)",
              height: "90px",
              mb: 3,
              borderRadius: 2,
            }}
          />
        );
      })}
    </Box>
  );
};

export default ServiceLoading;
