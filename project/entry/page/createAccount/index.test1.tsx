/*
 * @Author: your name
 * @Date: 2021-04-24 10:25:20
 * @LastEditTime: 2021-04-25 22:54:46
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
import secStyle from './secret/index.scss';
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

  beforeEach(async () => {
    onActionStub = jest.fn();
    // jest.spyOn(messaging, 'createSeed').mockResolvedValue(exampleAccount);
    // jest.spyOn(messaging, 'createAccountSuri').mockResolvedValue(true);
    wrapper = mountComponent();
    await act(flushAllPromises);
    wrapper.update();
  });

  describe('Phase 1', () => {
    it('see mnemonic mask', () => {
      expect(wrapper.find(HeadBar).prop('word')).toBe('createAccount:create wallet');
    });

    // it('find wraper', () => {
    //     console.log(wrapper.find('.test'), secStyle.formTitle, '333');
    //     expect(wrapper.find('.test').first().text()).toBe('createAccount:Wallet name');
    // })
  })
});
