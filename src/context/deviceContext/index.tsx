import React, { useMemo } from "react";
import { useTheme } from "@mui/material";
import { useMediaQuery } from "@mui/material";
import { DeviceContextProps } from "src/context/context";

const DeviceContext = React.createContext<DeviceContextProps>(undefined as any);
export function DeviceContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const theme = useTheme();
  const isIpad = useMediaQuery(theme.breakpoints.between("xsm", "lg"));
  const isMobile = useMediaQuery(theme.breakpoints.down("xsm"));
  const isDesktop = useMediaQuery(theme.breakpoints.up("lg"));
  const contextValue = useMemo(() => {
    return {
      isMobile,
      isIpad,
      isDesktop,
    };
  }, [isMobile, isIpad, isDesktop]);
  return (
    <DeviceContext.Provider value={contextValue}>
      {children}
    </DeviceContext.Provider>
  );
}
export const useDeviceContext = () => React.useContext(DeviceContext);
