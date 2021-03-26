/*
 * @Author: guanlanluditie 
 * @Date: 2021-03-07 15:32:20 
 * @Last Modified by: guanlanluditie
 * @Last Modified time: 2021-03-20 21:25:27
 */

import React, { FC, useEffect, useState } from 'react';
import s from './index.css';
import HeadBar from '@widgets/headBar';
import cx from 'classnames';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { observer } from 'mobx-react';
import { useStores } from '@utils/useStore';
import { globalStoreType } from '@entry/store';
import { getRecordDetail } from '../service';
import moment from 'moment';

interface HisState {
    hash?: string;
}

interface reaRes {
    transfer: Record<string, any>,
    fee?: string;
    block_timestamp?: number;
    success?: boolean
}

const Entry:FC = function() {
    let { t } = useTranslation();
    const globalStore = useStores('GlobalStore') as globalStoreType;
    const history = useHistory();

    //  国际化的包裹函数
    const lanWrap = (input: string) => t(`transRecord:${input}`);

    //  const TargetAdd = '165ketsk66SBVQi7d8w2z1McVnUNkJzbWVqpA9hRanznigDV';
    const TargetAdd = globalStore.currentAccount.address;
    const { hash } = history.location.state as HisState;

    function getTransDetail() {
        const [detail, setDetail] = useState({} as reaRes);
        useEffect(() => {
            async function getRecord() {
                const res = await getRecordDetail(hash);
                const result = res.data || {};
                setDetail(result);
            }
            getRecord()
        }, [])
        return detail;
    }

    function seeOrderDetail() {
        window.open(`https://polkadot.subscan.io/extrinsic/${hash}`)
    }

    const { transfer, fee, block_timestamp, success } = getTransDetail();
    const { amount, from, to } = transfer || {};
    const isIn = TargetAdd !== from;

    return (
        <div className={s.wrap}>
            <HeadBar word={lanWrap('transaction details')}/>
            <div className={cx(s.icon, success ? '' : s.failIcon)}/>
            <div className={s.status}>{success ? lanWrap('success') : lanWrap('fail')}</div>
            <div className={s.content}>
                <div className={s.title}>{lanWrap('amount')}</div>
                <div className={s.cInfo}>{isIn ? '+' : '-'}{amount} DOT</div>
            </div>
            <div className={cx(s.content, s.mT)}>
                <div className={s.title}>{lanWrap("Miner's fee")}</div>
                <div className={s.cInfo}>{parseInt(fee) / Math.pow(10, 10)} DOT</div>
            </div>
            <div className={s.content}>
                <div className={s.title}>{lanWrap('to')}</div>
                <div className={cx(s.cInfo, s.blockContent)}>{to}</div>
            </div>
            <div className={s.content}>
                <div className={s.title}>{lanWrap('from')}</div>
                <div className={cx(s.cInfo, s.blockContent)}>{from}</div>
            </div>
            <div className={s.content}>
                <div className={s.title}>{lanWrap('Transaction time')}</div>
                <div className={s.cInfo}>{moment(block_timestamp * 1000).format('YYYY-MM-DD hh:mm:ss')}</div>
            </div>
            <div className={cx(s.content, s.order)}>
                <div className={s.title}>{lanWrap('hash')}</div>
                <div className={cx(s.cInfo, s.orderContent)}>{hash}</div>
            </div>
            <div className={cx(s.content, s.bottomContent)} onClick={seeOrderDetail}>
                <div className={cx(s.title, s.bTitile)}>{lanWrap('Query transaction details in subscan')}</div>
                <div className={s.arrow}/>
            </div>
        </div>
    )
}

export default observer(Entry);