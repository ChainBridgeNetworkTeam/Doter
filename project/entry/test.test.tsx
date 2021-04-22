/*
 * @Author: your name
 * @Date: 2021-04-21 08:39:27
 * @LastEditTime: 2021-04-21 08:42:06
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /Doter/project/entry/test.test.js
 */
//  const sum = require('./sum');
import { sum } from './test';
test('adds 1 + 2 to equal 3', () => {
  expect(sum(1, 2)).toBe(3);
});