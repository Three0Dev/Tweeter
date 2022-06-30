import * as Three0 from "../three0_lib";

const config = {
    "contractName": "dev-1654358258368-10220982874835",
    "projectId": "project_0",
    "chainType": "NEAR_TESTNET",
};

export async function init() {
    await Three0.init(config);
};

export default Three0;