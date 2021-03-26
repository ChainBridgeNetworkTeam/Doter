/*
 * @Author: guanlanluditie 
 * @Date: 2021-02-03 11:36:18 
 * @Last Modified by: guanlanluditie
 * @Last Modified time: 2021-02-13 17:53:25
 */
import * as React from 'react';
import { MobXProviderContext } from 'mobx-react';

//  使用Mobx提供的context来包裹
export function useStores(name: string) {
  // mixin code
  return React.useContext(MobXProviderContext)[name];
}