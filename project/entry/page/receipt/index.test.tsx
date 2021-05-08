/*
 * @Author: dianluyuanli-wp
 * @LastEditors: dianluyuanli-wp
 * @Date: 2021-05-07 23:39:24
 * @LastEditTime: 2021-05-07 23:42:06
 */
import Adapter from 'enzyme-adapter-react-16';
import { configure, mount, ReactWrapper } from 'enzyme';
import { flushAllPromises } from '../../../utils/testHelpers';
import React from 'react';
import HeadBar from '../../widgets/headBar';
import { act } from 'react-dom/test-utils';

import Receipt from './index';

configure({ adapter: new Adapter() });

describe('Create Account', () => {
  let wrapper: ReactWrapper;
  let onActionStub: jest.Mock;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  const mountComponent = (): ReactWrapper => mount(<Receipt />);

  beforeEach(async () => {
    onActionStub = jest.fn();
    wrapper = mountComponent();
    await act(flushAllPromises);
    wrapper.update();
  });

  describe('Receipt render test', () => {
    it('see Receipt header ', () => {
        expect(wrapper.find(HeadBar).prop('word')).toBe('receipt:Collection');
    });
  })
});