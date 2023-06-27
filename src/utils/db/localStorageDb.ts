const zidenData = [
  "auth-claim",
  "ziden-user-masterseed",
  "issuer-jwz",
  "userID",
  "rootsVersion",
  "ziden-privateKeyEncrypted",
  "ziden-data-key",
  "revocationNonce",
];

class LocalStorageDB {
  name: string;
  constructor(name: string) {
    if (name !== undefined) {
      this.name = name;
    } else {
      this.name = "DEFAULT_DB";
    }
  }
  insert(key: string, value: string) {
    localStorage.setItem(this.name + "/" + key, value);
    //@ts-ignore
    if (window.ReactNativeWebView) {
      let msg;
      if (zidenData.includes(key)) {
        msg = JSON.stringify({
          type: "ziden-data",
          data: {
            [this.name + "/" + key]: value,
          },
        });
      } else {
        msg = JSON.stringify({
          type: "claim",
          data: {
            [this.name + "/" + key]: value,
          },
        });
      }
      //@ts-ignore
      window.ReactNativeWebView.postMessage(msg);
    }
  }
  delete(key: string) {
    localStorage.removeItem(this.name + "/" + key);
  }
  get(key: string) {
    return localStorage.getItem(this.name + "/" + key);
  }
  deleteAll() {
    localStorage.clear();
    console.log("delete");
  }
}
export default LocalStorageDB;
export function getAllFromDB(dbname: string) {
  const allItems = Object.entries(localStorage);
  const regex = new RegExp(dbname + "*");
  const result = allItems
    .filter((item) => {
      return regex.test(item[0]);
    })
    .map((item) => {
      return {
        id: item[0].replaceAll(dbname + "/", ""),
        claimEncrypted: item[1],
      };
    });
  return result;
}
export function getAllUserClaim() {
  const allItems = getAllFromDB("ziden-db/ziden-user-claims");
  return allItems;
}
export function deleteAllwithKey(key: string) {
  const allItems = Object.entries(localStorage);
  const regex = new RegExp(key + "*");
  const result = allItems
    .filter((item) => {
      return regex.test(item[0]);
    })
    .map((item) => {
      localStorage.removeItem(item[0]);
      return item[0];
    });
  return result;
}
