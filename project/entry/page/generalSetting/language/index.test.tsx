/*
 * @Author: dianluyuanli-wp
 * @LastEditors: dianluyuanli-wp
 * @Date: 2021-05-07 23:25:11
 * @LastEditTime: 2021-05-07 23:27:30
 */
import Adapter from 'enzyme-adapter-react-16';
import { configure, mount, ReactWrapper } from 'enzyme';
import { flushAllPromises } from '../../../../utils/testHelpers';
import React from 'react';
import { act } from 'react-dom/test-utils';

import ChangeLanguage from './index';

configure({ adapter: new Adapter() });

describe('Change lan', () => {
  let wrapper: ReactWrapper;
  let onActionStub: jest.Mock;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  const mountComponent = (): ReactWrapper => mount(<ChangeLanguage />);

  beforeEach(async () => {
    onActionStub = jest.fn();
    wrapper = mountComponent();
    await act(flushAllPromises);
    wrapper.update();
  });

  describe('change lan render test', () => {
    it('change language', async () => {
        wrapper.find('.chineseT').first().simulate('click');
        await act(flushAllPromises);
        wrapper.update();
        expect(wrapper.find('.chineseArrow').length).toBe(1);
    });
  })
});