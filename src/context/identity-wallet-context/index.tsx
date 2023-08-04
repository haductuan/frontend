import React, { useCallback, ReactNode } from "react";
import { useMemo, useState } from "react";
import LocalStorageDB, {
  deleteAllwithKey,
  getAllUserClaim,
} from "src/utils/db/localStorageDb";
import KeyContainer from "src/utils/key-container/keyContainer";
import { userType } from "src/constants";
import { useSnackbar } from "notistack";
import { IdentityWalletContextProps } from "src/context/context";
import { issuerServer } from "src/client/api";

const IdWalletContext = React.createContext<IdentityWalletContextProps>(
  undefined as any
);
export function IdentityWalletProvider({ children }: { children: ReactNode }) {
  const [isNewUser, setIsNewUser] = useState(true);
  const [userId, setUserId] = useState<string>("");
  const [createIdMethod, setCreateIdMethod] = useState(0);
  const keyContainer: KeyContainer = React.useMemo(() => {
    return new KeyContainer(new LocalStorageDB("ziden-db"));
  }, []);
  const [qrCodeData, setQrCodeData] = useState<any>({});
  const [open, setOpen] = useState<boolean>(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const localDB = useMemo(() => {
    return new LocalStorageDB("ziden-db");
  }, []);
  const getZidenUserID = useCallback(async () => {
    if (keyContainer !== undefined) {
      try {
        const fullID = keyContainer.decryptFromDB("userID");
        return fullID;
      } catch (err) {
        return "";
      }
    } else {
      return "";
    }
  }, [keyContainer]);
  const updateUserData = useCallback(async () => {
    const userId = localDB.get("userID");
    // console.log(keyContainer.getKeyDecrypted());
    const mobilePrivateKey = localStorage.getItem("mobile-private-key");
    const mobilePasscode = localStorage.getItem("mobile-hash-passcode");
    if (userId) {
      setIsNewUser(false);
      const userId = await getZidenUserID();
      setUserId(userId);
      if (mobilePasscode) {
        keyContainer.unlock(mobilePasscode);
      }
    } else {
      if (mobilePrivateKey) {
        keyContainer.unlock(mobilePasscode || "");
        keyContainer.generateZidenKeyFromPrivateKey(mobilePrivateKey);
        setIsNewUser(false);
      } else {
        setIsNewUser(true);
        setCreateIdMethod(0);
      }
    }
    setIsUnlocked(keyContainer.isUnlock());
  }, [localDB, keyContainer, getZidenUserID]);
  const goBack = () => {
    setCreateIdMethod(0);
  };
  const logout = useCallback(() => {
    localDB.delete("auth-claim");
    localDB.delete("userID");
    localDB.delete("rootsVersion");
    localDB.delete("ziden-privateKeyEncrypted");
    localDB.delete("ziden-publicKeyEncrypted");
    localDB.delete("ziden-user-masterseed");
    localDB.delete("revocationNonce");
    localDB.delete("ziden-data-key");
    localDB.delete("issuer-jwz");
    localDB.delete("issuer-id");
    localDB.delete("verifier-jwz");
    localDB.delete("verifier-id");
    deleteAllwithKey("ziden-db/ziden-user-claims");
    window.indexedDB.open("level-js-ziden/claims-tree-db", 1);
    window.indexedDB.deleteDatabase("level-js-ziden/claims-tree-db");
    window.indexedDB.open("level-js-ziden/revocation-tree-db", 1);
    window.indexedDB.deleteDatabase("level-js-ziden/revocation-tree-db");
    window.indexedDB.open("level-js-ziden/roots-tree-db", 1);
    window.indexedDB.deleteDatabase("level-js-ziden/roots-tree-db");
  }, [localDB]);
  const unlockWallet = useCallback(
    async (password: string) => {
      keyContainer.unlock(password);
      try {
        const id = await getZidenUserID();
        if (id === "") {
          keyContainer.lock();
          return false;
        } else {
          return true;
        }
      } catch (err) {
        keyContainer.lock();
        console.log(err);
        return false;
      }
    },
    [keyContainer, getZidenUserID]
  );
  const lockWallet = useCallback(() => {
    keyContainer.lock();
  }, [keyContainer]);
  const validatePassword = useCallback(
    async (password: string) => {
      if (!isUnlocked) {
        await updateUserData();
      } else {
        const enCryptionKey = keyContainer.getEncryptionKey(password);
        try {
          await keyContainer.decryptWithKey(
            enCryptionKey,
            keyContainer.db.get("ziden-data-key")
          );
          return true;
        } catch (err) {
          return false;
        }
      }
    },
    [isUnlocked, keyContainer, updateUserData]
  );
  const checkUserType = useCallback(() => {
    if (!localStorage.getItem("ziden-db/userID")) {
      return null;
    }
    if (
      localStorage.getItem("ziden-db/ziden-privateKeyEncrypted") &&
      localStorage.getItem("mobile-private-key") &&
      localStorage.getItem("mobile-hash-passcode")
    ) {
      return userType.mobile;
    }
    if (
      localStorage.getItem("ziden-db/ziden-privateKeyEncrypted") &&
      !localStorage.getItem("mobile-private-key") &&
      !localStorage.getItem("mobile-hash-passcode")
    ) {
      return userType.web;
    }
    return null;
  }, []);

  const syncClaim = React.useCallback(async () => {
    //@ts-ignore
    const userId = await getZidenUserID();
    console.log("🚀 ~ file: index.tsx:27 ~ handleSync ~ userId:", userId);

    const libsodium = keyContainer.getCryptoUtil();
    const keys = keyContainer.generateKeyForBackup();

    const allUserClaimEncode = (
      await issuerServer.get(`/claims/${userId}/retrieve-data`)
    ).data;

    let allUserClaimData: Array<any> = [];
    for (let i = 0; i < allUserClaimEncode.length; i++) {
      const element = allUserClaimEncode[i];
      const claimData = JSON.parse(
        libsodium.crypto_box_seal_open(
          libsodium.from_hex(element),
          libsodium.from_hex(keys.publicKey),
          libsodium.from_hex(keys.privateKey),
          "text"
        )
      );
      allUserClaimData.push(claimData);
    }

    // all user claim data
    // [ {claimId: id, claim: [entry], issuerId: id, rawData: stringJson, schemaHash: string} ]

    //check for backup
    if (allUserClaimData.length > 0) {
      const localClaimId = getAllUserClaim().map((item) => item.id);
      let allDataEncoded: any;
      const resultData = allUserClaimData
        ?.filter((item: any) => {
          //remove existed data
          return !localClaimId.includes(item.claimId);
        })
        .map((claim: any) => {
          return claim;
        });
      Promise.allSettled(resultData).then((res) => {
        allDataEncoded = res
          .map((data) => {
            if (data.status === "fulfilled") {
              try {
                const dataDecrypted = JSON.stringify({
                  claimId: data.value.claimId,
                  claim: JSON.stringify({
                    rawData: JSON.parse(data.value?.rawData),
                    claim: data.value?.claim,
                  }),
                  schemaHash: data.value?.schemaHash,
                  issuerID: data.value?.issuerId,
                });
                return { id: data.value?.claimId, data: dataDecrypted };
              } catch (err) {
                return false;
              }
            } else {
              return false;
            }
          })
          .filter((item) => item);
        for (let i = 0; i < allDataEncoded.length; i++) {
          const dataEncrypted = keyContainer.encryptWithDataKey(
            allDataEncoded[i].data
          );
          const localDB = keyContainer.db;
          if (localStorage.getItem("mobile-private-key")) {
            //@ts-ignore
            if (window.ReactNativeWebView) {
              //@ts-ignore
              window.ReactNativeWebView.postMessage(
                JSON.stringify({
                  type: "claim",
                  data: allDataEncoded[i].data,
                })
              );
            }
          }
          localDB.insert(
            `ziden-user-claims/${allDataEncoded[i].id}`,
            dataEncrypted
          );
        }
      });
    }
  }, [keyContainer, getZidenUserID]);
  const IdWalletContextData = useMemo(
    () => ({
      open,
      setOpen,
      isNewUser,
      setIsNewUser,
      createIdMethod,
      setCreateIdMethod,
      goBack,
      updateUserData,
      keyContainer,
      logout,
      isUnlocked,
      unlockWallet,
      lockWallet,
      getZidenUserID,
      checkUserType,
      validatePassword,
      userId,
      setQrCodeData,
      qrCodeData,
      syncClaim,
    }),
    [
      open,
      isNewUser,
      createIdMethod,
      keyContainer,
      logout,
      updateUserData,
      unlockWallet,
      lockWallet,
      isUnlocked,
      getZidenUserID,
      setOpen,
      setIsNewUser,
      validatePassword,
      checkUserType,
      userId,
      qrCodeData,
      syncClaim,
    ]
  );
  return (
    <IdWalletContext.Provider value={IdWalletContextData}>
      {children}
    </IdWalletContext.Provider>
  );
}
export const useIdWalletContext = () => React.useContext(IdWalletContext);
