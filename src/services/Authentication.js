import {AUTH} from '../three0_lib'

function handleSignIn() {
  AUTH.login(
    "Tweeter",
    `${window.location.origin}/home`,
    `${window.location.origin}/`
  );
}

async function handleSignOut() {
  await AUTH.logout();
}

export { handleSignIn, handleSignOut };
