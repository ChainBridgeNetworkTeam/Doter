/*
 * @Author: guanlanluditie 
 * @Date: 2021-03-07 15:32:20 
 * @Last Modified by: guanlanluditie
 * @Last Modified time: 2021-03-20 22:02:08
 */

import React, { FC, useEffect, useState } from 'react';
import s from './index.css';
import './index.antd.css';
import HeadBar from '@widgets/headBar';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { observer } from 'mobx-react';
import { useStores } from '@utils/useStore';
import { globalStoreType } from '@entry/store';
import { Tabs } from 'antd';
import Referenda from './referenda';


const { TabPane } = Tabs;

const TAB_MAP = {
    REFERENDA: '0',
    PROPOSAL: '1',
    CANDIDATE: '2'
}

const Entry:FC = function() {
    let { t } = useTranslation();
    const globalStore = useStores('GlobalStore') as globalStoreType;
    const history = useHistory();
    const [actTab, setTab] = useState(TAB_MAP.REFERENDA);

    //  国际化的包裹函数
    const lanWrap = (input: string) => t(`democracy:${input}`);

    return (
        <div className={s.wrap}>
            <HeadBar word={lanWrap('Democratic Governance')}/>
            <Tabs defaultActiveKey={TAB_MAP.REFERENDA} onChange={setTab} centered className='DEtabWrap'>
                <TabPane tab={lanWrap('Chain referendum')} key={TAB_MAP.REFERENDA}>
                    <Referenda />
                </TabPane>
                {/* <TabPane tab="社区提案" key={TAB_MAP.PROPOSAL}>
                    Content of Tab Pane 2
                </TabPane>
                <TabPane tab="理事会选举" key={TAB_MAP.CANDIDATE}>
                    Content of Tab Pane 3
                </TabPane> */}
            </Tabs>
        </div>
    )
}

export default observer(Entry);