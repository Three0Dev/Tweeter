import { isValidDatabase } from './utils';

class KVDatabase {
  #database;

  constructor(database) {
    this.#database = database;
  }

  instance() {
    return this.#database;
  }

  get(key) {
    if (!(key && key instanceof String)) throw Error('Key is required');
    return this.#database.get(key);
  }

  getAll() {
    return this.#database.all;
  }

  async set(key, value) {
    if (!(key && key instanceof String)) throw Error('Key is required');
    return this.#database.put(key, value);
  }

  async delete(key) {
    if (!(key && key instanceof String)) throw Error('Key is required');
    return this.#database.delete(key);
  }
}

// eslint-disable-next-line import/prefer-default-export
export const getKeyValue = async (orbitdb, address) => {
  if (!orbitdb) throw Error('OrbitDB is not initialized');
  const isValid = await isValidDatabase(address);
  if (!isValid) throw Error('Invalid database address');

  const database = await orbitdb.keyvalue(address);
  return new KVDatabase(database);
};
