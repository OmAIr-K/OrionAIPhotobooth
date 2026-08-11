module.exports = {
    webpackDevServer: (config) => {
      config.watchOptions = {
        ignored: ['**/public/outputs/**'],
      };
      return config;
    },
  };
  