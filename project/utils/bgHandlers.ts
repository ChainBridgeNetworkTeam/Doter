/*
 * @Author: dianluyuanli-wp
 * @LastEditors: dianluyuanli-wp
 * @Date: 2021-06-01 22:38:54
 * @LastEditTime: 2021-06-02 23:44:30
 */
// Copyright 2019-2021 @polkadot/extension authors & contributors
// SPDX-License-Identifier: Apache-2.0
//@polkadot//../types
import type { MessageTypes, TransportRequestMessage } from '@polkadot/extension-base/background/types';

import { assert } from '@polkadot/util';
import { PORT_EXTENSION } from '@polkadot/extension-base/defaults';
import Extension from '@polkadot/extension-base/background/handlers/Extension';
import State from '@polkadot/extension-base/background/handlers/State';
import Tabs from '@polkadot/extension-base/background/handlers/Tabs';

const state = new State();
const extension = new Extension(state);
const tabs = new Tabs(state);

export default function handler<TMessageType extends MessageTypes> ({ id, message, request }: TransportRequestMessage<TMessageType>, port: chrome.runtime.Port, extensionPortName = PORT_EXTENSION): void {
    const isExtension = port.name === extensionPortName;
  const sender = port.sender as chrome.runtime.MessageSender;
  const from = isExtension
    ? 'extension'
    : (sender.tab && sender.tab.url) || sender.url || '<unknown>';
  const source = `${from}: ${id}: ${message}`;

  console.log(` [in] ${source}`); // :: ${JSON.stringify(request)}`);

  const promise = isExtension
    ? extension.handle(id, message, request, port)
    : tabs.handle(id, message, request, from, port);

  promise
    .then((response): void => {
      console.log(`[out] ${source}`); // :: ${JSON.stringify(response)}`);

      // between the start and the end of the promise, the user may have closed
      // the tab, in which case port will be undefined
      assert(port, 'Port has been disconnected');

      port.postMessage({ id, response, isDoter: true });
    })
    .catch((error: Error): void => {
      console.log(`[err] ${source}:: ${error.message}`);

      // only send message back to port if it's still connected
      if (port) {
        port.postMessage({ error: error.message, id, isDoter: true });
      }
    });
}
