export function getBlockchainType(chainType) {
  switch (chainType) {
    case 'NEAR_TESTNET':
      return 'testnet';
    default:
      throw Error(`Unconfigured chainType '${chainType}'`);
  }
}

export function getPID(){
    return globalThis.projectConfig.contractName.split('.')[0];
}