/*
 * @Author: guanlanluditie 
 * @Date: 2021-03-07 15:32:20 
 * @Last Modified by: guanlanluditie
 * @Last Modified time: 2021-03-22 22:13:56
 */

import React, { FC, useReducer } from 'react';
import s from './index.css';
import './index.antd.css';
import HeadBar from '@widgets/headBar';
import cx from 'classnames';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { useStores } from '@utils/useStore';
import { globalStoreType } from '@entry/store';
import DotInput from '@widgets/balanceDotInput';
import { Select, message } from 'antd';
import { useLocalObservable, Observer } from 'mobx-react';
import democrcacyStore, { CreateStoreType } from '../store';
import { WEIGHT_ARR, useWeightArr } from '@constants/chain';
import { runInAction } from 'mobx';
import { PAGE_NAME } from '@constants/app';
import BottonBtn from '@widgets/bottomBtn';

interface infoVote {
    errStr?: string;
    ableDot?: number;
}

interface HisState {
    index: number
}

const Entry = function() {
    let { t } = useTranslation();
    const globalStore = useStores('GlobalStore') as globalStoreType;
    const history = useHistory();
    function stateReducer(state: Object, action: infoVote) {
        return Object.assign({}, state, action);
    }
    const [stateObj, setState] = useReducer(stateReducer, {} as infoVote);

    //  国际化的包裹函数
    const lanWrap = (input: string) => t(`democracy:${input}`);

    function cInput(value: string) {
        runInAction(() => {
            democrcacyStore.voteDot = value;
        })
        //  forceUpdate
        setState({
            ableDot: stateObj.ableDot
        })
    }

    function changeRatio(value: number) {
        runInAction(() => {
            democrcacyStore.voteRatio = value;
        })
    }

    function nextSetp() {
        const { index } = history.location.state as HisState;
        if (stateObj.errStr || !democrcacyStore.voteDot) {
            message.error(lanWrap('Wrong number of votes'))
        } else {
            history.push(PAGE_NAME.DEMOCRACY_CHECK, { index })
        }
    }

    function setErrStr(value: string) {
        setState({
            errStr: value
        })
    }
    const { voteDot = '0', voteRatio} = democrcacyStore;
    //  倍率选择
    const ratioArr = useWeightArr();
    return (
        <Observer>{
            () => <div className={s.wrap}>
                <HeadBar word={lanWrap('Chain referendum')}/>
                <div className={s.contentWrap}>
                    <div className={s.bWapr}>
                        <div className={s.title}>{lanWrap('Number of votes')}</div>
                        <div className={s.dot}>{globalStore.ableBalance} DOT {lanWrap('available')}</div>
                    </div>
                    <DotInput changeInputFn={cInput} controlValue={voteDot} setErr={setErrStr} allDot={globalStore.ableBalance}/>
                    <div className={cx(s.bWapr, s.weight)}>
                        <div className={s.title}>{lanWrap('Voting weight')}</div>
                    </div>
                    <Select onChange={changeRatio} className={cx(s.select, 'reSelect')} defaultValue={ratioArr[0].ratio}>
                        {ratioArr.map((item, index) => {
                            const { text, ratio } = item;
                            return <Select.Option key={index} value={ratio}>{text}</Select.Option>
                        })}
                    </Select>
                    <div className={s.allVote}>{lanWrap('total')}<div className={s.voteNum}>{parseFloat(democrcacyStore.voteDot || '0') * voteRatio}</div>{lanWrap('polls')}</div>
                    <div className={s.split}/>
                    <BottonBtn word={lanWrap('next step')} cb={nextSetp}/>
                </div>
        </div>
        }
        </Observer>

    )
}

export default Entry;