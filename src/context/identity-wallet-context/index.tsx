import React, { useCallback, ReactNode } from "react";
import { useMemo, useState } from "react";
import LocalStorageDB, {
  deleteAllwithKey,
  getAllUserClaim,
} from "src/utils/db/localStorageDb";
import KeyContainer from "src/utils/key-container/keyContainer";
import { userType } from "src/constants";
import { zidenBackup } from "src/client/api";
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
  const checkForDek = React.useCallback(async () => {
    const userId = await getZidenUserID();
    const res = await zidenBackup.get(`/holder?holderId=${userId}`);
    if (res.data.data.error) {
      return false;
    } else {
      return res.data?.data?.dek;
    }
  }, [getZidenUserID]);

  const backup = React.useCallback(async () => {
    
    const userId = await getZidenUserID();
    const libsodium = keyContainer.getCryptoUtil();
    const keys = keyContainer.generateKeyForBackup();
    //get encryption key (dek)
    let dek = await checkForDek();
    if (!dek) {
      //dek not exist
      dek = keyContainer.generateDekForBackup();
      const dekEncode = libsodium.crypto_box_seal(
        dek,
        libsodium.from_hex(keys?.publicKey),
        "hex"
      );
      //post to server
      await zidenBackup.post("/holder", {
        holderId: userId,
        dek: dekEncode,
      });
    } else {
      // dek exist:
      //decode dek
      dek = libsodium.crypto_box_seal_open(
        libsodium.from_hex(dek),
        libsodium.from_hex(keys.publicKey),
        libsodium.from_hex(keys.privateKey),
        "text"
      );
    }
    const allClaims = getAllUserClaim();
    if (allClaims.length === 0) {
      enqueueSnackbar("You have no claims to backup!", {
        autoHideDuration: 1000,
        variant: "info",
      });
      return;
    }
    const allClaimDecrypted = allClaims.map((item) => {
      const dataDecrypted = keyContainer.decryptWithDataKey(
        item.claimEncrypted
      );
      return {
        id: item.id,
        claim: JSON.parse(dataDecrypted).claim,
        issuerID: JSON.parse(dataDecrypted).issuerID,
        schemaHash: JSON.parse(dataDecrypted).schemaHash,
      };
    });
    const allClaimBackedup = allClaimDecrypted.map((claimData: any) => {
      const id = claimData.id;
      const issuerId = claimData.issuerID;
      const nonce = libsodium.randombytes_buf(
        libsodium.crypto_box_NONCEBYTES,
        "hex"
      );
      const dataEncode = libsodium.crypto_secretbox_easy(
        JSON.stringify(claimData),
        libsodium.from_hex(nonce),
        libsodium.from_hex(dek),
        "hex"
      );
      return zidenBackup.post("backup?type=ZIDEN", {
        holderId: userId,
        issuerId: issuerId,
        claimId: id,
        data: dataEncode,
        nonce: nonce,
      });
    });
    Promise.allSettled(allClaimBackedup).then((res) => {
      let fail = 0;
      for (let i = 0; i < res.length; i++) {
        if (res[i].status === "fulfilled") {
          continue;
        } else {
          fail += 1;
        }
      }
      if (fail === 0) {
        enqueueSnackbar("Backup success!", {
          variant: "success",
        });
        setOpen(false);
      } else {
        enqueueSnackbar(`Backup failed ${fail} claims`, {
          variant: "error",
        });
      }
    });
    
  }, [
    checkForDek,
    keyContainer,
    enqueueSnackbar,
    getZidenUserID,
  ]);

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
      backup,
      checkForDek,
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
      backup,
      checkForDek,
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
