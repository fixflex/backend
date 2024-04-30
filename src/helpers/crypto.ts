import * as CryptoJS from 'crypto-js';

const encrypt = (data: string, key: string): string => {
  return CryptoJS.TripleDES.encrypt(data, key).toString();
};

const decrypt = (encryptedData: string, key: string): string => {
  const bytes = CryptoJS.TripleDES.decrypt(encryptedData, key);
  return bytes.toString(CryptoJS.enc.Utf8);
};

export { encrypt, decrypt };
