/*
 * @Author: dianluyuanli-wp
 * @LastEditors: dianluyuanli-wp
 * @Date: 2021-05-11 00:02:41
 * @LastEditTime: 2021-05-11 08:46:08
 */
import Adapter from 'enzyme-adapter-react-16';
import { configure, mount, ReactWrapper } from 'enzyme';
import { flushAllPromises } from '../../../../utils/testHelpers';
import React from 'react';
import HeadBar from '../../../widgets/headBar';
import { act } from 'react-dom/test-utils';

import AddOrEdit from './index';

configure({ adapter: new Adapter() });

jest.mock('react-router-dom', () => ({
    useHistory: () => ({
      push: jest.fn(),
      location: {
        pathname: '/retrieveWallet/mnemonic',
        state: { target: 'add' }
      },
    }),
}));

describe('Create Account', () => {
  let wrapper: ReactWrapper;
  let onActionStub: jest.Mock;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  const mountComponent = (): ReactWrapper => mount(<AddOrEdit />);

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
        expect(wrapper.find(HeadBar).prop('word')).toBe('recipientAddress:Add address');
    });
    it('check address Input', async () => {
        wrapper.find('.recipientT').first().simulate('change', { target: { value: '1pbMtabBc9MNJcam4o8uHGymybvPcnkU5AGmpSmUpms7SWh' } });
        await act(flushAllPromises);
        wrapper.update();
        expect(wrapper.find('.reciInfoT').first().text()).toBe('recipientAddress:bad address');
    });
  })
});