/*
 * @Author: guanlanluditie 
 * @Date: 2021-02-27 09:56:21 
 * @Last Modified by: guanlanluditie
 * @Last Modified time: 2021-02-27 20:20:39
 */

import React, { FC, useReducer } from 'react';
import s from './index.css';
import HeadBar from '@widgets/headBar';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { observer } from 'mobx-react';
import { Spin } from 'antd';
import { useStores } from '@utils/useStore';
import { globalStoreType } from '@entry/store';
import { Input } from 'antd';
import { keyring } from '@polkadot/ui-keyring';
import { saveAs } from 'file-saver';

interface HState {
    address?: string;
}

interface SecState {
    secret?: string,
    infoStr?: string,
    isSpining?: boolean
}

const ChangeSec:FC = function() {
    let { t } = useTranslation();
    const globalStore = useStores('GlobalStore') as globalStoreType;
    const history = useHistory();

    //  状态管理
    function stateReducer(state: Object, action: SecState) {
        return Object.assign({}, state, action);
    }
    const [stateObj, setState] = useReducer(stateReducer, { infoStr: '', secret: '', isSpining: false } as SecState);

    function jump(path: string) {
        history.push(path);
    }

    const { address } = history.location.state as HState;
    const targetAccount = globalStore.accountObj[address];

    function secInput(e: React.ChangeEvent<HTMLInputElement>) {
        setState({
            secret: e.target.value
        })
    }

    function btnCLick() {
        setState({
            isSpining: true
        })
        //  上面setState本身是异步的，不这样没法有spin效果
        setTimeout(() => {
            try {
                keyring.restoreAccount(targetAccount, stateObj.secret);
            } catch(e) {
                console.log(e);
                return setState({
                    infoStr: '密码错误',
                    isSpining: false
                })
            }
            const blob = new Blob([JSON.stringify(targetAccount)], { type: 'application/json; charset=utf-8' })
            saveAs(blob, `address-${address}.json`)
            setState({
                infoStr: '',
                isSpining: false
            })
        }, 0)
    }

    return (
        <div className={s.wrap}>
            <HeadBar word={'备份keyStore'}/>
            <div className={s.contentWrap}>
                <Input.Password onChange={secInput} className={s.input} placeholder={'钱包密码'}/>
                <div className={s.info}>{stateObj.infoStr}</div>
                <Spin spinning={stateObj.isSpining}>
                    <div className={s.confirm} onClick={btnCLick}>确认</div>
                </Spin>
            </div>
        </div>
    )
}

export default observer(ChangeSec);