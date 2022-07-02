import { isValidDatabase } from './utils';

class CounterDatabase {
  #database;

  constructor(database) {
    this.#database = database;
  }

  get() {
    return this.#database.value;
  }

  async inc(amt = 1) {
    if (!(amt instanceof Number && amt >= 1)) throw Error('Valid amount is required');

    const incrementPromises = [];
    for (let i = 0; i < amt; i += 1) {
      incrementPromises.push(this.#database.inc());
    }

    await Promise.all(incrementPromises);
  }
}

// eslint-disable-next-line import/prefer-default-export
export const getCounter = async (orbitdb, address) => {
  if (!orbitdb) throw Error('OrbitDB is not initialized');
  const isValid = await isValidDatabase(address);
  if (!isValid) throw Error('Invalid database address');

  const database = await orbitdb.counter(address);
  return new CounterDatabase(database);
};
