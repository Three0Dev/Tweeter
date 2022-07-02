import { getPID, getQueryParams } from '../utils';
import { providers } from 'near-api-js';
import { getNearConfig } from '../blockchain/NEAR';

export async function initAuth() {
  const nearConfig = getNearConfig();
  const provider = new providers.JsonRpcProvider(
		`https://archival-rpc.${nearConfig.networkId}.near.org`
	)

  const queryParams = getQueryParams();

  const result = await provider.txStatus(queryParams.get("transactionHashes"), globalThis.accountId)
  console.log(result);

  // TODO: check if the transaction is valid

  await globalThis.contract.user_action({
    project_id: getPID(),
    action: 'LOGIN',
  });
}

export function isLoggedIn() {
  return globalThis.walletConnection.isSignedIn();
}

export function getAccountId() {
  return globalThis.walletConnection.getAccountId();
}

export async function logout() {
  try {
    await globalThis.contract.user_action({
      project_id: getPID(),
      action: 'LOGOUT',
    });
    globalThis.walletConnection.signOut();
  } catch (e) {
    console.error(e);
    throw e;
  }
}

export async function login(
  appName = 'My Three0 App',
  successUrL = window.location.href,
  failureUrL = window.location.href,
) {
  globalThis.walletConnection.requestSignIn(
    globalThis.projectConfig.contractName,
    appName,
    successUrL,
    failureUrL,
  );
}
