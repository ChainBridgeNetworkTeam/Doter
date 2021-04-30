/*
 * @Author: your name
 * @Date: 2021-04-24 10:25:20
 * @LastEditTime: 2021-04-29 08:30:47
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /Doter/project/entry/page/createAccount/index.test.tsx
 */

//import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import Adapter from 'enzyme-adapter-react-16';
import { configure, mount, ReactWrapper, shallow } from 'enzyme';
import { flushAllPromises } from '../../../utils/testHelpers';
import React from 'react';
import HeadBar from '../../widgets/headBar';
import { act } from 'react-dom/test-utils';

import CreateAccount from './index';

configure({ adapter: new Adapter() });

describe('Create Account', () => {
  let wrapper: ReactWrapper;
  let onActionStub: jest.Mock;
  const exampleAccount = {
    address: 'HjoBp62cvsWDA3vtNMWxz6c9q13ReEHi9UGHK7JbZweH5g5',
    seed: 'horse battery staple correct'
  };
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  const mountComponent = (): ReactWrapper => mount(<CreateAccount />);

  beforeAll(() => {
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(), // Deprecated
        removeListener: jest.fn(), // Deprecated
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      }))
    });
  });

  beforeEach(async () => {
    onActionStub = jest.fn();
    wrapper = mountComponent();
    await act(flushAllPromises);
    wrapper.update();
  });

  const type = async (input: ReactWrapper, value: string): Promise<void> => {
    input.simulate('change', { target: { value } });
    await act(flushAllPromises);
    wrapper.update();
  };

  const enterName = (name: string): Promise<void> => type(wrapper.find('input').first(), name);
  const password = (password: string) => (): Promise<void> => type(wrapper.find('input#fSec'), password);
  const repeat = (password: string) => (): Promise<void> => type(wrapper.find('input#secRepeat'), password);

  describe('Phase 1', () => {
    it('see mnemonic mask', () => {
      expect(wrapper.find(HeadBar).prop('word')).toBe('createAccount:create wallet');
    });

    it('find wraper', () => {
        //console.log(wrapper.find('.testT11').first().text(), secStyle.formTitle, '333');
        expect(wrapper.find('.testT').first().text()).toBe('createAccount:Wallet name');
    });

    it('check secret input for length', async () => {
      wrapper.find('input[type="password"]').first().simulate('change', { target: { value: '111' } });
      wrapper.find('input[type="password"]').last().simulate('change', { target: { value: '111' } });
      wrapper.find('.btn').simulate('click');
      expect(wrapper.find('.error').first().text()).toBe('createAccount:The password is less than 8 digits');
    })

    it('check secret input for repeat not stay same with secret input', async () => {
      wrapper.find('input[type="password"]').first().simulate('change', { target: { value: '111235689' } });
      wrapper.find('input[type="password"]').last().simulate('change', { target: { value: '111235680' } });
      wrapper.find('.btn').simulate('click');
      expect(wrapper.find('.error').first().text()).toBe('createAccount:The password is inconsistent');
    })

    it('check for user agreement check', async () => {
      wrapper.find('input[type="password"]').first().simulate('change', { target: { value: '111235689' } });
      wrapper.find('input[type="password"]').last().simulate('change', { target: { value: '111235689' } });
      wrapper.find('.btn').simulate('click');
      expect(wrapper.find('.error').first().text()).toBe('createAccount:Please check the user agreement');
    })

    it('enter next stage', async () => {
      wrapper.find('input[type="password"]').first().simulate('change', { target: { value: '111235689' } });
      wrapper.find('input[type="password"]').last().simulate('change', { target: { value: '111235689' } });
      wrapper.find('.userAgree').simulate('click');
      wrapper.find('.btn').simulate('click');
      //  mnemonics 里面有异步操作，不等的话会报错
      await act(flushAllPromises);
      wrapper.update();
      expect(wrapper.find('.mnTitle').first().text()).toBe('createAccount:save mnenoic');
    })
  })
});
