/*
 * @Author: dianluyuanli-wp
 * @LastEditors: dianluyuanli-wp
 * @Date: 2021-04-06 23:45:39
 * @LastEditTime: 2021-05-13 23:37:45
 */
const webpack = require('webpack')
const library = '[name]_dll'
const path = require('path');
//  const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  entry: {
    vendors: ['react', 'mobx', 'mobx-react', 'antd', "@polkadot/api", "@polkadot/api-contract",
    "@polkadot/extension-base", "@polkadot/extension-chains", "@polkadot/extension-inject", "@polkadot/keyring",
    "@polkadot/metadata", "@polkadot/rpc-provider", "@polkadot/types", "@polkadot/ui-keyring", "@polkadot/util",
    "@polkadot/util-crypto", "@polkadot/wasm-crypto", "react-dom", 'file-saver', 
    "copy-to-clipboard", "qrcode", "umi-request", "react-router-dom", "react-i18next" 
    ]
  },

  output: {
    filename: '[name]_dll.js',
    path: path.resolve(__dirname, 'plugin/pop'),
    //publicPath: path.resolve(__dirname, 'dist'),
    //publicPath: './',
    //publicPath: 'http://localhost:3000/',
    library
  },

  plugins: [
    new webpack.DllPlugin({
      path: path.join(__dirname, 'plugin/pop/[name]-manifest.json'),
      // This must match the output.library option above
      name: library,
      context: __dirname
    }),
    // new BundleAnalyzerPlugin({
    //     analyzerPort: 8899
    // })
  ],
  mode:"production",
  //mode:"development",
}