/* eslint-disable import/prefer-default-export */

import {
    connect, Contract, keyStores, WalletConnection,
  } from 'near-api-js';
import { getBlockchainType } from './utils';
  
  // Initialize contract & set global variables
  export async function initContract(projectConfig) {
    const nearConfig = getNearConfig(projectConfig);
  
    // Initialize connection to the NEAR testnet
    const near = await connect({
      deps: { keyStore: new keyStores.BrowserLocalStorageKeyStore() },
      ...nearConfig,
    });
  
    // Initializing Wallet based Account. It can work with NEAR testnet wallet that
    // is hosted at https://wallet.testnet.near.org
    globalThis.walletConnection = new WalletConnection(near);
  
    // Getting the Account ID. If still unauthorized, it's just empty string
    globalThis.accountId = globalThis.walletConnection.getAccountId();
  
    // Initializing our contract APIs by contract name and configuration
    globalThis.contract = new Contract(globalThis.walletConnection.account(), nearConfig.contractName, {
      // View methods are read only. They don't modify the state, but usually return some value.
      viewMethods: ['user_exists', 'get_user', 'valid_database'],
      // Change methods can modify the state. But you don't receive the returned value when called.
      changeMethods: ['create_user', 'user_action'],
    });
  }
  
  export function getNearConfig(env) {
    const CONTRACT_NAME = env.contractName;
  
    switch (getBlockchainType("NEAR_TESTNET")) {
      case 'production':
      case 'mainnet':
        return {
          networkId: 'mainnet',
          nodeUrl: 'https://rpc.mainnet.near.org',
          contractName: CONTRACT_NAME,
          walletUrl: 'https://wallet.near.org',
          helperUrl: 'https://helper.mainnet.near.org',
          explorerUrl: 'https://explorer.mainnet.near.org',
        };
      case 'development':
      case 'testnet':
        return {
          networkId: 'testnet',
          nodeUrl: 'https://rpc.testnet.near.org',
          contractName: CONTRACT_NAME,
          walletUrl: 'https://wallet.testnet.near.org',
          helperUrl: 'https://helper.testnet.near.org',
          explorerUrl: 'https://explorer.testnet.near.org',
        };
      case 'betanet':
        return {
          networkId: 'betanet',
          nodeUrl: 'https://rpc.betanet.near.org',
          contractName: CONTRACT_NAME,
          walletUrl: 'https://wallet.betanet.near.org',
          helperUrl: 'https://helper.betanet.near.org',
          explorerUrl: 'https://explorer.betanet.near.org',
        };
      case 'local':
        return {
          networkId: 'local',
          nodeUrl: 'http://localhost:3030',
          keyPath: `${process.env.HOME}/.near/validator_key.json`,
          walletUrl: 'http://localhost:4000/wallet',
          contractName: CONTRACT_NAME,
        };
      case 'test':
      case 'ci':
        return {
          networkId: 'shared-test',
          nodeUrl: 'https://rpc.ci-testnet.near.org',
          contractName: CONTRACT_NAME,
          masterAccount: 'test.near',
        };
      case 'ci-betanet':
        return {
          networkId: 'shared-test-staging',
          nodeUrl: 'https://rpc.ci-betanet.near.org',
          contractName: CONTRACT_NAME,
          masterAccount: 'test.near',
        };
      default:
        throw Error(
          `Unconfigured environment '${env}'. Can be configured in src/config.js.`,
        );
    }
  }