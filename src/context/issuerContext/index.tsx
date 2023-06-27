import React, { useEffect, useState } from "react";
import { useIdWalletContext } from "../identity-wallet-context";
import { zidenPortal } from "src/client/api";
// import { JWZ } from "src/utils/auth";
import axios from "axios";
import { IssuerContextProps } from "src/context/context";

const IssuerContext = React.createContext<IssuerContextProps>(undefined as any);

export function IssuerContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isUnlocked, getZidenUserID } = useIdWalletContext();
  const [networks, setNetworks] = React.useState<Array<any>>([]);
  const [endpointUrl, setEndpointUrl] = React.useState("");
  const [numPublished, setNumPublished] = useState<number>(0);
  const [numHolder, setNumHolder] = useState<number>(0);
  const [operators, setOperators] = useState<Array<any> | null>([]);
  const [profile, setProfile] = useState<{
    name: string;
    description?: string;
    logo?: string;
    website?: string;
    contact?: string;
  }>();
  const [issuerID, setIssuerID] = useState<string>("");
  const fetchIssuerMetaData = React.useCallback(async () => {
    try {
      const issuerID = localStorage.getItem("ziden-db/issuer-id") || "";
      setIssuerID(issuerID);
      const issuerMetaData = await zidenPortal.get(`/issuers/${issuerID}`);
      const endpoint = issuerMetaData?.data?.issuer?.endpointUrl || "";
      const network = (await axios.get(`${endpoint}/networks`)).data;
      setNetworks(network || []);
      setProfile({
        name: issuerMetaData?.data?.issuer?.name || "",
        description: issuerMetaData?.data?.issuer?.description || "",
        logo: issuerMetaData?.data?.issuer?.logoUrl || "",
        website: issuerMetaData?.data?.issuer?.website || "",
        contact: issuerMetaData?.data?.issuer?.contact || "",
      });
      const issuerProfile = (
        await axios.get(endpoint + `/issuers/${issuerID}/profile`)
      ).data;
      setNumPublished(issuerProfile?.numPublishClaims || 0);
      setNumHolder(issuerProfile?.numHolders || 0);
      setEndpointUrl(endpoint);
    } catch (err) {}
  }, []);
  const fetchOperator = React.useCallback(async () => {
    if (
      endpointUrl &&
      isUnlocked &&
      localStorage.getItem("ziden-db/issuer-jwz")
    ) {
      try {
        const issuerID = localStorage.getItem("ziden-db/issuer-id") || "";
        const holderID = await getZidenUserID();
        if (issuerID === holderID) {
          const issuerOperators = await axios.get(
            endpointUrl + `/issuers/${issuerID}/operators`
          );
          setOperators(
            issuerOperators?.data?.filter(
              (operator: any) => operator.activate
            ) || []
          );
        } else {
          setOperators(null);
        }
      } catch (err) {}
    }
  }, [getZidenUserID, endpointUrl, isUnlocked]);

  useEffect(() => {
    if (isUnlocked && localStorage.getItem("ziden-db/issuer-jwz")) {
      fetchIssuerMetaData();
    }
  }, [fetchIssuerMetaData, isUnlocked]);
  useEffect(() => {
    fetchOperator();
  }, [fetchOperator]);
  const context: IssuerContextProps = React.useMemo(() => {
    return {
      endpointUrl: endpointUrl,
      setEndpointUrl: setEndpointUrl,
      networks: networks,
      fetchIssuerMetaData: fetchIssuerMetaData,
      profile: profile,
      numHolder: numHolder,
      numPublished: numPublished,
      operators: operators,
      issuerID: issuerID,
      fetchOperator: fetchOperator,
    };
  }, [
    endpointUrl,
    networks,
    fetchIssuerMetaData,
    profile,
    numHolder,
    numPublished,
    operators,
    issuerID,
    fetchOperator,
  ]);
  return (
    <IssuerContext.Provider value={context}>{children}</IssuerContext.Provider>
  );
}
export const useIssuerContext = () => React.useContext(IssuerContext);
