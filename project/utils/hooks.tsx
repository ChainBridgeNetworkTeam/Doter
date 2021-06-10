/*
 * @Author: dianluyuanli-wp
 * @LastEditors: dianluyuanli-wp
 * @Date: 2021-05-30 11:40:46
 * @LastEditTime: 2021-05-30 15:01:08
 */

import type { Chain } from '@polkadot/extension-chains/types';

import { useEffect, useState } from 'react';

import { getMetadata } from '@utils/message/message';

/**
 * @Author: dianluyuanli-wp
 * @LastEditors: dianluyuanli-wp
 * @param {string} genesisHash
 * @param {boolean} isPartial
 * 获取存储在本地的目标元数据
 */
export function useMetadata (genesisHash?: string | null, isPartial?: boolean): Chain | null {
  const [chain, setChain] = useState<Chain | null>(null);

  useEffect((): void => {
    if (genesisHash) {
      getMetadata(genesisHash, isPartial)
        .then(setChain)
        .catch((error: Error): void => {
          console.error(error);
          setChain(null);
        });
    } else {
      setChain(null);
    }
  }, [genesisHash, isPartial]);

  return chain;
}
