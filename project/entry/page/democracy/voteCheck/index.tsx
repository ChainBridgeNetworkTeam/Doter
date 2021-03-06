/*
 * @Author: guanlanluditie 
 * @Date: 2021-03-07 15:32:20 
 * @Last Modified by: guanlanluditie
 * @Last Modified time: 2021-03-20 21:10:05
 */

import React, { FC, useEffect, useState, useReducer } from 'react';
import s from './index.scss';
import HeadBar from '@widgets/headBar';
import BottonBtn from '@widgets/bottomBtn';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { observer } from 'mobx-react';
import { useStores } from '@utils/useStore';
import democrcacyStore from '../store';
import { Input, message, Spin } from 'antd';
import cx from 'classnames';
import { keyring } from '@polkadot/ui-keyring';
import { WEIGHT_ARR } from '@constants/chain';
import { globalStoreType } from '@entry/store';
import { dotStrToTransferAmount } from '@utils/tools';
import { PAGE_NAME } from '@constants/app';
import { useTokenName, useFeeRate } from '@utils/tools';

interface checkStatus {
    passWord?: string;
    errPass?: boolean;
    isLoading?: boolean;
}

interface HisState {
    index: number
}

const Entry:FC = function() {
    let { t } = useTranslation();
    const globalStore = useStores('GlobalStore') as globalStoreType;
    const history = useHistory();
    const tokenName = useTokenName();
    const feeRate = useFeeRate();

    function stateReducer(state: Object, action: checkStatus) {
        return Object.assign({}, state, action);
    }
    const [stateObj, setState] = useReducer(stateReducer, {} as checkStatus);

    //  国际化的包裹函数
    const lanWrap = (input: string) => t(`democracy:${input}`);

    const { api, currentAccount } = globalStore;
    const { reScanDetial, voteDot, voteRatio, action } = democrcacyStore;
    const { index } = history.location.state as HisState;
    const { pre_image = {}, referendum_index } = reScanDetial[index];
    const { call_module, call_name } = pre_image;

    function getVoteAction() {
        return api.tx.democracy.vote(referendum_index, {
            Standard: {
                balance: dotStrToTransferAmount(voteDot),
                vote: { aye: action === 'support', conviction: parseInt('' + voteRatio) }
            }
        });
    }

    function changePass(e: React.ChangeEvent<HTMLInputElement>) {
        setState({ passWord: e.target.value })
    }

    //  投票操作
    async function vote() {
        let sendPair = keyring.createFromJson(currentAccount);
        if (!stateObj.passWord) {
            return;
        }
        setState({
            isLoading: true
        })
        try {
            sendPair.decodePkcs8(stateObj.passWord)
        } catch(e) {
            console.log(e);
            setState({ errPass: true, isLoading: false });
            return;
        }

        setState({ errPass: false })
        try {
            const voteAction = getVoteAction();
            const result = await voteAction.signAndSend(sendPair);
            message.info(lanWrap('success'));
            history.push(PAGE_NAME.HOME);
            console.log(result);
        } catch (e) {
            console.log(e)
        } finally {
            setState({
                isLoading: false
            })
        }
    }

    return (
        <div className={s.wrap}>
            <HeadBar word={lanWrap('Chain referendum')}/>
            <div className={s.contentWrap}>
                <div className={s.title}>{lanWrap('Voting information')}</div>
                <div className={s.colum}>
                    <div className={s.cTitle}>{lanWrap('Voting proposal')}</div>
                    <div className={s.cContent}>#{`${referendum_index} ${call_module}.${call_name}`}</div>
                </div>
                <div className={s.colum}>
                    <div className={s.cTitle}>{lanWrap('Number of votes')}</div>
                    <div className={s.cContent}>{voteDot} {tokenName}</div>
                </div>
                <div className={s.colum}>
                    <div className={s.cTitle}>{lanWrap('Voting weight')}</div>
                    <div className={s.cContent}>{WEIGHT_ARR.find(item => item.ratio === voteRatio).text}</div>
                </div>
                <div className={s.colum}>
                    <div className={s.cTitle}>{lanWrap('total')}</div>
                    <div className={s.cContent}>{parseFloat(voteDot) * 10 *  voteRatio / 10} polls ({voteDot}×{voteRatio})</div>
                </div>
                <div className={s.colum}>
                    <div className={s.cTitle}>{lanWrap("Miner's fee")}</div>
                    <div className={s.cContent}>{democrcacyStore.minerFee} {tokenName}</div>
                </div>
                <div className={s.title}>{lanWrap('Password confirmation')}</div>
                <Input.Password
                    onChange={changePass}
                    className={cx(s.input)}
                    placeholder={lanWrap('Wallet password')}
                />
                <div className={s.errPass}>{stateObj.errPass ? lanWrap('Wrong password') : ''}</div>
                <Spin spinning={stateObj.isLoading}>
                    <BottonBtn cb={vote} propClass={cx(stateObj.passWord ? '' : s.notActive)} word={lanWrap('confirm')}/>
                </Spin>
            </div>
        </div>
    )
}

export default observer(Entry);