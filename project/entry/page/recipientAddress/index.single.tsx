/*
 * @Author: dianluyuanli-wp
 * @LastEditors: dianluyuanli-wp
 * @Date: 2021-05-10 23:23:57
 * @LastEditTime: 2021-05-11 00:03:15
 */

import Adapter from 'enzyme-adapter-react-16';
import { configure, mount, ReactWrapper } from 'enzyme';
import { flushAllPromises } from '../../../utils/testHelpers';
import React from 'react';
import HeadBar from '../../widgets/headBar';
import { act } from 'react-dom/test-utils';

import Recipient from './entry/index';

configure({ adapter: new Adapter() });

jest.mock('react-router-dom', () => ({
    useHistory: () => ({
      push: jest.fn(),
      location: {
        pathname: '/retrieveWallet/mnemonic'
      },
    }),
}));

describe('Create Account', () => {
  let wrapper: ReactWrapper;
  let onActionStub: jest.Mock;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  const mountComponent = (): ReactWrapper => mount(<Recipient />);

  beforeEach(async () => {
    onActionStub = jest.fn();
    wrapper = mountComponent();
    await act(flushAllPromises);
    wrapper.update();
  });

  describe('header recipientAddress render test', () => {
    it('see recipientAddress', async () => {
        await act(flushAllPromises);
        wrapper.update();
        expect(wrapper.find(HeadBar).prop('word')).toBe('recipientAddress:Transfer address');
    });
  })
});
