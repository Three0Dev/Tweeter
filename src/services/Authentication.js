import {AUTH} from '../three0_lib'

function handleSignIn() {
  AUTH.login({
    successURL: '/home',
  });
}

async function handleSignOut() {
  await AUTH.logout();
}

export { handleSignIn, handleSignOut };
