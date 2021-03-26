// Copyright 2019-2021 @polkadot/extension authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Message } from '@polkadot/extension-base/types';

import { PORT_CONTENT } from '@polkadot/extension-base/defaults';
import chrome from '@polkadot/extension-inject/chrome';

// connect to the extension
const port = chrome.runtime.connect({ name: PORT_CONTENT });

// send any messages from the extension back to the page
port.onMessage.addListener((data): void => {
  window.postMessage({ ...data, origin: 'content' }, '*');
});

// all messages from the page, pass them to the extension
window.addEventListener('message', ({ data, source }: Message): void => {
  // only allow messages from our window, by the inject
  if (source !== window || data.origin !== 'page') {
    return;
  }

  port.postMessage(data);
});

// inject our data injector
const script = document.createElement('script');

//  注入到dapp页面的js文件
script.src = chrome.extension.getURL('injectScript.js');

script.onload = (): void => {
  // remove the injecting tag when loaded
  if (script.parentNode) {
    script.parentNode.removeChild(script);
  }
};

(document.head || document.documentElement).appendChild(script);

//  这里是以前的老文件

// const actionMap = {
//     setStorage: function(input, sendRes) {
//         return new Promise((res, rej) => {
//             chrome.storage.sync.set(input, function() {
//                 console.log('set success');
//                 Init();
//                 res(void 0);
//             });
//         })
//     },
//     getStorage: function(input, sendRes) {
//         return new Promise((res, rej) => {
//             chrome.storage.sync.get(input, function(ans) {
//                 console.log(ans, 'get success');
//                 res(ans);
//             });
//         })
//     },
//     removeStorage: function(input) {
//         return new Promise((res, rej) => {
//             chrome.storage.sync.remove(input, function() {
//                 res();
//             });
//         })
//     }
// }

// let chromeStorage = {};
// async function Init() {
//     const dataObj = await actionMap.getStorage({
//         accountAddress: [],
//         favoriteAccount: '',
//         recipientArr: [],
//         local_config: {
//             language: 'english',
//             autoLockTime: Infinity,
//             lastInSTM: 0
//         }
//     });
//     const { accountAddress } = dataObj;
//     let queryObj = {};
//     accountAddress.forEach(item => {
//         queryObj[item] = {};
//     })
//     let ansObj = await actionMap.getStorage(queryObj);
//     chromeStorage = Object.assign({}, ansObj, dataObj);
//     console.log(chromeStorage, 'hahah')
// }
// Init();

// //  这个api貌似对异步支持的不好，await之后sendResponse直接返回undefined，
// chrome.runtime.onMessage.addListener(async function(request, sender, sendResponse)
// {
// 	// console.log(sender.tab ?"from a content script:" + sender.tab.url :"from the extension");
// 	// if(request.cmd == 'test') alert(request.value);
//     const { method, payLoad } = request || {};
//     let ans = {};
//     if (method === 'getStorage') {
//         for(let key in payLoad) {
//             if(payLoad.hasOwnProperty(key)) {
//                 ans[key] = chromeStorage[key];
//             }
//         }
//         sendResponse(ans);
//     } else {
//         actionMap[method](payLoad);
//     }
// });

//  manifest里面的配置

// "content_scripts": 
// [
//   {
//     "matches": ["<all_urls>"],
//     "js": ["contentScript.js"],
//     "run_at": "document_start"
//   }
// ],