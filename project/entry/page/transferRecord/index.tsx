/*
 * @Author: guanlanluditie 
 * @Date: 2021-03-07 15:32:20 
 * @Last Modified by: guanlanluditie
 * @Last Modified time: 2021-03-20 21:18:46
 */

import React, { FC, useEffect, useState, useReducer, useRef } from 'react';
import s from './index.css';
import './index.antd.css';
import HeadBar from '@widgets/headBar';
import cx from 'classnames';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { observer } from 'mobx-react';
import { useStores } from '@utils/useStore';
import { globalStoreType } from '@entry/store';
import { Tabs, Spin } from 'antd';
import { addressFormat } from '@utils/tools';
import { PAGE_NAME } from '@constants/app';
import { getTransRecord } from './service';
import moment from 'moment';


const { TabPane } = Tabs;

const TAB_MAP = {
    ALL: '0',
    INCOME: '1',
    OUT: '2'
}

const SINGLE_PAGE_SIZE = 25;
interface recordTabStatus {
    pageNum?: number,
    isFetching?: boolean,
    hasMore?: boolean,
    traArr?: Array<Record<string, any>>
}

const Entry:FC = function() {
    let { t } = useTranslation();
    const globalStore = useStores('GlobalStore') as globalStoreType;
    const history = useHistory();
    const [actTab, setTab] = useState(TAB_MAP.ALL);

    //  状态管理
    function stateReducer(state: Object, action: recordTabStatus) {
        return Object.assign({}, state, action);
    }
    const [stateObj, setState] = useReducer(stateReducer, { 
        pageNum: 0,
        hasMore: true,
        traArr: [],
        isFetching: false } as recordTabStatus
    );

    //  国际化的包裹函数
    const lanWrap = (input: string) => t(`transRecord:${input}`);

    //  const TargetAdd = '165ketsk66SBVQi7d8w2z1McVnUNkJzbWVqpA9hRanznigDV';
    //  超长1ugnSE55RvN3CkjH3YetBg1iS5Rs7ZNGJ6LkUhbLS4Lrs7U
    const TargetAdd = globalStore.currentAccount.address;

    const observerInstance = useRef<IntersectionObserver>();

    async function getRecord(outerState: recordTabStatus) {
        const { pageNum, traArr } = outerState;
        setState({
            isFetching: true
        })
        const res = await getTransRecord(TargetAdd, pageNum, SINGLE_PAGE_SIZE);
        const { count, transfers } = res.data || {};
        const nextPageNum = pageNum + 1;
        setState({
            isFetching: false,
            pageNum: nextPageNum,
            hasMore: !(nextPageNum * SINGLE_PAGE_SIZE >= count),
            traArr: traArr.concat(transfers || [])
        })
    }

    const Outer = useRef<recordTabStatus>();
    Outer.current = stateObj;
    //  定义观察者
    useEffect(() => {
        observerInstance.current = new IntersectionObserver(async () => {
            const { hasMore, isFetching } = Outer.current;
            if (isFetching) {
                return;
            }
            if (!hasMore) {
                return observerInstance.current.disconnect();
            }
            //  这里不直接使用stateObj的原因:这会直接取快照，内容永远不变
            //  借用Outer,也就是ref来获取引用
            await getRecord(Outer.current);
        });
        observerInstance.current.observe(document.getElementById('observerObj'))
    }, [actTab])

    function List(tarr: Array<Record<string, any>>) {
        const ItemList = tarr.map((item, index) => {
            const { amount, block_timestamp, from, to, success, hash } = item;
            const isIn = from !== TargetAdd;
            return <div className={s.singleItem} key={index} onClick={() => history.push(PAGE_NAME.TRANSFER_RECORD_DETAIL, { hash })}>
                <div className={s.firstRow}>
                    <div className={s.frLeft}>
                        <div className={cx(s.icon, isIn ? '' : s.outIcon)} />
                        <div>{addressFormat(from, 8)} --{'>'} {addressFormat(to, 8)}</div>
                    </div>
                    <div className={s.amout}>{isIn ? '+' : '-'}{amount}</div>
                </div>
                <div className={s.time}>{moment(block_timestamp * 1000).format('DD/MM/YYYY hh:mm:ss')}</div>
            </div>
        });
        const { hasMore, isFetching } = stateObj;
        return <div className={s.listWrap}>
            {tarr.length ? ItemList : (isFetching ? null : <div className={s.empty}>{lanWrap('There is no record')}</div>)}
            {isFetching && <div className={s.center}><Spin /></div>}
            <div className={s.observer} id='observerObj'>{hasMore ? '' : lanWrap('No more')}</div>
        </div>
    }

    const AllAry = stateObj.traArr;
    const outArr = AllAry.filter(item => item.from === TargetAdd);
    const inArr = AllAry.filter(item => item.from !== TargetAdd)


    return (
        <div className={s.wrap}>
            <HeadBar word={lanWrap('Transaction records')}/>
            <Tabs defaultActiveKey={TAB_MAP.ALL} onChange={setTab} centered className='TRtabWrap'>
                <TabPane tab={lanWrap('all')} key={TAB_MAP.ALL}>
                    {List(AllAry)}
                </TabPane>
                <TabPane tab={lanWrap('income')} key={TAB_MAP.INCOME}>
                    {List(inArr)}
                </TabPane>
                <TabPane tab={lanWrap('Transfer out')} key={TAB_MAP.OUT}>
                    {List(outArr)}
                </TabPane>
            </Tabs>
        </div>
    )
}

export default observer(Entry);