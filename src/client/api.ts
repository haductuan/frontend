import axios from "axios";

const ZIDEN_BACKEND_SERVICE = process.env.REACT_APP_PORTAL_SERVICE;

const ISSUER_SERVER_ADDRESS = process.env.REACT_APP_ISSUER_SERVICE;

const ZIDEN_ISSUER = process.env.REACT_APP_ISSUER_SERVICE;

const ZIDEN_KYC_ADDRESS = process.env.REACT_APP_KYC_SERVICE;

export const backendServer = axios.create({
  baseURL: ZIDEN_BACKEND_SERVICE,
});
export const issuerServer = axios.create({
  baseURL: ISSUER_SERVER_ADDRESS,
});
export const issuerServerNew = axios.create({
  baseURL: ZIDEN_ISSUER,
});
export const zidenKYC = axios.create({
  baseURL: ZIDEN_KYC_ADDRESS,
});
