import { NEAR } from './blockchain';
import * as Database from './database';
import * as Auth from './auth';

const init = async (projectConfig) => {
  globalThis.projectConfig = projectConfig;

  switch (projectConfig.chainType) {
    case 'NEAR_TESTNET':
      await NEAR.init();
      break;
    default:
      throw Error(`Unconfigured chainType '${projectConfig.chainType}'`);
  }

  await Auth.initAuth();
  await Database.initOrbitDB();
};

export {
  Database as DB,
  Auth as AUTH,
  init,
};
