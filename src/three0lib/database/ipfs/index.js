import * as IPFS from 'ipfs-core';

let ipfs;

const IPFS_CONFIG = {
  ipfs: {
    preload: {
      enabled: false,
    },
    config: {
      Addresses: {
        Swarm: [
          '/dns4/wrtc-star1.par.dwebops.pub/tcp/443/wss/p2p-webrtc-star/',
          '/dns4/wrtc-star2.sjc.dwebops.pub/tcp/443/wss/p2p-webrtc-star/',
          '/dns4/webrtc-star.discovery.libp2p.io/tcp/443/wss/p2p-webrtc-star/',
        ],
      },
    },
  },
};

const initIPFS = async () => {
  if (ipfs) return ipfs;
  ipfs = await IPFS.create(IPFS_CONFIG.ipfs);
  return ipfs;
};

export {
  // eslint-disable-next-line import/prefer-default-export
  initIPFS,
};
