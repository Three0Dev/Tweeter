module.exports = {
  webpack: (
    config,
    {
      buildId, dev, isServer, defaultLoaders, nextRuntime, webpack,
    },
  ) => {
    if(isServer) {
      config.node = {
        __dirname: true,
      };
    }

    config.resolve.fallback = {
      './fetch.node': require.resolve('three0-js-sdk/node_modules/ipfs-utils/src/http/fetch.node'),
    };

    return config;
  },
};
