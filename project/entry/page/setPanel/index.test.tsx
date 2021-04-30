/*
 * @Author: dianluyuanli-wp
 * @LastEditors: dianluyuanli-wp
 * @Date: 2021-04-29 08:32:15
 * @LastEditTime: 2021-04-29 08:51:51
 */

import Adapter from 'enzyme-adapter-react-16';
import { configure, mount, ReactWrapper, shallow } from 'enzyme';
import { flushAllPromises } from '../../../utils/testHelpers';
import React from 'react';
import HeadBar from '../../widgets/headBar';
import { act } from 'react-dom/test-utils';

import SetPanel from './index';

configure({ adapter: new Adapter() });

describe('Create Account', () => {
  let wrapper: ReactWrapper;
  let onActionStub: jest.Mock;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  const mountComponent = (): ReactWrapper => mount(<SetPanel />);

  beforeEach(async () => {
    onActionStub = jest.fn();
    wrapper = mountComponent();
    await act(flushAllPromises);
    wrapper.update();
  });

  describe('header render test', () => {
    it('see mnemonic mask', () => {
        expect(wrapper.find(HeadBar).prop('word')).toBe('setPanel:Setting');
    });
  })
});
