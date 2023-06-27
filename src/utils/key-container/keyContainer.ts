import LocalStorageDB from "../db/localStorageDb";
import * as bip39 from "bip39";
import { generate_randombytes_buf, sodium } from "./cryptographyUtils";
import {
  encrypt_and_prepend_nonce,
  decrypt_after_extracting_nonce,
} from "./cryptographyUtils";

//zidenjs
import {
  db as zidenjsDb,
  utils as zidenjsUtils,
  auth,
  state,
  Auth,
} from "@zidendev/zidenjs";
import {
  AUTH_LVLDB_PATH,
  CLAIM_LVLDB_PATH,
  CLAIM_REV_LVLDB_PATH,
  WALLET_LOCKED_MESSAGE,
  ZIDEN_LEVEL_DB_PATH,
  AUTH_REV_NONCE_DB_PATH,
  CLAIM_REV_NONCE_DB_PATH,
  NO_PRIVATEKEY_MESSAGE,
} from "./config";

//generate key
const hdkey = require("hdkey");
const pbkdf2 = require("pbkdf2");
//level DB
const authDb = new zidenjsDb.SMTLevelDb(
  `${ZIDEN_LEVEL_DB_PATH}/${AUTH_LVLDB_PATH}`
);
const claimsDb = new zidenjsDb.SMTLevelDb(
  `${ZIDEN_LEVEL_DB_PATH}/${CLAIM_LVLDB_PATH}`
);
const claimsRevDb = new zidenjsDb.SMTLevelDb(
  `${ZIDEN_LEVEL_DB_PATH}/${CLAIM_REV_LVLDB_PATH}`
);

export default class KeyContainer {
  name: string;
  encryptionKey: Uint8Array;
  db: any;
  timer: any;
  constructor(db: any) {
    this.name = "ziden";
    this.encryptionKey = new Uint8Array();
    if (db) {
      this.db = db;
    } else {
      this.db = new LocalStorageDB(this.name);
    }
    this.timer = {};
  }

  unlock(password: string) {
    const passwordHash = pbkdf2.pbkdf2Sync(password, "salt", 256, 32, "sha512"); // password hash in buffer
    this.encryptionKey = passwordHash;
    clearTimeout(this.timer);
    const self = this;
    this.timer = setTimeout(() => {
      console.log("key expired");
      self.encryptionKey = new Uint8Array();
    }, 28800000);
  }
  getEncryptionKey(password: string) {
    const passwordHash = pbkdf2.pbkdf2Sync(password, "salt", 256, 32, "sha512"); // password hash in buffer
    return passwordHash;
  }
  isUnlock() {
    if (this.encryptionKey.length !== 0) {
      return true;
    }
    return false;
  }
  lock() {
    if (!this.encryptionKey) {
      return;
    }
    clearTimeout(this.timer);
    // key container locked
    this.encryptionKey = new Uint8Array();
  }
  encrypt(message: string) {
    if (!this.isUnlock()) {
      throw Error(WALLET_LOCKED_MESSAGE);
    }
    return encrypt_and_prepend_nonce(this.encryptionKey, message);
  }
  encryptWithDataKey(message: string) {
    if (!this.isUnlock()) {
      throw Error(WALLET_LOCKED_MESSAGE);
    }
    const dataKey = this.db.get("ziden-data-key");
    if (!dataKey) {
      console.log("Data key not exist");
      return;
    }
    const dataKeyDecrypted = this.decrypt(dataKey);
    return encrypt_and_prepend_nonce(
      Buffer.from(dataKeyDecrypted, "hex"),
      message
    );
  }
  encryptAndStore(message: string, key: string) {
    if (!this.isUnlock()) {
      throw Error(WALLET_LOCKED_MESSAGE);
    }
    try {
      this.db.insert(key, this.encrypt(message));
      return true;
    } catch (err) {
      return false;
    }
  }
  encryptAndStoreWithDataKey(message: string, key: string) {
    if (!this.isUnlock()) {
      throw Error(WALLET_LOCKED_MESSAGE);
    }
    try {
      this.db.insert(key, this.encryptWithDataKey(message));
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  }
  decryptFromDB(key: string) {
    if (!this.isUnlock()) {
      return "";
    }
    const encrypted = this.db.get(key);
    if (!encrypted) {
      console.log("field empty");
      return "";
    }
    try {
      return this.decrypt(encrypted);
    } catch (err) {
      console.log(err);
      return "";
    }
  }
  decrypt(EncryptedMessage: string) {
    if (!this.isUnlock()) {
      return "";
    }
    //return decrypt(this.encryptionKey, EncryptedMessage);
    return decrypt_after_extracting_nonce(this.encryptionKey, EncryptedMessage);
  }
  decryptWithDataKey(EncryptedMessage: string) {
    if (!this.isUnlock()) {
      throw Error(WALLET_LOCKED_MESSAGE);
    }
    const dataKey = this.db.get("ziden-data-key");
    if (!dataKey) {
      throw Error("Data key doesn't exist");
    }
    const dataKeyDecrypted = this.decrypt(dataKey);
    return decrypt_after_extracting_nonce(
      Buffer.from(dataKeyDecrypted, "hex"),
      EncryptedMessage
    );
  }
  decryptWithKey(key: Uint8Array, message: string) {
    //return decrypt(key, message);
    return decrypt_after_extracting_nonce(key, message);
  }
  generateMasterSeed() {
    if (!this.isUnlock()) {
      throw Error(WALLET_LOCKED_MESSAGE);
    }
    const mnemonic = bip39.generateMnemonic();
    return mnemonic;
  }
  setMasterSeed(InputMnemonic: string) {
    if (!this.isUnlock()) {
      throw Error(WALLET_LOCKED_MESSAGE);
    }
    let mnemonic;
    if (InputMnemonic) {
      if (bip39.validateMnemonic(InputMnemonic)) {
        mnemonic = InputMnemonic;
        this.db.insert("ziden-user-masterseed", this.encrypt(mnemonic));
      } else {
        throw Error("Invalid mnemonic");
      }
    } else {
      mnemonic = bip39.generateMnemonic();
      this.db.insert("ziden-user-masterseed", this.encrypt(mnemonic));
    }
  }
  getMasterSeedDecrypted() {
    if (!this.isUnlock()) {
      throw Error(WALLET_LOCKED_MESSAGE);
    }
    const masterSeedEncrypted = this.db.get("ziden-user-masterseed");
    if (masterSeedEncrypted === undefined) {
      throw Error("Mnemonic desn't exist");
    } else {
      return this.decrypt(masterSeedEncrypted);
    }
  }
  getMasterSeed() {
    const masterSeedEncrypted = this.db.get("ziden-user-masterseed");
    if (masterSeedEncrypted === undefined) {
      throw Error("Master seed not exist!");
    } else {
      return masterSeedEncrypted;
    }
  }
  generateKeyFromSeed(masterSeed: string) {
    if (!this.isUnlock()) {
      throw Error(WALLET_LOCKED_MESSAGE);
    }
    const masterSeedBuffer = Buffer.from(masterSeed, "utf-8");
    const keyRoot = hdkey.fromMasterSeed(masterSeedBuffer);
    const keyPathRoot = "m/44'/0'/0";
    const Id = keyRoot.derive(keyPathRoot);
    const publicKey = Id._publicKey.toString("hex");
    this.db.insert("ziden-publicKeyEncrypted", this.encrypt(publicKey));
    const privateKey = Id._privateKey.toString("hex");
    this.db.insert("ziden-privateKeyEncrypted", this.encrypt(privateKey));
    return { publicKey: publicKey, privateKey: privateKey };
  }
  generateUserTree = async (authClaim: Auth) => {
    const userTree = await state.State.generateState(
      [authClaim],
      authDb,
      claimsDb,
      claimsRevDb
    );
    this.db.insert(CLAIM_REV_NONCE_DB_PATH, userTree.claimRevNonce);
    this.db.insert(AUTH_REV_NONCE_DB_PATH, userTree.authRevNonce);
    this.db.insert(
      "userID",
      this.encrypt(zidenjsUtils.bufferToHex(userTree.userID))
    );
  };
  generateDataKey() {
    const encryptionData = generate_randombytes_buf(32);
    const encryptionDataHex = Buffer.from(encryptionData).toString("hex");
    this.encryptAndStore(encryptionDataHex, "ziden-data-key");
  }
  /**
   * generate private key and build user tree from master seed
   * @param masterSeed
   */
  generateZidenKeyFromMasterSeed = async (masterSeed: string) => {
    if (!this.isUnlock()) {
      throw Error(WALLET_LOCKED_MESSAGE);
    }
    const masterSeedBuffer = Buffer.from(masterSeed, "utf-8");
    const keyRoot = hdkey.fromMasterSeed(masterSeedBuffer);
    const keyPathRoot = "m/44'/0'/0";
    const Id = keyRoot.derive(keyPathRoot);
    const privateKeyBuff = Id._privateKey;
    const privateKeyHex = zidenjsUtils.bufferToHex(privateKeyBuff);
    this.db.insert("ziden-privateKeyEncrypted", this.encrypt(privateKeyHex));
    const authClaim = await auth.newAuthFromPrivateKey(privateKeyBuff);
    await this.generateUserTree(authClaim);
    this.generateDataKey();
  };
  /**
   * generate private key and build user tree from private key
   * @param privateKey
   */
  generateZidenKeyFromPrivateKey = async (privateKey: string) => {
    const privateKeyBuff = zidenjsUtils.hexToBuffer(privateKey, 32);
    this.db.insert("ziden-privateKeyEncrypted", this.encrypt(privateKey));
    const authClaim = await auth.newAuthFromPrivateKey(privateKeyBuff);
    await this.generateUserTree(authClaim);
    this.generateDataKey();
  };
  /**
   * generate auth claim from public key
   * @param publicKey
   */
  generateZidenKeyFromPublicKey = async (publicKey: Array<any>) => {
    if (!this.isUnlock()) {
      throw Error(WALLET_LOCKED_MESSAGE);
    }
    const authClaim: Auth = {
      authHi: BigInt(0),
      pubKey: {
        X: BigInt(publicKey[0]),
        Y: BigInt(publicKey[1]),
      },
    };
    await this.generateUserTree(authClaim);
    this.generateDataKey();
  };
  /**
   * generate key pair for encrypt - decrypt claim from server
   * @returns
   */
  generateKeyForClaim = () => {
    if (sodium) {
      const { publicKey, privateKey } = sodium.crypto_box_keypair();
      return {
        publicKey,
        privateKey,
      };
    } else {
      return null;
    }
  };
  /**
   * generate hex key pair for encrypt - decrypt claim from server
   * @return {
        publicKey,
        privateKey,
      }
   */
  generateHexKeyForClaim = () => {
    if (sodium) {
      const {
        publicKey,
        privateKey,
      }: { publicKey: string; privateKey: string } =
        sodium.crypto_box_keypair("hex");
      return {
        publicKey,
        privateKey,
      };
    } else {
      return null;
    }
  };
  getCryptoUtil = () => {
    if (sodium) {
      return sodium;
    } else {
      return null;
    }
  };
  /**
   * get user id from local storage
   * @returns
   */
  getUserID = () => {
    if (!this.isUnlock()) {
      throw Error(WALLET_LOCKED_MESSAGE);
    }
    const userIDDecrypted = this.db.get("userID");
    return this.decrypt(userIDDecrypted);
  };
  /**
   * get auth claim from private key stored in local storage
   * @return auth claim
   */
  getAuthClaims: () => Auth = () => {
    if (this.isUnlock()) {
      const privateKeyHex = this.getKeyDecrypted().privateKey;
      if (privateKeyHex) {
        const privateKeyBuff = zidenjsUtils.hexToBuffer(privateKeyHex, 32);
        const authClaim = auth.newAuthFromPrivateKey(privateKeyBuff);
        return authClaim;
      } else {
        throw Error(NO_PRIVATEKEY_MESSAGE);
      }
    } else {
      throw Error(WALLET_LOCKED_MESSAGE);
    }
  };
  /**
   * recover current user tree
   * @return user tree
   */
  getUserTree = async () => {
    if (!this.isUnlock()) {
      throw Error(WALLET_LOCKED_MESSAGE);
    }
    const authClaim = await this.getAuthClaims();
    const userTree = await state.State.generateState(
      [authClaim],
      authDb,
      claimsDb,
      claimsRevDb
    );
    return userTree;
  };
  /**
   * get encrypted private key from local storage
   * @returns
   */
  getKeys() {
    const privateKeyEncrypted = this.db.get("ziden-privateKeyEncrypted");
    return {
      privateKeyEncrypted,
    };
  }
  /**
   * get private key
   * @returns
   */
  getKeyDecrypted() {
    if (!this.isUnlock()) {
      throw Error(WALLET_LOCKED_MESSAGE);
    }
    const { privateKeyEncrypted } = this.getKeys();
    return {
      privateKey: this.decrypt(privateKeyEncrypted),
    };
  }
  /**
   * recover user data (user tree, private key, etc.) from master seed
   * @param masterSeed
   */
  recoverFromMasterSeed(masterSeed: string) {
    if (!this.isUnlock()) {
      throw Error(WALLET_LOCKED_MESSAGE);
    }
    this.setMasterSeed(masterSeed);
    this.generateZidenKeyFromMasterSeed(masterSeed);
  }
  /**
   * generate dek (key for encrypt backup claim)
   * @returns
   */
  generateDekForBackup() {
    if (!this.isUnlock()) {
      throw Error(WALLET_LOCKED_MESSAGE);
    }
    const libsodium = this.getCryptoUtil();
    const dek = libsodium.crypto_secretbox_keygen("hex");
    return dek;
  }
  /**
   * generate key pair for backup claim
   * @returns
   */
  generateKeyForBackup(): {
    privateKey: string;
    publicKey: string;
  } {
    if (!this.isUnlock()) {
      throw Error(WALLET_LOCKED_MESSAGE);
    }
    const key = this.getKeyDecrypted();
    if (!key) {
      throw Error(NO_PRIVATEKEY_MESSAGE);
    }
    const libsodium = this.getCryptoUtil();
    let privHex = key.privateKey;
    while (privHex.length < 64) {
      privHex = "0" + privHex;
    }
    const publicKeyHex = libsodium.crypto_scalarmult_base(
      libsodium.from_hex(privHex),
      "hex"
    );
    return {
      privateKey: privHex,
      publicKey: publicKeyHex,
    };
  }
}
