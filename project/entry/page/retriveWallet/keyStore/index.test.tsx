/*
 * @Author: dianluyuanli-wp
 * @LastEditors: dianluyuanli-wp
 * @Date: 2021-04-29 09:00:56
 * @LastEditTime: 2021-04-30 22:14:51
 */

import Adapter from 'enzyme-adapter-react-16';
import { configure, mount, ReactWrapper } from 'enzyme';
import { flushAllPromises, waitPromise } from '../../../../utils/testHelpers';
import React from 'react';
import { act } from 'react-dom/test-utils';
import keyring from '@polkadot/ui-keyring';

import KeyStoreRetrieve from './index';

configure({ adapter: new Adapter() });

const testStore = {"encoded":"vns1rg9L7yk0uRwvezb5O/Y7rhqekLsH0Vd4065kR9UAgAAAAQAAAAgAAAD9oR5OshUkbifYyrliAb5AN7kAgB9CqjO/fR5l77DCXeE9bSxYhwotJDE0OKtD8BaAuI2slXBM2zj23RaG01sV8+o45uVZw0/Kf35zhgtrm3wmAliZHjlH7FzLh3dXWHODoiPMtHdxc8dB+ADePph//N/bqnJNcD35VQ2MKgj0XHVUU31YMbbmgtA+IQ9SPbZLOjOv8gL/LIhtMn83","encoding":{"content":["pkcs8","ed25519"],"type":["scrypt","xsalsa20-poly1305"],"version":"3"},"address":"138zXWBiXnW9fjWR43x65WE2KiEpWKtkE2oxNav6NoWntQFH","meta":{"name":"test2","whenCreated":1618650418740}};

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
      }
    }),
}));

describe('Retrive wallet with keyStore', () => {
  let wrapper: ReactWrapper;
  let onActionStub: jest.Mock;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  const mountComponent = (): ReactWrapper => mount(<KeyStoreRetrieve />);

  beforeEach(async () => {
    onActionStub = jest.fn();
    wrapper = mountComponent();
    await act(flushAllPromises);
    wrapper.update();
  });

  describe('header render test', () => {
    it('go through progress of keystore retrieve wallet, without userAgreement', () => {
        wrapper.find('textarea').first().simulate('change', { target: { value: JSON.stringify(testStore)}});
        wrapper.find('input').first().simulate('change', { target: { value: '12345678'}});
        wrapper.find('.reBtn').first().simulate('click');
        expect(wrapper.find('.reCheckInfo').first().text()).toBe('retriveWallet:Please check the user agreement');
    });

    it('go through progress of keystore retrieve wallet, with wrong password', async () => {
        wrapper.find('textarea').first().simulate('change', { target: { value: JSON.stringify(testStore)}});
        wrapper.find('input').first().simulate('change', { target: { value: '111'}});
        wrapper.find('.userAgree').first().simulate('click');
        await act(flushAllPromises);
        wrapper.update();
        wrapper.find('.reBtn').first().simulate('click');
        expect(wrapper.find('.reCheckInfo').first().text()).toBe('retriveWallet:Wrong password');
    });

    it('go through progress of keystore retrieve wallet', async () => {
        wrapper.find('textarea').first().simulate('change', { target: { value: JSON.stringify(testStore)}});
        wrapper.find('input').first().simulate('change', { target: { value: '111'}});
        wrapper.find('.userAgree').first().simulate('click');
        await act(flushAllPromises);
        wrapper.update();
        wrapper.find('.reBtn').first().simulate('click');
        expect(wrapper.find('.reCheckInfo').first().text()).toBe('retriveWallet:Please check the user agreement');
    });
  })
});