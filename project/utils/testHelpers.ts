/*
 * @Author: your name
 * @Date: 2021-04-24 10:31:37
 * @LastEditTime: 2021-04-24 10:31:52
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /Doter/project/utils/testHelpers.ts
 */

export function flushAllPromises (): Promise<void> {
    return new Promise((resolve) => setImmediate(resolve));
  }
  
