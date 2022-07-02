/* eslint-disable no-unused-vars */
import { isValidDatabase } from './utils';

class FeedDatabase {
  #database;

  constructor(database) {
    this.#database = database;
  }

  instance() {
    return this.#database;
  }

  get(key) {
    if (!(key && key instanceof String)) throw Error('Key is required');
    return this.#database.get(key).map((e) => e.payload.value);
  }

  add(value) {
    return this.#database.add(value);
  }

  // TODO Should we implement this?
  getAll() {
    return this.#database.all;
  }

  // TODO Check if put creates a new entry for pre-exisiting ID
  async set(key, value) {
    if (!(key && key instanceof String)) throw Error('Key is required');
    return this.#database.put(key, value);
  }
}

// eslint-disable-next-line import/prefer-default-export
export const getFeed = async (orbitdb, address) => {
  throw Error('Not implemented');

  //   if (!orbitdb) throw Error('OrbitDB is not initialized');
  //   const isValid = await isValidDatabase(address);
  //   if (!isValid) throw Error('Invalid database address');

//   const database = await orbitdb.log(address);
//   return new FeedDatabase(database);
};
