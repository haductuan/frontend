import { Box, Button, Typography } from "@mui/material";
import { useHistory } from "react-router-dom";
import { EmptyIcon } from "src/constants/icon";

export default function RequireKYC({ registryId }: { registryId?: string }) {
  const history = useHistory();
  const handleRedirect = () => {
    history.push(`/holder/identity/provider/request/${registryId}`);
  };
  return (
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
        You need to have Vietnamese ID Claim
      </Typography>
      <Box
        sx={{
          my: 2,
        }}
      >
        <Button variant="contained" color="primary" onClick={handleRedirect}>
          Get it here
        </Button>
      </Box>
    </Box>
  );
}
