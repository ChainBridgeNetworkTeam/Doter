/*
 * @Author: guanlanluditie 
 * @Date: 2021-02-27 21:17:37 
 * @Last Modified by: guanlanluditie
 * @Last Modified time: 2021-03-06 11:59:48
 */

import React, { FC, useReducer } from 'react';
import s from './index.css';
import HeadBar from '@widgets/headBar';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { useStores } from '@utils/useStore';
import { globalStoreType } from '@entry/store';
import { Input, message, Spin } from 'antd';
import { keyring } from '@polkadot/ui-keyring';
import { runInAction } from 'mobx';
import { PAGE_NAME } from '@constants/app';
import { removeStorage, setStorage, getStorage } from '@utils/chrome';
import { ADDRESS_ARRAY, FAVORITE_ACCOUNT } from '@constants/chrome';

interface HState {
    address?: string;
}

interface SecState {
    secret?: string,
    errorInfo?: string,
    isSpining?: boolean,
}

const DeleteAccount:FC = function() {
    let { t } = useTranslation();
    const globalStore = useStores('GlobalStore') as globalStoreType;
    const { favoriteAccount } = globalStore;
    const history = useHistory();

    //  国际化的包裹函数
    const lanWrap = (input: string) => t(`setWalletDetial:${input}`);

    //  状态管理
    function stateReducer(state: Object, action: SecState) {
        return Object.assign({}, state, action);
    }
    const [stateObj, setState] = useReducer(stateReducer, { secret: '', errorInfo: '', isSpining: false } as SecState);

    const { address } = history.location.state as HState;
    const configAccount = globalStore.accountObj[address];

    function enterSec(e: React.ChangeEvent<HTMLInputElement>) {
        setState({
            secret: e.target.value
        });
    }

    async function deleteAccount(add: string) {
        //  避免冒泡
        let addArr = globalStore.addressArr;
        const targetIndex = addArr.indexOf(add);
        addArr.splice(targetIndex, 1);
        const isFavorite = add === favoriteAccount;
        setStorage({
            [FAVORITE_ACCOUNT]: (isFavorite ? addArr[0] : globalStore.favoriteAccount)
        })
        if (add === favoriteAccount) {
            runInAction(() => {
                globalStore.favoriteAccount = addArr[0];
            })
        }
    }

    async function confirm() {
        setState({
            isSpining: true
        });
        setTimeout(async () => {
            try {
                keyring.restoreAccount(configAccount, stateObj.secret);
            } catch(e) {
                return setState({
                    errorInfo: lanWrap('Wrong password'),
                    isSpining: false
                })
            }
            setState({
                isSpining: false,
                errorInfo: '',
            })
            await deleteAccount(address);
            message.info(lanWrap('Account deleted'));
            history.push(PAGE_NAME.HOME);
        }, 0)
    }

    return (
        <div className={s.wrap}>
            <HeadBar word={lanWrap('Delete Wallet')}/>
            <Input.Password onChange={enterSec} className={s.input} placeholder={lanWrap('Please input a password')}/>
            <div className={s.info}>{stateObj.errorInfo}</div>
            <Spin spinning={stateObj.isSpining}>
                <div className={s.confirm} onClick={confirm}>{lanWrap('confirm')}</div>
            </Spin>
        </div>
    )
}

export default DeleteAccount;