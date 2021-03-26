/*
 * @Author: guanlanluditie 
 * @Date: 2021-03-09 23:37:26 
 * @Last Modified by: guanlanluditie
 * @Last Modified time: 2021-03-20 20:42:52
 */

import React, { FC, useEffect, useState, useMemo } from 'react';
import s from './index.css';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { observer } from 'mobx-react';
import { useStores } from '@utils/useStore';
import { globalStoreType } from '@entry/store';
import democrcacyStore from '../store';
import { runInAction } from 'mobx';
import cx from 'classnames';
import { Spin } from 'antd';
import BN from 'bn.js';
import { PAGE_NAME } from '@constants/app';
import { BN_ONE } from '@polkadot/util';
import { addressFormat, useBlockTime, getBlockTime } from '@utils/tools';
import { getReferendas, getReferDetail } from '../service';
import type { DeriveReferendumExt } from '@polkadot/api-derive/types';

function getVote(value: string) {
    return new BN(value).div(new BN(Math.pow(10, 10))).toString();
}

const Referenda:FC = function() {
    let { t } = useTranslation();
    const globalStore = useStores('GlobalStore') as globalStoreType;
    const history = useHistory();
    const [hasInit, setInit] = useState(false);
    const [oHasInit, setOInit] = useState(false);
    

    //  国际化的包裹函数
    const lanWrap = (input: string) => t(`democracy:${input}`);

    function jump(path: string) {
        history.push(path);
    }

    function vote(action: 'support' | 'reject', index: number) {
        runInAction(() => {
            democrcacyStore.action = action;
        })
        history.push(PAGE_NAME.DEMOCRACY_VOTE, {
            index
        });
    }

    //  subscan接口更新
    useEffect(() => {
        async function res() {
            let rankList = [];
            try {
                const res = await getReferendas();
                rankList = res.data.list.slice(0, 10).filter((item: any) => item.status === 'started').map((item: any) => item.referendum_index);
            } catch {}

            const subRes = await Promise.all(rankList.map((item: number) => getReferDetail(item)));
            runInAction(() => {
                democrcacyStore.reScanDetial = subRes.map((item: any) => item.data.info);
            })
            setInit(true);
        }
        res();
    }, [])

    function seeDetail(referendum_index: string) {
        window.open(`https://polkadot.subscan.io/referenda/${referendum_index}`);
    }

    //  官方api接口更新
    useEffect(() => {
        async function res() {
            try {
                const officalRes = await globalStore.api.derive.democracy.referendums();
                runInAction(() => {
                    democrcacyStore.referenda = officalRes;
                })
                setOInit(true);
            } catch(e) {
                console.log(e);
            }

        }
        globalStore.hasInit && res();
    }, [globalStore.hasInit])

    function comLeft() {
        const [value, setValue] = useState([]);
        useEffect(() => {
            async function comDetail() {
                const bestNum = await globalStore.api.derive.chain.bestNumber();
                const res = democrcacyStore.reScanDetial.map(item => {
                    const target = democrcacyStore.referenda.find(sitem => {
                        return sitem.index.toNumber() === item.referendum_index;
                    });
                    return target.status.end.sub(bestNum).isub(BN_ONE);
                })
                setValue(res.map(item => getBlockTime(item)));
            }
            globalStore.hasInit && oHasInit && comDetail();
        }, [oHasInit, globalStore.hasInit])
        return value;
    }
    const textList = comLeft();

    function comRate() {
        const [value, setValue] = useState([]);
        useEffect(() => {
            async function comDetail() {
                const totalIssuance = await globalStore.api.query.balances.totalIssuance();
                const res = democrcacyStore.referenda.map(item => {
                    return `${((item.votedTotal.muln(10000).div(totalIssuance).toNumber()) / 100).toFixed(4)}%`
                })
                setValue(res);
            }
            globalStore.hasInit && oHasInit && comDetail();
        }, [oHasInit, globalStore.hasInit])
        return value;
    }

    const rateList = comRate();

    function renderReferendaArr() {
        return democrcacyStore.reScanDetial.map((_: any, index: number) => {
            const { referendum_index, pre_image = {}, delay, turnout, aye_amount, nay_amount  } = democrcacyStore.reScanDetial[index];
            const { call_module, call_name, author } = pre_image || {};
            return <div className={s.contentWrap} key={index}>
                <div className={s.title}>
                    <div className={s.rank}>#{referendum_index}</div>
                    <div>{`${call_module}.${call_name}`}</div>
                    <div className={s.img}/>
                </div>
                <div className={s.rowTitle}>{lanWrap('Sponsor')}</div>
                <div className={s.authorWrap}>
                    <div className={s.author}>{addressFormat(author?.address || '', 8)}</div>
                    <div className={s.ddetial} onClick={() => seeDetail(referendum_index)}>{lanWrap('Details of the proposal')}</div>
                </div>
                <div className={s.rowTitle}>{lanWrap('Voting time remaining')}</div>
                <Spin spinning={!textList[index]}>
                    <div className={s.author}>{textList[index]}</div>
                </Spin>
                <div className={s.rowTitle}>{lanWrap('Voting participation')}</div>
                <div className={s.author}>{getVote(turnout || '0') || '0'}DOT({rateList[index]})</div>
                <div className={s.splitLine} />
                <div className={s.vote}>
                    <div>{lanWrap('support')}: {getVote(aye_amount)}{lanWrap('polls')}</div>
                    <div>{lanWrap('oppose')}：{getVote(nay_amount)}{lanWrap('polls')}</div>
                </div>
                <div className={s.voteBar}>
                    <div className={s.ayeBar} style={{ width: parseInt(aye_amount) / (parseInt(nay_amount) + parseInt(aye_amount)) * 3.19 + 'rem'}}/>
                </div>
                <div className={s.btnGroup}>
                    <div className={cx(s.btn, s.sBtn)} onClick={() => vote('support', index)}>{lanWrap('support')}</div>
                    <div className={cx(s.btn, s.rBtn)} onClick={() => vote('reject', index)}>{lanWrap('oppose')}</div>
                </div>
            </ div>
        })
    }
    return (
        <div className={s.wrap}>
            {hasInit && globalStore.hasInit ?
                <>{renderReferendaArr()}</>
                : <div className={s.spin}><Spin /></div>
            }
        </div>
    )
}

export default observer(Referenda);