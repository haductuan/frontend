import React, { useEffect, useState } from "react";
import { useIdWalletContext } from "../identity-wallet-context";
import { zidenPortal } from "src/client/api";

export interface verifierProfileType {
  logo: string;
  name: string;
  description?: string;
  contact: string;
  website: string;
  endpointUrl?: string;
}

export interface VerifierContextProps {
  verifierId: string;
  endpointUrl?: string;
  profile?: verifierProfileType;

  operators: any;
  fetchVerifierProfile: () => Promise<any>;
  fetchOperator: () => Promise<any>;
}
const VerifierContext = React.createContext<VerifierContextProps>(
  undefined as any
);

export function VerifierContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isUnlocked, getZidenUserID, keyContainer } = useIdWalletContext();
  const [profile, setProfile] = useState<verifierProfileType>(
    {} as verifierProfileType
  );

  const [operators, setOperators] = useState();
  const [verifierId, setVerifierId] = useState<string>("");
  const fetchVerifierProfile = React.useCallback(async () => {
    if (isUnlocked) {
      try {
        const verifierId = keyContainer.db.get("verifier-id");
        if (!verifierId) {
          return;
        }
        setVerifierId(verifierId);
        const res = (await zidenPortal.get(`/verifiers/${verifierId}`)).data;
        setProfile({
          contact: res.verifier?.contact || "",
          logo: res.verifier?.logoUrl || "",
          name: res.verifier?.name || "",
          website: res.verifier?.website || "",
          description: res.verifier?.description || "",
        });
      } catch (err) {
        console.log(err);
      }
    }
  }, [isUnlocked, keyContainer]);

  const fetchOperator = React.useCallback(async () => {
    if (isUnlocked) {
      try {
        const userId = await getZidenUserID();
        if (verifierId === userId) {
          const res = await zidenPortal.get(
            `/verifiers/${verifierId}/operators`
          );
          if (res.data) {
            setOperators(res.data?.operators || []);
          }
        }
      } catch (err) {
        console.log(err);
      }
    }
  }, [getZidenUserID, isUnlocked, verifierId]);
  useEffect(() => {
    fetchVerifierProfile();
    // fetchOperator();
  }, [fetchVerifierProfile, fetchOperator]);
  const context = React.useMemo(() => {
    return {
      verifierId: verifierId,
      endpointUrl: "",
      profile: profile,
      operators: operators,
      fetchVerifierProfile,
      fetchOperator,
    };
  }, [profile, verifierId, operators, fetchOperator, fetchVerifierProfile]);
  return (
    <VerifierContext.Provider value={context}>
      {children}
    </VerifierContext.Provider>
  );
}

export const useVerifierContext = () => React.useContext(VerifierContext);
