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
  const { enqueueSnackbar } = useSnackbar();
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
    ]
  );
  return (
    <IdWalletContext.Provider value={IdWalletContextData}>
      {children}
    </IdWalletContext.Provider>
  );
}
export const useIdWalletContext = () => React.useContext(IdWalletContext);
