import { SetStateAction } from "react";
import KeyContainer from "src/utils/key-container/keyContainer";

export interface IdentityWalletContextProps {
  userId: string;
  open: boolean;
  isNewUser: boolean;
  createIdMethod: number;
  keyContainer: KeyContainer;
  isUnlocked: boolean;
  logout: () => void;
  updateUserData: () => void;
  unlockWallet: (password: string) => Promise<boolean>;
  lockWallet: () => void;
  goBack: () => void;
  setCreateIdMethod: React.Dispatch<SetStateAction<number>>;
  getZidenUserID: () => Promise<string>;
  setOpen: React.Dispatch<SetStateAction<boolean>>;
  setIsNewUser: React.Dispatch<SetStateAction<boolean>>;
  validatePassword: (password: string) => Promise<boolean | undefined>;
  checkUserType: any;
  qrCodeData: React.Dispatch<SetStateAction<any>>;
  setQrCodeData: any;
}

export interface DeviceContextProps {
  isMobile: boolean;
  isIpad: boolean;
  isDesktop: boolean;
}

export interface IssuerContextProps {
  endpointUrl: string;
  setEndpointUrl: React.Dispatch<SetStateAction<string>>;
  networks: Array<any>;
  fetchIssuerMetaData: () => Promise<void>;
  fetchOperator: () => Promise<void>;
  profile?: {
    name: string;
    description?: string;
    logo?: string;
    website?: string;
    contact?: string;
  };
  numPublished: number;
  numHolder: number;
  operators: Array<any> | null;
  issuerID?: string;
}

export interface userDataType {
  title: string;
  idType?: string;
  name: string;
  countryOfResidence: string;
  nationality?: string;
  idNumber: string;
  gender: string;
  dateOfBirth: number;
  industry?: string;
  occupation?: string;
  paymentMode?: string;
  addresses?: Array<string>;
  primary?: boolean;
}
export interface userKYCDataType {
  [key: string]: unknown;
}

export interface KYCConTextProps {
  activeStep: number;
  setActiveStep: React.Dispatch<React.SetStateAction<number>>;
  setUserData: React.Dispatch<React.SetStateAction<userKYCDataType>>;
  userData: userKYCDataType;
  frontImageFile: any;
  setFrontImageFile: React.Dispatch<React.SetStateAction<any>>;
  selfieFile: any;
  setSelfieFile: React.Dispatch<React.SetStateAction<any>>;
  VIDEO_WIDTH: any;
  VIDEO_HEIGHT: any;
  faceBox: facialBoxType;
  noseBox: facialBoxType;
  token: string;
  startChallenge: (userId: string) => Promise<void>;
  challengeId: string;
  kycUserId: string;
  setMetadata: React.Dispatch<SetStateAction<kycMetadataType>>;
  metaData: kycMetadataType;
}
interface facialBoxType {
  top: number;
  left: number;
  width: number;
  height: number;
}
export interface kycMetadataType {
  issuerId: string;
  title: string;
  issuerName: string;
  description: string;
  logoUrl: string;
  schemaHash: string;
}
