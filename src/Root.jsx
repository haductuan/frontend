import Theme from "./Theme";
import App from "./App";
import { IdentityWalletProvider } from "./context/identity-wallet-context";
import { SnackbarProvider } from "notistack";
import { DeviceContextProvider } from "./context/deviceContext";
import { IssuerContextProvider } from "./context/issuerContext";
import { VerifierContextProvider } from "./context/verifierContext";
import { DemoLayer } from "./components/DemoLayer";

const Root = () => {
  return (
    <Theme>
      <SnackbarProvider
        maxSnack={3}
        autoHideDuration={1500}
        anchorOrigin={{
          horizontal: "center",
          vertical: "top",
        }}
      >
        <DemoLayer />
        <IdentityWalletProvider>
          <DeviceContextProvider>
            <IssuerContextProvider>
              <VerifierContextProvider>
                <App />
              </VerifierContextProvider>
            </IssuerContextProvider>
          </DeviceContextProvider>
        </IdentityWalletProvider>
      </SnackbarProvider>
    </Theme>
  );
};
export default Root;
