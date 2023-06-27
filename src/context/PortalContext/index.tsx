import React, { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { userDataType } from "../context";
const PortalContext = React.createContext(undefined as any);

export const displayTitle = {
  title: "Tile",
  idType: "Document type",
  name: "Full Name",
  countryOfResidence: "Country of resident",
  nationality: "Nationality",
  idNumber: "Passport/Citizen ID",
  gender: "Gender",
  dateOfBirth: "Date of birth",
  industry: "Industry",
  occupation: "Occupation",
  paymentMode: "Payment Method",
  addresses: "Addresses",
  primary: "Primary",
  documentId: "Document ID",
};

const PortalContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [userData, setUserData] = useState<userDataType>();
  const [userToken, setUserToken] = useState<string>();
  const [frontImageFile, setFrontImageFile] = useState<any>();
  const [backImageFile, setBackImageFile] = useState<any>();
  const [selfieFile, setSelfieFile] = useState<any>();
  const getUserToken = useCallback(async () => {
    var bodyFormData = new URLSearchParams();
    bodyFormData.append("client_id", "61l1gjse4oj6mlqt37tpa6u4ct");
    bodyFormData.append(
      "client_secret",
      "6obind8ku0380n1iahdjmeuj74qhmeukj2jf2i7rvhkngv7eoag"
    );
    bodyFormData.append("grant_type", "client_credentials");
    const res = await axios.post(
      "https://cynopsis.auth.ap-southeast-1.amazoncognito.com/oauth2/token",
      bodyFormData,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    setUserToken(res.data?.access_token);
  }, []);

  useEffect(() => {
    const fetch = async () => {
      await getUserToken();
    };
    if (!userToken) {
      fetch();
    }
  }, [userToken, getUserToken]);

  const contextValue = useMemo(() => {
    return {
      activeStep,
      setActiveStep,
      setUserData,
      userData,
      frontImageFile,
      setFrontImageFile,
      backImageFile,
      setBackImageFile,
      selfieFile,
      setSelfieFile,
      userToken,
      getUserToken,
    };
  }, [
    activeStep,
    userData,
    frontImageFile,
    backImageFile,
    userToken,
    getUserToken,
    setUserData,
    selfieFile,
  ]);
  return (
    <PortalContext.Provider value={contextValue}>
      {children}
    </PortalContext.Provider>
  );
};
export default PortalContextProvider;
export const usePortalContext = () => React.useContext(PortalContext);
