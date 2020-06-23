const path = require('path');
const MomentLocalesPlugin = require('moment-locales-webpack-plugin');

module.exports = {
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src/'),
      // '@@': path.resolve(__dirname, 'src/components/'),
    },
  },
  devServer: {
    hot: true,
    watchOptions: {
      aggregateTimeout: 300,
      poll: true,
    },
  },
  plugins: [
    new MomentLocalesPlugin({
      localesToKeep: ['en-us'],
    }),
  ],
};
