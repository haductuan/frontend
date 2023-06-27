import { Box } from "@mui/material";

interface Props {
  children: React.ReactElement;
}

export default function BlankLayout(props: Props) {
  const { children } = props;

  return <Box component={"main"}>{children}</Box>;
}
