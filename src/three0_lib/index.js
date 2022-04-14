import { initContract } from './utils'
import { setContractName, setPID } from './config'
import * as Database from './database'
import * as Auth from './auth'

const init = async (projectConfig) => {
    setContractName(projectConfig.contractName)
    setPID(projectConfig.projectId)

    await initContract()
    await Auth.initAuth()

    if(Auth.isLoggedIn()){
        let ipfs = await Database.initIPFS()
        await Database.initOrbitDB(ipfs);
    }
}

export {
    Database as DB,
    Auth as AUTH,
    init
}