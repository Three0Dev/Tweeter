import { CONTRACT_NAME, PID } from "./config";


export async function initAuth(){
    if(!isLoggedIn()) return;
        
    if(window[CONTRACT_NAME]){
        window[CONTRACT_NAME] = false;
        window.walletConnection.signOut()
        return;
    }

    if(!(await window.contract.user_exists({project_id: PID, account_id: this.getAccountId()}))){
        try {
            await window.contract.create_user({project_id: PID});
        } catch (e) {
            console.error(e)
            throw e
        }
    }


    const user = await window.contract.get_user({project_id: PID, account_id: this.getAccountId()});
    if(!user.is_online){
        window[CONTRACT_NAME] = true;
        try {
            await window.contract.user_action({
                project_id: PID,
                action: "LOGIN"
            })
        }
        catch (e) {
            console.error(e)
            throw e
        }
    }
}

export function getAccountId(){
    return window.walletConnection.getAccountId();
}

export function isLoggedIn(){
    return window.walletConnection.isSignedIn();
}

export async function logout() {
    try{
        window[CONTRACT_NAME] = false;
        await window.contract.user_action({
            project_id: PID,
            action: "LOGOUT"
        })
        window.walletConnection.signOut()
    } catch(e){
        console.error(e)
        throw e
    }
}
      
export function login(appName = "My Three0 App",successURL = window.location.href, failureURL = window.location.href) {
    // Allow the current app to make calls to the specified contract on the
    // user's behalf.
    // This works by creating a new access key for the user's account and storing
    // the private key in localStorage.
    window[CONTRACT_NAME] = false;
    // console.log(successURL)
    window.walletConnection.requestSignIn(CONTRACT_NAME, appName, successURL, failureURL)
}
