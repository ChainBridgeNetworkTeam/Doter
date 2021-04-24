/*
 * @Author: your name
 * @Date: 2021-04-24 15:01:37
 * @LastEditTime: 2021-04-24 15:07:01
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: /Doter/testBableConfig/babel-presets.cjs
 */
// Copyright 2017-2021 @polkadot/dev authors & contributors
// SPDX-License-Identifier: Apache-2.0

const resolver = require('@polkadot/dev/config/babel-resolver.cjs');

const CONFIG_CJS = {
  modules: 'commonjs',
  targets: {
    browsers: '>0.25% and last 2 versions and not ie 11 and not OperaMini all',
    node: '12'
  }
};

const CONFIG_ESM = {
  modules: false,
  targets: {
    node: 'current'
  }
};

module.exports = function (isEsm) {
  return resolver([
    '@babel/preset-typescript',
    ['@babel/preset-react', {
      development: false,
      runtime: 'automatic'
    }],
    ['@babel/preset-env', isEsm ? CONFIG_ESM : CONFIG_CJS]
  ]);
};
