const nodeExternals = require('webpack-node-externals');

module.exports = {
  webpack: (
    config,
    {
      buildId, dev, isServer, defaultLoaders, nextRuntime, webpack,
    },
  ) => {
    if (isServer) {
      config.target = 'node';

      config.node = {
        __dirname: true,
        global: true,
        __filename: true,
      };

      config.externals = [nodeExternals()], // in order to ignore all modules in node_modules folder
      config.externalsPresets = {
        node: true, // in order to ignore built-in modules like path, fs, etc.
      };
    }

    return config;
  },
};
