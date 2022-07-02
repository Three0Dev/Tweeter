export function getBlockchainType() {
  switch (globalThis.projectConfig.chainType) {
    case 'NEAR_TESTNET':
      return 'testnet';
    default:
      throw Error(`Unconfigured chainType '${globalThis.projectConfig.chainType}'`);
  }
}

export function getPID() {
  return globalThis.projectId;
}

export function getQueryParams(){
  return new URLSearchParams(location.search);
}