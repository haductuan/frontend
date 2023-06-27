import { KYCQueryMTPInput } from "@zidendev/zidenjs";

export const FormTypeMapping = (type: string) => {
  switch (type) {
    case "string":
    case "str":
      return "text";
    case "integer":
    case "int":
    case "int32":
      return "number";
    case "float":
      return "number";
    case "boolean":
    case "bool":
      return "checkbox";
    case "date":
      return "date";
    case "datetime":
      return "datetime-local";
    default:
      return "text";
  }
};
export const convertDataForServerType = (data: any, type: string) => {
  switch (type) {
    case "string":
      return data.toString();
    case "integer":
      return parseInt(data.toString());
    case "double":
      return parseInt(data.toString());
    case "date":
      return new Date(data.toString()).valueOf();
    case "datetime":
      return new Date(data.toString()).valueOf();
    case "boolean":
      return data ? true : false;
    default:
      return data.toString();
  }
};

export const parseLabel = (label: string) => {
  if (!label) {
    return "";
  }
  return (label[0].toLocaleUpperCase() + label.substring(1)).replaceAll(
    "-",
    " "
  );
};

export const dataTypeMaping = (type: string) => {
  switch (type) {
    case "std:str":
      return "text";
    case "std:int32":
      return "number";
    case "std:double":
      return "number";
    case "std:bool":
      return "checkbox";
    case "std:date":
      return "date";
    default:
      return "text";
  }
};

export const generateProof = async (witness: any) => {
  // @ts-ignore
  const witnessParsed = JSON.parse(
    JSON.stringify(
      witness,
      (key, value) => (typeof value === "bigint" ? value.toString() : value) // return everything else unchanged
    )
  );
  try {
    //checkUserType
    const { proof, publicSignals } =
      // @ts-ignore
      await window.snarkjs.groth16.fullProve(
        witnessParsed,
        "/query.wasm",
        "/query.zkey"
      );
    const data = {
      proof,
      publicSignals,
      witnessParsed,
    };
    return data;
  } catch (err: any) {
    console.log("err:" + err.message.toString());
  }
};
export const flattenData = (data: any) => {
  let flattenedRawData = data;
  for (const [key, value] of Object.entries(data)) {
    if (typeof value === "object") {
      for (const [key2, value2] of Object.entries(value as any)) {
        if (key2 !== "type") {
          flattenedRawData[`${key}-${key2}`] = value2;
        }
      }
    }
  }
  return flattenedRawData;
};
export const parseIssuerClaimMtp = (input: any) => {
  return {
    issuerClaimMtp: input.issuerClaimMtp.map((a: any) => BigInt(a)),
    issuerClaimAuthsRoot: BigInt(input.issuerClaimAuthsRoot),
    issuerClaimClaimsRoot: BigInt(input.issuerClaimClaimsRoot),
    issuerClaimClaimRevRoot: BigInt(input.issuerClaimClaimRevRoot),
    issuerClaimIdenState: BigInt(input.issuerClaimIdenState),
    issuerID: BigInt(input.issuerID),
  };
};
export const parseNonRevMtp = (input: any) => {
  return {
    issuerClaimNonRevMtp: input.issuerClaimNonRevMtp.map((item: any) =>
      BigInt(item)
    ),
    issuerClaimNonRevMtpNoAux: input.issuerClaimNonRevMtpNoAux,
    issuerClaimNonRevMtpAuxHi: input.issuerClaimNonRevMtpAuxHi,
    issuerClaimNonRevMtpAuxHv: input.issuerClaimNonRevMtpAuxHv,
    issuerClaimNonRevAuthsRoot: BigInt(input.issuerClaimNonRevAuthsRoot),
    issuerClaimNonRevClaimsRoot: BigInt(input.issuerClaimNonRevClaimsRoot),
    issuerClaimNonRevClaimRevRoot: BigInt(input.issuerClaimNonRevClaimRevRoot),
    issuerClaimNonRevState: BigInt(input.issuerClaimNonRevState),
  };
};
