/*
 * @Author: dianluyuanli-wp
 * @LastEditors: dianluyuanli-wp
 * @Date: 2021-04-06 23:45:39
 * @LastEditTime: 2021-06-04 08:23:08
 */
// Copyright 2019-2021 @polkadot/extension authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Message } from '@polkadot/extension-base/types';

//  import { redirectIfPhishing } from '@polkadot/extension-base/page';
import { injectExtension } from '@polkadot/extension-inject';
//  doter's enable function
import { enable, handleResponse, redirectIfPhishing } from '@utils/injectEnable';
import manifest from '../../plugin/manifest.json';

// setup a response listener (events created by the loader for extension responses)
window.addEventListener('message', ({ data, source }: Message & { data: { isDoter: boolean }}): void => {
  // only allow messages from our window, by the loader
  if (source !== window || data.origin !== 'content') {
    return;
  }

  if (data.id) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (data.id.includes('d') && data.isDoter) {
      handleResponse(data as any);
    }
  } else {
    console.error('Missing id for response.');
  }
});

redirectIfPhishing().then((gotRedirected) => {
  if (!gotRedirected) {
    inject();
  }
}).catch((e) => {
  console.warn(`Unable to determine if the site is in the phishing list: ${(e as Error).message}`);
  inject();
});

function inject () {
  console.log('enter enable');
  injectExtension(enable, {
    name: 'Doter',
    version: manifest.version
  });
}
