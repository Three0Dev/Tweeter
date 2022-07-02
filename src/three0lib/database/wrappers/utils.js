import { isValidAddress } from 'orbit-db';

// eslint-disable-next-line import/prefer-default-export
export const isValidDatabase = async (address) => {
  if (!isValidAddress(address)) {
    return false;
  }

  const isProjectDatabase = await globalThis.contract.valid_database(address);
  return isProjectDatabase;
};

export function isValidKey(key){
  return key && typeof key === "string";
}

export function isValidValueObject(value){
  return value && value instanceof Object;
}