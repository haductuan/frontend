const _sodium = require("libsodium-wrappers");
export var sodium: any;
_sodium.ready.then(() => {
  sodium = _sodium;
});

export function encrypt_and_prepend_nonce(key: Uint8Array, message: string) {
  let nonce = sodium.randombytes_buf(sodium.crypto_secretbox_NONCEBYTES);
  const encrypted = sodium.crypto_secretbox_easy(message, nonce, key);
  const fullMessage = new Uint8Array(nonce.length + encrypted.length);
  fullMessage.set(nonce);
  fullMessage.set(encrypted, nonce.length);
  return sodium.to_hex(fullMessage);
}

export function generate_randombytes_buf(length: number) {
  const randomBytes = sodium.randombytes_buf(length);
  return randomBytes;
}
// decrypt using lib sodium
export function decrypt_after_extracting_nonce(
  key: Uint8Array,
  EncryptedMessage: string
) {
  const nonce_and_cipherText = sodium.from_hex(EncryptedMessage);
  if (
    nonce_and_cipherText.length <
    sodium.crypto_secretbox_NONCEBYTES + sodium.crypto_secretbox_MACBYTES
  ) {
    throw Error("Short message");
  }
  let nonce = nonce_and_cipherText.slice(0, sodium.crypto_secretbox_NONCEBYTES),
    cipherText = nonce_and_cipherText.slice(sodium.crypto_secretbox_NONCEBYTES);
  const decryptedMessageBuffer = sodium.crypto_secretbox_open_easy(
    cipherText,
    nonce,
    key
  );
  const decryptedMessage = Buffer.from(
    sodium.to_hex(decryptedMessageBuffer),
    "hex"
  ).toString();
  return decryptedMessage;
}
