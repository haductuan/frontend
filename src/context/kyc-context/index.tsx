import React, { useState, useMemo } from "react";
import {
  KYCConTextProps,
  facialBoxType,
  kycMetadataType,
  userKYCDataType,
} from "../context";
import { useDeviceContext } from "../deviceContext";
import { zidenKYC } from "src/client/api";

const KYCContext = React.createContext<KYCConTextProps>(undefined as any);

const KYCContextProvider = ({ children }: { children: React.ReactNode }) => {
  const { isDesktop, isIpad, isMobile } = useDeviceContext();
  //Video dimension for difference devices
  const VIDEO_WIDTH = useMemo(() => {
    return (isDesktop && 1280) || (isIpad && 720) || (isMobile && 350);
  }, [isDesktop, isMobile, isIpad]);
  const VIDEO_HEIGHT = useMemo(() => {
    return (isDesktop && 720) || (isIpad && 1280) || (isMobile && 350);
  }, [isDesktop, isMobile, isIpad]);
  //context state
  const [challengeId, setChallengeId] = useState<string>("");
  const [kycUserId, setKycUserId] = useState<string>("");
  const [faceBox, setFaceBox] = useState<facialBoxType>({} as any);
  const [noseBox, setNoseBox] = useState<facialBoxType>({} as any);
  const [token, setToken] = useState<string>("");
  const [activeStep, setActiveStep] = useState<number>(0);
  const [userData, setUserData] = useState<userKYCDataType>(
    {} as userKYCDataType
  );
  const [metaData, setMetadata] = useState<kycMetadataType>(
    {} as kycMetadataType
  );
  const [frontImageFile, setFrontImageFile] = useState<any>();
  const [selfieFile, setSelfieFile] = useState<any>();
  const startChallenge = React.useCallback(
    async (userId: string) => {
      const res = (
        await zidenKYC.post(`/challenge/start`, {
          userId: userId,
          imageWidth: VIDEO_WIDTH,
          imageHeight: VIDEO_HEIGHT,
        })
      ).data;
      setKycUserId(userId);
      setFaceBox({
        top: res?.areaTop,
        left: res?.areaLeft,
        width: res?.areaWidth,
        height: res?.areaHeight,
      });
      setChallengeId(res?.id);
      setNoseBox({
        top: res?.noseTop,
        left: res?.noseLeft,
        width: res?.noseWidth,
        height: res?.noseHeight,
      });
      setToken(res?.token);
    },
    [VIDEO_HEIGHT, VIDEO_WIDTH]
  );

  const contextValue = React.useMemo(() => {
    return {
      activeStep,
      setActiveStep,
      setUserData,
      userData,
      frontImageFile,
      setFrontImageFile,
      selfieFile,
      setSelfieFile,
      VIDEO_WIDTH,
      VIDEO_HEIGHT,
      faceBox,
      noseBox,
      token,
      startChallenge,
      challengeId,
      kycUserId,
      setMetadata,
      metaData,
    };
  }, [
    activeStep,
    userData,
    frontImageFile,
    setUserData,
    selfieFile,
    VIDEO_WIDTH,
    VIDEO_HEIGHT,
    faceBox,
    noseBox,
    token,
    startChallenge,
    challengeId,
    kycUserId,
    metaData,
  ]);
  return (
    <KYCContext.Provider value={contextValue}>{children}</KYCContext.Provider>
  );
};

export default KYCContextProvider;
export const useKYCContext = () => React.useContext(KYCContext);
