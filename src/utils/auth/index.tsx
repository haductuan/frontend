import axios from "axios";

export const validateJWZ = async (endpointUrl: string, role?: string) => {
  const id = localStorage.getItem(`ziden-db/${role}-id`);
  const jwz = localStorage.getItem(`ziden-db/${role}-jwz`);
  const jwzValidationRes = await axios.post(
    endpointUrl + `/auth/verify-token/${id}`,
    {
      token: jwz,
    }
  );
  if (!jwzValidationRes.data?.isValid) {
    localStorage.removeItem(`ziden-db/${role}-jwz`);
    localStorage.removeItem(`ziden-db/${role}-id`);
    return false;
  } else {
    return true;
  }
};

export interface Proof {
  pi_a: string[];
  pi_b: string[][];
  pi_c: string[];
  protocol: string;
}

export interface ZKProof {
  proof: Proof;
  public_signals: string[];
}

export interface Header {
  algorithm: string;
  circuitId: string;
  schema: string;
}

export class JWZ {
  zkProof: ZKProof = {} as ZKProof;
  header: Header;
  payload: string;
  constructor(
    _algorithm: string,
    _circuitId: string,
    _schema: string,
    _payload: string
  ) {
    this.header = {
      algorithm: _algorithm,
      circuitId: _circuitId,
      schema: _schema,
    };
    this.payload = _payload;
  }

  static parse(base64Token: string): JWZ {
    let part = base64Token.split(".");
    if (part.length !== 3) {
      throw Error("Token must contain 3 part");
    } else {
      let header = JSON.parse(Buffer.from(part[0], "base64").toString("utf-8"));
      let payload = Buffer.from(part[1], "base64").toString("utf-8");
      let zkp = JSON.parse(Buffer.from(part[2], "base64").toString("utf-8"));
      let token = new JWZ(
        header.algorithm,
        header.circuitId,
        header.schema,
        payload
      );
      token.zkProof = zkp;
      return token;
    }
  }

  getIssuer(): string {
    if (!this.zkProof.proof || !this.zkProof.public_signals) {
      throw Error("Invalid zkProof");
    } else {
      return BigInt(this.zkProof.public_signals[4]).toString(16);
    }
  }
}
