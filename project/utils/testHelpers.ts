/*
 * @Author: your name
 * @Date: 2021-04-24 10:31:37
 * @LastEditTime: 2021-04-30 21:39:32
 * @LastEditors: dianluyuanli-wp
 * @Description: In User Settings Edit
 * @FilePath: /Doter/project/utils/testHelpers.ts
 */

export function flushAllPromises (): Promise<void> {
    return new Promise((resolve) => setImmediate(resolve));
}

export const waitPromise = () => new Promise((res, rej) => {
  setTimeout(res, 200);
})
  
