/*
 * @Author: dianluyuanli-wp
 * @LastEditors: dianluyuanli-wp
 * @Date: 2021-04-30 22:09:49
 * @LastEditTime: 2021-05-05 11:16:58
 */
import Adapter from 'enzyme-adapter-react-16';
import { configure, mount, ReactWrapper } from 'enzyme';
import { flushAllPromises, waitPromise } from '../../../../utils/testHelpers';
import React from 'react';
import { act } from 'react-dom/test-utils';
import keyring from '@polkadot/ui-keyring';

import MnemonicRetrieve from './index';

configure({ adapter: new Adapter() });

const testMnemonic = 'arm ship govern acoustic wagon sound marine churn market top record expose';
keyring.loadAll({
    //  genesisHash: this.api.genesisHash as any,
    ss58Format: 0,
    //  store: new AccountsStore(),
    type: 'ed25519'
}, []);

jest.mock('react-router-dom', () => ({
    useHistory: () => ({
      push: jest.fn(),
      location: {
        pathname: '/retrieveWallet/mnemonic'
      }
    }),
}));

describe('Retrive wallet with mnemonic', () => {
  let wrapper: ReactWrapper;
  let onActionStub: jest.Mock;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  const mountComponent = (): ReactWrapper => mount(<MnemonicRetrieve />);

  beforeEach(async () => {
    onActionStub = jest.fn();
    wrapper = mountComponent();
    await act(flushAllPromises);
    wrapper.update();
  });

  describe('header render test', () => {
    it('go through progress of mnemonic retrieve wallet, without userAgreement', () => {
        wrapper.find('textarea').first().simulate('change', { target: { value: testMnemonic }});
        wrapper.find('.reBtn').first().simulate('click');
        expect(wrapper.find('.reCheckInfo').first().text()).toBe('retriveWallet:Please check the user agreement');
    });

    it('go through progress of mnemonic retrieve wallet, password too short', async () => {
        wrapper.find('textarea').first().simulate('change', { target: { value: testMnemonic }});
        wrapper.find('input[type="password"]').first().simulate('change', { target: { value: '111' } });
        wrapper.find('input[type="password"]').last().simulate('change', { target: { value: '111' } });
        wrapper.find('.userAgree').first().simulate('click');
        await act(flushAllPromises);
        wrapper.update();
        wrapper.find('.reBtn').first().simulate('click');
        expect(wrapper.find('.reCheckInfo').first().text()).toBe('retriveWallet:The number of password digits is less than 8');
    });

    it('go through progress of mnemonic retrieve wallet, password without consistency', async () => {
        wrapper.find('textarea').first().simulate('change', { target: { value: testMnemonic }});
        wrapper.find('input[type="password"]').first().simulate('change', { target: { value: '12345678' } });
        wrapper.find('input[type="password"]').last().simulate('change', { target: { value: '12345677' } });
        await act(flushAllPromises);
        wrapper.update();
        wrapper.find('.reBtn').first().simulate('click');
        expect(wrapper.find('.reCheckInfo').first().text()).toBe('retriveWallet:Inconsistent password input');
    });

    it('go through progress of mnemonic retrieve wallet, success', async () => {
        wrapper.find('textarea').first().simulate('change', { target: { value: testMnemonic }});
        wrapper.find('input[type="password"]').first().simulate('change', { target: { value: '12345678' } });
        wrapper.find('input[type="password"]').last().simulate('change', { target: { value: '12345678' } });
        wrapper.find('.reBtn').first().simulate('click');
        await act(flushAllPromises);
        wrapper.update();
        expect(wrapper.find('.reCheckInfo').first().text()).toBe('');
    });
  })
});