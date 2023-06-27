import { Box, Grid, Skeleton } from "@mui/material";

const LoadingProvider = () => {
  const numProvider = 4;
  return (
    <Box
      sx={{
        opacity: 0.4,
        width: "100%",
      }}
    >
      <Grid container>
        <Grid item xs={12} sm={12} lg={5}>
          {[...Array(numProvider)].map((item: any, index: number) => {
            return (
              <Skeleton
                key={index}
                sx={{
                  transform: "scale(1)",
                  height: "110px",
                  borderRadius: 4,
                  mb: 2,
                }}
              />
            );
          })}
        </Grid>
      </Grid>
    </Box>
  );
};
export default LoadingProvider;
