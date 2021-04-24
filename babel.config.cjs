/*
 * @Author: your name
 * @Date: 2021-04-24 14:25:26
 * @LastEditTime: 2021-04-24 15:03:39
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /Doter/babel.config.cjs
 */

//module.exports = require('@polkadot/dev/config/babel-config-cjs.cjs');

// Copyright 2017-2021 @polkadot/dev authors & contributors
// SPDX-License-Identifier: Apache-2.0

// const general = require('./babel-general.cjs');
const plugins = require('./testBableConfig/babel-plugins.cjs');
const presets = require('./testBableConfig//babel-presets.cjs');

module.exports = {
  plugins: plugins(false, true),
  presets: presets(false)
};

