import { Box } from "@mui/system";
import Header from "../Header";
import { Skeleton, Theme } from "@mui/material";

const LoadingComponent = ({ type }: { type: number }) => {
  const skeletonColor = "rgb(66,135,235,0.4)";
  /**
   * Styling
   */
  const titleStyle = (theme: Theme) => ({
    bgcolor: skeletonColor,
    borderRadius: 1,
    mx: 0.5,
    my: 1,
    height: "38px",
  });
  const descriptionStyle = (theme: Theme) => ({
    bgcolor: skeletonColor,
    borderRadius: 1,
    mx: 0.5,
    my: 0.5,
  });
  return (
    <>
      {type === 2 && (
        <Box>
          <Header
            title1={<Skeleton variant="rectangular" sx={titleStyle} />}
            title2={<Skeleton variant="rectangular" sx={titleStyle} />}
            description={[
              <Skeleton variant="rectangular" sx={descriptionStyle} />,
              <Skeleton variant="rectangular" sx={descriptionStyle} />,
              <Skeleton variant="rectangular" sx={descriptionStyle} />,
            ]}
          >
            <Box
              sx={{
                width: "120px",
                height: "120px",
              }}
            ></Box>
          </Header>
        </Box>
      )}
      {type === 1 && (
        <Box
          sx={{
            width: "100%",
            minHeight: "100vh",
          }}
        >
          <Box
            sx={{
              py: 10,
              px: {
                xs: 1,
                xsm: 2,
                md: 3,
                lg: 6,
              },
              minHeight: {
                xs: "auto",
                sm: "600px",
                lg: "91vh",
              },
            }}
          >
            <Skeleton
              sx={{
                fontSize: 38,
                maxWidth: "200px",
              }}
            />
            <Skeleton
              sx={{
                fontSize: 33,
                maxWidth: "470px",
              }}
            />
            <Skeleton
              sx={{
                fontSize: 14,
                width: "480px",
              }}
            />
            <Skeleton
              sx={{
                fontSize: 14,
                width: "480px",
              }}
            />
            <Skeleton
              sx={{
                fontSize: 14,
                width: "180px",
                mb: 4,
              }}
            />
            <Box
              sx={{
                display: {
                  xs: "block",
                  sm: "none",
                },
                mt: 6,
              }}
            ></Box>
            <Box
              display="flex"
              alignItems={"center"}
              sx={{
                mt: 5,
              }}
            >
              <Skeleton
                sx={{
                  fontSize: 14,
                  width: "90px",
                }}
              />
            </Box>
          </Box>
          <Skeleton />
        </Box>
      )}
    </>
  );
};
export default LoadingComponent;
