import { Box, Grid, Skeleton, Theme } from "@mui/material";

const LoadingClaim = () => {
  const numClaim = 4;
  const searchBarStyle = (theme: Theme) => ({
    width: "100%",
    height: "56px",
    transform: "scale(1)",
    mb: 3,
    borderRadius: "10px",
  });
  const claimStyle = (theme: Theme) => ({
    width: "100%",
    height: "110px",
    borderRadius: 4,
    ppadding: "0px",
    margin: "0px",
    transform: "scale(1)",
    mb: 2,
  });
  return (
    <Box
      sx={{
        width: "100%",
        opacity: 0.3,
      }}
    >
      <Skeleton sx={searchBarStyle} />
      <Grid container>
        <Grid item xs={12} sm={12} lg={5} xl={4}>
          {[...Array(numClaim)].map((item: any, index: number) => {
            return <Skeleton key={index} sx={claimStyle} />;
          })}
        </Grid>
      </Grid>
    </Box>
  );
};
export default LoadingClaim;
