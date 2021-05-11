/*
 * @Author: dianluyuanli-wp
 * @LastEditors: dianluyuanli-wp
 * @Date: 2021-05-10 22:52:20
 * @LastEditTime: 2021-05-10 23:22:46
 */
import Adapter from 'enzyme-adapter-react-16';
import { configure, mount, ReactWrapper } from 'enzyme';
import { flushAllPromises } from '../../../utils/testHelpers';
import React from 'react';
import HeadBar from '../../widgets/headBar';
import { act } from 'react-dom/test-utils';

import Democracy from './index';

configure({ adapter: new Adapter() });

jest.mock('./service', () => ({
    getReferendas: new Promise((res) => {
        res([])
    }),
    getReferDetail: new Promise((res) => {
        res([])
    })
}));

describe('Create Account', () => {
  let wrapper: ReactWrapper;
  let onActionStub: jest.Mock;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  const mountComponent = (): ReactWrapper => mount(<Democracy />);

  beforeEach(async () => {
    onActionStub = jest.fn();
    wrapper = mountComponent();
    await act(flushAllPromises);
    wrapper.update();
  });

  describe('header democracy render test', () => {
    it('see democracy', async () => {
        await act(flushAllPromises);
        wrapper.update();
        expect(wrapper.find(HeadBar).prop('word')).toBe('democracy:Democratic Governance');
    });
  })
});