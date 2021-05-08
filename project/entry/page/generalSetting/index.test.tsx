/*
 * @Author: dianluyuanli-wp
 * @LastEditors: dianluyuanli-wp
 * @Date: 2021-05-07 23:01:43
 * @LastEditTime: 2021-05-07 23:28:15
 */

import Adapter from 'enzyme-adapter-react-16';
import { configure, mount, ReactWrapper } from 'enzyme';
import { flushAllPromises } from '../../../utils/testHelpers';
import React from 'react';
import HeadBar from '../../widgets/headBar';
import { act } from 'react-dom/test-utils';

import GeneralSetting from './entry/index';

configure({ adapter: new Adapter() });

describe('Create Account', () => {
  let wrapper: ReactWrapper;
  let onActionStub: jest.Mock;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  const mountComponent = (): ReactWrapper => mount(<GeneralSetting />);

  beforeEach(async () => {
    onActionStub = jest.fn();
    wrapper = mountComponent();
    await act(flushAllPromises);
    wrapper.update();
  });

  describe('header render test', () => {
    it('see generalsetting', () => {
        expect(wrapper.find(HeadBar).prop('word')).toBe('generalSetting:General settings');
    });
  })
});
