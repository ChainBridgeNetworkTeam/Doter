/*
 * @Author: your name
 * @Date: 2021-04-22 09:01:57
 * @LastEditTime: 2021-04-24 14:32:31
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /Doter/jest.config.js
 */
// module.exports = {
//   preset: 'ts-jest',
//   testEnvironment: 'node',
//   transform: {
//     '^.+\\[t|j]sx?$': "ts-jest"
//   },
//   "transform": {
//     "node_modules/@polkadot/.+\\.(j|t)sx?$": "ts-jest"
//   },
//   "transformIgnorePatterns": [
//     "node_modules/(?!@polkadot/.*)"
//   ],
//   "moduleNameMapper": {
//     //"\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": "<rootDir>/__mocks__/fileMock.js",
//     "\\.(css|less|scss|sass)$": "identity-obj-proxy",
//     "^@utils(.*)$": "<rootDir>/project/utils$1",
//     "^@widgets(.*)$": "<rootDir>/project/entry/widgets$1",
//     "^@entry(.*)$": "<rootDir>/project/entry$1",
//     "^@constants(.*)$": "<rootDir>/project/constants$1",
//     "@polkadot/(.*).js$": "<rootDir>/node_modules/@polkadot/$1.cjs"
//   },
// };

const config = require('@polkadot/dev/config/jest.cjs');

module.exports = {
  ...config,
  moduleNameMapper: {
    //'@polkadot/extension-(base|chains|dapp|inject|ui)(.*)$': '<rootDir>/packages/extension-$1/src/$2',
    // eslint-disable-next-line sort-keys
    // '@polkadot/extension(.*)$': '<rootDir>/packages/extension/src/$1',
    //'\\.(css|less|scss)$': 'empty/object',
    "^@utils(.*)$": "<rootDir>/project/utils$1",
    "^@widgets(.*)$": "<rootDir>/project/entry/widgets$1",
    "^@entry(.*)$": "<rootDir>/project/entry$1",
    "^@constants(.*)$": "<rootDir>/project/constants$1",
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/__mocks__/fileMock.js'
  },
  modulePathIgnorePatterns: [
  ],
  transformIgnorePatterns: ['/node_modules/(?!(@polkadot|@babel/runtime/helpers/esm/))']
};