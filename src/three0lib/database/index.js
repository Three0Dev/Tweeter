/* eslint-disable class-methods-use-this */
import IdentityProvider from 'orbit-db-identity-provider';
import { keyStores } from 'near-api-js';
import OrbitDB from 'orbit-db';
import { sha256 } from 'js-sha256';
import { NEAR } from '../blockchain';
import { initIPFS } from './ipfs';
import {
  Counter,
  DocStore,
  EventLog,
  Feed,
  KeyValue,
} from './wrappers';
import { isLoggedIn } from '../auth';

const convertToBitArray = (data) => Uint8Array.from(sha256.array(data));

class NearIdentityProvider extends IdentityProvider {
  // return type
  static get type() {
    return 'NearIdentity';
  }

  // return identifier of external id (eg. a public key)
  async getId() {
    return globalThis.accountId;
  }

  // return a signature of data (signature of the OrbitDB public key)
  async signIdentity(data) {
    const NEAR_CONFIG = NEAR.getNearConfig();

    const dataBuffer = convertToBitArray(data);
    const keyStore = new keyStores.BrowserLocalStorageKeyStore();
    const keyPair = await keyStore.getKey(NEAR_CONFIG.networkId, globalThis.accountId);
    return keyPair.sign(dataBuffer).signature;
  }

  // return true if identity.signatures are valid
  static async verifyIdentity(identity) {
    const NEAR_CONFIG = NEAR.getNearConfig();

    const keyStore = new keyStores.BrowserLocalStorageKeyStore();
    const keyPair = await keyStore.getKey(NEAR_CONFIG.networkId, globalThis.accountId);
    return keyPair.verify(
      convertToBitArray(identity.publicKey + identity.signatures.id),
      identity.signatures.publicKey,
    );
  }
}

let orbitdb;

// Start OrbitDB
export const initOrbitDB = async () => {
  const ipfs = await initIPFS();

  const loggedIn = isLoggedIn();

  if (loggedIn) {
    if (globalThis.projectConfig.chainType.includes('NEAR')) {
      IdentityProvider.addIdentityProvider(NearIdentityProvider);
      const identity = await IdentityProvider.createIdentity({ type: 'NearIdentity' });

      orbitdb = await OrbitDB.createInstance(ipfs, { identity });
    }
  }

  if (!orbitdb) {
    orbitdb = await OrbitDB.createInstance(ipfs);
  }
};

export function getCounter (address) {
  return Counter.getCounter(orbitdb, address);
}

export function getDocStore (address) {
  return DocStore.getDocStore(orbitdb, address);
}

export function getEventLog (address) {
  return EventLog.getEventLog(orbitdb, address);
}

export function getFeed (address) {
  return Feed.getFeed(orbitdb, address);
}

export function getKeyValue (address) {
  return KeyValue.getKeyValue(orbitdb, address);
}
