import axios from "axios";

const ZIDEN_BACKEND_SERVICE = process.env.REACT_APP_PORTAL_SERVICE;

const ISSUER_SERVER_ADDRESS = process.env.REACT_APP_ISSUER_SERVICE;

const VERIFIER_SERVER_ADDRESS = process.env.REACT_APP_VERIFIER_SERVICE;

const ZIDEN_BACKUP_ADDRESS = process.env.REACT_APP_BACKUP_SERVICE;

const ZIDEN_ISSUER = process.env.REACT_APP_ISSUER_SERVICE;

const ZIDEN_KYC_ADDRESS = process.env.REACT_APP_KYC_SERVICE;

const ZIDEN_PORTAL_SERVICE = process.env.REACT_APP_PORTAL_SERVICE;
export const zidenBackend = axios.create({
  baseURL: ZIDEN_BACKEND_SERVICE,
});
export const zidenIssuer = axios.create({
  baseURL: ISSUER_SERVER_ADDRESS,
});
export const zidenVerifier = axios.create({
  baseURL: VERIFIER_SERVER_ADDRESS,
});
export const zidenBackup = axios.create({
  baseURL: ZIDEN_BACKUP_ADDRESS,
});
export const zidenPortal = axios.create({
  baseURL: ZIDEN_PORTAL_SERVICE,
});
export const zidenIssuerNew = axios.create({
  baseURL: ZIDEN_ISSUER,
});
export const zidenKYC = axios.create({
  baseURL: ZIDEN_KYC_ADDRESS,
});
