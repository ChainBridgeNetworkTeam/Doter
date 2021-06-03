/*
 * @Author: dianluyuanli-wp
 * @LastEditors: dianluyuanli-wp
 * @Date: 2021-04-06 23:45:39
 * @LastEditTime: 2021-06-02 23:45:26
 */
// Copyright 2019-2021 @polkadot/extension authors & contributors
// SPDX-License-Identifier: Apache-2.0

// Runs in the extension background, handling all keyring access

//  import handlers from '@polkadot/extension-base/background/handlers';
import handlers from '@utils/bgHandlers';
import { PORT_CONTENT, PORT_EXTENSION } from '@polkadot/extension-base/defaults';
import { AccountsStore } from '@polkadot/extension-base/stores';
import chrome from '@polkadot/extension-inject/chrome';
import keyring from '@polkadot/ui-keyring';
import { assert } from '@polkadot/util';
import { cryptoWaitReady } from '@polkadot/util-crypto';

// setup the notification (same a FF default background, white text)
chrome.browserAction.setBadgeBackgroundColor({ color: '#d90000' });

// listen to all messages and handle appropriately
chrome.runtime.onConnect.addListener((port): void => {
  // shouldn't happen, however... only listen to what we know about
  assert([PORT_CONTENT, PORT_EXTENSION].includes(port.name), `Unknown connection from ${port.name}`);
  // message and disconnect handlers
  port.onMessage.addListener((data): void => {
    if (data.id.includes('d')) {
      handlers(data, port)
    }
  });
  port.onDisconnect.addListener((): void => console.log(`Disconnected from ${port.name}`));
});

// initial setup
cryptoWaitReady()
  .then((): void => {
    console.log('crypto initialized');

    // load all the keyring data
    keyring.loadAll({
      store: new AccountsStore(),
      ss58Format: 0,
      type: 'ed25519'
    });

    console.log('initialization completed');
  })
  .catch((error): void => {
    console.error('initialization failed', error);
});

//  manifeast

// "background": {
//     "scripts": [
//       "background.js"
//     ],
//     "persistent": true
//   },
//   "content_scripts": [
//     {
//       "js": [
//         "content.js"
//       ],
//       "matches": [
//         "http://*/*",
//         "https://*/*"
//       ],
//       "run_at": "document_start"
//     }
//   ],
//   "web_accessible_resources": [
//     "injectScript.js"
//   ],
