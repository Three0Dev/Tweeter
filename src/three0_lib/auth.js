import { getPID } from "./utils";
import { CONTRACT_NAME } from "./NEAR"

export function isLoggedIn() {
  return globalThis.walletConnection.isSignedIn();
}

export async function initAuth() {
//   if (!isLoggedIn()) return;

//   if (globalThis[CONTRACT_NAME]) {
//     globalThis[CONTRACT_NAME] = false;
//     globalThis.walletConnection.signOut();
//     return;
//   }

//   if (
//     !(await globalThis.contract.user_exists({
//       project_id: getPID(),
//       account_id: this.getAccountId(),
//     }))
//   ) {
//     try {
//       await globalThis.contract.create_user({ project_id: getgetPID()() });
//     } catch (e) {
//       console.error(e);
//       throw e;
//     }
//   }

//   const user = await globalThis.contract.get_user({
//     project_id: getPID(),
//     account_id: this.getAccountId(),
//   });
//   if (!user.is_online) {
//     globalThis[CONTRACT_NAME] = true;
//     try {
//       await globalThis.contract.user_action({
//         project_id: getPID(),
//         action: 'LOGIN',
//       });
//     } catch (e) {
//       console.error(e);
//       throw e;
//     }
//   }
}

export function getAccountId() {
  return globalThis.walletConnection.getAccountId();
}

export async function logout() {
  try {
    // globalThis[CONTRACT_NAME] = false;
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
  successURL = window.location.href,
  failureURL = window.location.href + '/home',
) {
  // Allow the current app to make calls to the specified contract on the
  // user's behalf.
  // This works by creating a new access key for the user's account and storing
  // the private key in localStorage.
//   globalThis[CONTRACT_NAME] = false;
  // console.log(successURL)
  await window.contract.user_action({
    project_id: getPID(),
    action: "LOGIN",
  })
  globalThis.walletConnection.requestSignIn(
    CONTRACT_NAME,
    appName,
    successURL,
    failureURL,
  );
}