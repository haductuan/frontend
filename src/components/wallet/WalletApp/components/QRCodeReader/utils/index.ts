import { zidenPortal } from "src/client/api";
import KeyContainer from "src/utils/key-container/keyContainer";

/**
 * 
 * @data format: {
    "attest": {
        "version": "0",
        "action": "attest",
        "uri": "<service_id>",
        "data": {}
    },
    "request": {
        "version": "0",
        "action": "request",
        "uri": "<registry_id>",
        "data": {}
    },
    "retrieve": {
        "version": "0",
        "action": "retrieve",
        "uri": "claim_id",
        "data": {
            "issuerId": ""
        }
    },
    "verify": {
        "version": "0",
        "action": "verify",
        "uri": "<proof_request_id>",
        "data": {
            "verifierId": "",
            "proofs": [{}]
        }
    }
}
 */
export enum QRACTION {
  ATTEST = "attest",
  REQUEST = "request",
  RETRIEVE = "retrieve",
  VERIFY = "verify",
}
export interface JsonDataType {
  version: string;
  action: string;
  uri: string;
  data: any;
}

export const handleReadedQRcode = async (
  history: any,
  data: string,
  keyContainer: KeyContainer,
  userId: string,
  checkUserType: any,
  qrCodeData: any,
  setQrCodeData: any
) => {
  try {
    const jsonData = JSON.parse(data) as JsonDataType;
    switch (jsonData.action) {
      case QRACTION.ATTEST:
        history.push(`/holder/services/attestation/${jsonData.uri}`);
        break;
      case QRACTION.REQUEST:
        history.push(`/holder/identity/provider/request/${jsonData.uri}`);
        break;
      case QRACTION.RETRIEVE:
        await handleQRClaim(
          jsonData.uri,
          keyContainer,
          userId,
          checkUserType
        );
        history.push("/holder/identity");
        break;
      case QRACTION.VERIFY:
        setQrCodeData(jsonData);
        history.push(`/holder/identity/verification/${jsonData.uri}`);
        break;
      default:
        throw Error("Wrong format");
    }
  } catch (err) {
    throw Error("Wrong data format");
  }
};
const handleQRClaim = async (
  claimId: string,
  keyContainer: KeyContainer,
  userId: string,
  checkUserType: any,
) => {
  try {
    const claimData = (await zidenPortal.get(`claims?claimIds=${claimId}`))
      ?.data[0];
    const libsodium = keyContainer.getCryptoUtil();
    const stringData = JSON.stringify({
      claim: claimData?.entry,
      rawData: claimData?.data,
    });
    const saveData = JSON.stringify({
      claimId: claimData?.claimId || "",
      claim: stringData,
      schemaHash: claimData?.schema?.schemaHash || "",
      issuerID: claimData?.issuer?.issureId || "",
    });
    const dataEncrypted = keyContainer.encryptWithDataKey(saveData);
    const localDB = keyContainer.db;
    localDB.insert(`ziden-user-claims/${claimData?.claimId}`, dataEncrypted);
    
  } catch (err) {
    console.log(err);
  }
};
