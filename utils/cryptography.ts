import {
  createCipheriv,
  createDecipheriv,
  pbkdf2Sync,
  randomBytes,
} from "crypto";

export const generateIV = (key: string) => {
  const salt = randomBytes(16);
  return pbkdf2Sync(key, salt, 100000, 512, "sha512").toString("base64");
};

export const generateKeyAndIv = () => {
  const key = randomBytes(36).toString("base64");
  const iv = randomBytes(8).toString("base64");
  return {
    key,
    iv,
  };
};
export const encryptWithRandomlyGeneratedKey = (plaintext: string) => {
  const { key, iv } = generateKeyAndIv();
  const cipher = createCipheriv("aes-256-gcm", key, iv);
  const paddedCipher =
    cipher.update(plaintext, "utf8", "base64") + cipher.final("base64");
  return {
    cipher: paddedCipher,
    key: JSON.stringify({ key, iv }),
  };
};

export const decryptCipherWithKey = (cipher: string, keyAndIv: string) => {
  const decodedKeyAndIv = Buffer.from(keyAndIv, "base64").toString("utf8");
  const { key, iv } = JSON.parse(decodedKeyAndIv);
  const decipher = createDecipheriv("aes-256-gcm", key, iv);
  return decipher.update(cipher, "base64", "utf8") + decipher.final("utf8");
};
