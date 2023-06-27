import {
  utils as zidenjsUtils,
  auth,
  db as zidenjsDb,
  smt,
  state,
  schema as zidenjsSchema,
  OPERATOR,
  queryMTP,
  Query,
  claim as zidenjsClaim,
} from "@zidendev/zidenjs";
import axios from "axios";
import { levelDbSrc } from "./common/config/constant.js";
import { GlobalVariables } from "./common/config/global.js";
import { deserializaDataClaim } from "./util/utils.js";
import fs from "fs-extra";
import path from "path";

// @ts-ignore
import * as snarkjs from "snarkjs";

const schema = {
  "@name": "abc",
  "@type": "schema",
  "@context": [],
  address: {
    "@id": "std-pos:val-1",
    "@type": "std:str",
  },
  gender: {
    "@id": "std-pos:val-2",
    "@type": "std:int",
  },
  "@hash": "1770341995493656456557367336455397",
  "@id": "d64bee16-680c-4367-b5b9-aef7854d75c3",
};
const claimId = "094b0341-8c26-4e38-9682-0dcc0603d28d";
const claim = {
  entry: [
    "200005748db8042c345841d44a90d4ce5",
    "270059ac9d3cd04a5999745ebf5fcd3fe5c0aec96231c234c65dc3d400000",
    "0",
    "0",
    "5",
    "0",
    "13a0cdca53de102930194208fb53dcaf",
    "7b",
  ],
  data: {
    address: "123",
    gender: 123,
  },
};

function parseInput(kycMtp: any) {
  const kycMtpInput: any = {};
  Object.keys(kycMtp).forEach((key) => {
    if (typeof kycMtp[key] == "string") {
      kycMtpInput[key] = BigInt(kycMtp[key]);
    } else {
      kycMtpInput[key] = [];
      kycMtp[key].forEach((val: string) => {
        kycMtpInput[key].push(BigInt(val));
      });
    }
  });

  return kycMtpInput;
}

async function testQueryMtp() {
  await GlobalVariables.init();
  const privateKeyHex = "873466168417834";
  // const privateKeyHex = "12345";

  const privatkey = zidenjsUtils.hexToBuffer(privateKeyHex, 32);

  const authClaim = auth.newAuthFromPrivateKey(privatkey);
  const dbPath = "db/test-2";

  const claimsDb = new zidenjsDb.SMTLevelDb(dbPath + `/${levelDbSrc}/claims`);
  const claimRevDb = new zidenjsDb.SMTLevelDb(
    dbPath + `/${levelDbSrc}/claimRev`
  );
  const authsDb = new zidenjsDb.SMTLevelDb(dbPath + `/${levelDbSrc}/auths`);

  const userTree = await state.State.generateState(
    [authClaim],
    authsDb,
    claimsDb,
    claimRevDb
  );

  const userId = zidenjsUtils.bufferToHex(userTree.userID);
  // const userId = "270059ac9d3cd04a5999745ebf5fcd3fe5c0aec96231c234c65dc3d400000";

  // console.log(userId);

  const kycMtp = (
    await axios.get(
      `http://localhost:3000/api/v1/claims/${claimId}/proof?type=mtp`
    )
  ).data.kycQueryMTPInput;

  const kycNonceRev = (
    await axios.get(
      `http://localhost:3000/api/v1/claims/${claimId}/proof?type=nonRevMtp`
    )
  ).data.kycQueryMTPInput;

  const kycMtpInput: any = {};
  Object.keys(kycMtp).forEach((key) => {
    if (typeof kycMtp[key] == "string") {
      kycMtpInput[key] = BigInt(kycMtp[key]);
    } else {
      kycMtpInput[key] = [];
      kycMtp[key].forEach((val: string) => {
        kycMtpInput[key].push(BigInt(val));
      });
    }
  });

  const kycNonceRevInput: any = {};
  Object.keys(kycNonceRev).forEach((key) => {
    if (typeof kycNonceRev[key] == "string") {
      kycNonceRevInput[key] = BigInt(kycNonceRev[key]);
    } else {
      kycNonceRevInput[key] = [];
      kycNonceRev[key].forEach((val: string) => {
        kycNonceRevInput[key].push(BigInt(val));
      });
    }
  });

  const slot = zidenjsSchema.schemaPropertiesSlot(schema);
  const claimEntry = deserializaDataClaim(claim.entry);

  const query: Query = {
    slotIndex: slot["gender"].slot,
    operator: OPERATOR.EQUAL,
    values: [BigInt(123)],
    valueTreeDepth: 6,
    from: slot["gender"].begin,
    to: slot["gender"].end,
    timestamp: 0,
    claimSchema: BigInt(schema["@hash"]),
  };

  const witness = await queryMTP.holderGenerateQueryMTPWitnessWithPrivateKey(
    claimEntry,
    privatkey,
    authClaim,
    BigInt(1),
    userTree,
    kycMtpInput,
    kycNonceRevInput,
    query
  );

  // get jwz token
  const operatorResponse = (
    await axios.request({
      url: `http://localhost:3000/api/v1/issuers/${userId}/operators/${userId}`,
    })
  ).data;

  const claimLoginId = operatorResponse.claimId;
  const claimLogin = zidenjsClaim.newClaim(
    zidenjsClaim.schemaHashFromBigInt(BigInt("123456789")),
    zidenjsClaim.withValueData(
      zidenjsUtils.numToBits(BigInt(operatorResponse.role), 32),
      zidenjsUtils.numToBits(BigInt(0), 32)
    ),
    zidenjsClaim.withIndexData(
      zidenjsUtils.hexToBuffer(userId, 32),
      zidenjsUtils.hexToBuffer(userId, 32)
    ),
    zidenjsClaim.withIndexID(zidenjsUtils.hexToBuffer(userId, 32)),
    zidenjsClaim.withRevocationNonce(BigInt(operatorResponse.revNonce)),
    zidenjsClaim.withVersion(BigInt(operatorResponse.version))
  );
  const loginqueryMtp = (
    await axios.get(
      `http://localhost:3000/api/v1/auth/proof/${claimLoginId}?type=mtp`
    )
  ).data.kycQueryMTPInput;
  const loginnonRevMtp = (
    await axios.get(
      `http://localhost:3000/api/v1/auth/proof/${claimLoginId}?type=nonRevMtp`
    )
  ).data.kycQueryMTPInput;
  const challenge = "123456789";

  const loginquery: Query = {
    slotIndex: 6,
    operator: OPERATOR.EQUAL,
    values: [BigInt(operatorResponse.role)],
    valueTreeDepth: 6,
    from: 0,
    to: 100,
    timestamp: Date.now(),
    claimSchema: zidenjsUtils.bitsToNum(claimLogin.getSchemaHash()),
  };
  const inputlogin = await queryMTP.holderGenerateQueryMTPWitnessWithPrivateKey(
    claimLogin,
    privatkey,
    authClaim,
    BigInt(challenge),
    userTree,
    parseInput(loginqueryMtp),
    parseInput(loginnonRevMtp),
    loginquery
  );

  const queryPath = "build/credentialAtomicQueryMTP";
  const zkeyPath = `${queryPath}/credentialAtomicQueryMTP.zkey`;
  const wasmPath = `${queryPath}/credentialAtomicQueryMTP.wasm`;

  const { proof: proofLogin, publicSignals: publicSignalsLogin } =
    await snarkjs.groth16.fullProve(inputlogin, wasmPath, zkeyPath);

  const jwzToken = (
    await axios.request({
      method: "post",
      url: `http://localhost:3000/api/v1/auth/login/${userId}`,
      data: {
        proof: proofLogin,
        public_signals: publicSignalsLogin,
        circuitId: "string",
        schema: "string",
        algorithm: "string",
        payload: "string",
      },
    })
  ).data.token;

  const lastTestState = (
    await axios.request({
      url: `http://localhost:3000/api/v1/issuers/${userId}/auth-path`,
      headers: {
        Authorization: jwzToken,
      },
    })
  ).data;

  const lastState = parseInput(lastTestState);

  const witness2 = {
    ...witness,
  };

  // witness2.userAuthMtp = lastState.authMTP;
  // witness2.userAuthsRoot = lastState.authsRoot;
  witness2.userClaimsRoot = lastState.claimsRoot;
  witness2.userClaimRevRoot = lastState.claimRevRoot;
  witness2.userState = lastState.expectedState;

  console.log(witness2.userState);

  const { proof, publicSignals } = await snarkjs.groth16.fullProve(
    witness2,
    wasmPath,
    zkeyPath
  );

  const x = {
    proof: proof,
    publicData: publicSignals,
  };

  const verificationKey = JSON.parse(
    fs.readFileSync(path.resolve(`${queryPath}/verification_key.json`), "utf-8")
  );

  const result = await snarkjs.groth16.verify(
    verificationKey,
    publicSignals,
    proof
  );
  console.log(result);

  const verifyResponse = (
    await axios.request({
      url: "http://localhost:5000/api/v1/proofs/verify",
      method: "post",
      data: {
        networkId: "97",
        zkProofs: [x],
      },
    })
  ).data;
  console.log(verifyResponse);
}

testQueryMtp();
