/*
 * @Author: guanlanluditie 
 * @Date: 2021-02-26 09:24:07 
 * @Last Modified by: guanlanluditie
 * @Last Modified time: 2021-03-06 12:05:53
 */

import React, { FC, useReducer, useEffect } from 'react';
import s from './index.scss';
import HeadBar from '@widgets/headBar';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { observer } from 'mobx-react';
import cx from 'classnames';
import { useStores } from '@utils/useStore';
import { keyring } from '@polkadot/ui-keyring';
import { globalStoreType } from '@entry/store';
import { Input, Spin } from 'antd';
import SecretInput from '@widgets/secretInput';
import SWStore from '../store';
import { message } from 'antd';
import type { CreateResult } from '@polkadot/ui-keyring/types';

interface HState {
    address?: string;
}

const INFO_STATUS = {
    ONE: 0,
    TWO: 1,
    THREE: 2,
    FOUR: 3,
    FIVE: 4,
}

const OLD_PASS_ARR = [INFO_STATUS.FOUR, INFO_STATUS.FIVE];
const NEW_PASS_ARR = [INFO_STATUS.ONE, INFO_STATUS.TWO, INFO_STATUS.THREE];

interface SecState {
    oldSec?: string,
    infoStatus?: number,
    buttonActive?: boolean,
    isSpining?: boolean
}

const ChangeSec:FC = function() {
    let { t } = useTranslation();
    const globalStore = useStores('GlobalStore') as globalStoreType;
    const history = useHistory();

    //  国际化的包裹函数
    const lanWrap = (input: string) => t(`setWalletDetial:${input}`);

    //  状态管理
    function stateReducer(state: Object, action: SecState) {
        return Object.assign({}, state, action);
    }
    const [stateObj, setState] = useReducer(stateReducer, { infoStatus: INFO_STATUS.ONE, oldSec: '', isSpining: false } as SecState);

    const { address } = history.location.state as HState;
    const targetAccount = globalStore.accountObj[address];

    function oldSecInput(e: React.ChangeEvent<HTMLInputElement>) {
        setState({
            oldSec: e.target.value
        })
    }

    useEffect(() => {
        const { secret, confirmSecret } = SWStore;
        if (!stateObj.oldSec) {
            return setState({
                infoStatus: INFO_STATUS.FIVE,
                buttonActive: false
            })
        }
        if (secret.length < 8) {
            return setState({
                infoStatus: INFO_STATUS.TWO,
                buttonActive: false
            })
        }
        if (secret !== confirmSecret) {
            return setState({
                infoStatus: INFO_STATUS.THREE,
                buttonActive: false
            })
        }
        setState({
            infoStatus: INFO_STATUS.ONE,
            buttonActive: true
        })
    }, [SWStore.secret, SWStore.confirmSecret, stateObj.oldSec])

    function btnCLick() {
        if (stateObj.buttonActive) {
            setState({
                isSpining: true
            })
            setTimeout(() => {
                try {
                    keyring.restoreAccount(targetAccount, stateObj.oldSec);
                } catch(e) {
                    return setState({
                        infoStatus: INFO_STATUS.FOUR,
                        isSpining: false
                    })
                }
                const keyPair = keyring.getPair(address);
                //  没有这一步无法改密，不知道为啥，这一步貌似会解出来私钥
                keyPair.decodePkcs8(stateObj.oldSec);
                const newJson = keyPair.toJson(SWStore.secret);
                newJson.meta.whenEdited = Date.now();
                message.info(lanWrap('Password modified successfully'));
                history.goBack();
                setState({
                    isSpining: false
                })
            }, 0)
        }
    }

    function info() {
        const contentMap = {
            [INFO_STATUS.ONE]: lanWrap('No less than 8 characters. It is recommended to mix upper and lower case letters, numbers and symbols'),
            [INFO_STATUS.TWO]: lanWrap('The number of password digits is less than 8'),
            [INFO_STATUS.THREE]: lanWrap('The two passwords are inconsistent'),
            [INFO_STATUS.FOUR]: lanWrap('Wrong password'),
            [INFO_STATUS.FIVE]: lanWrap('please input oldPass')
        }
        return <div className={s.info}>{contentMap[stateObj.infoStatus]}</div>
    }

    const { infoStatus } = stateObj;

    return (
        <div className={s.wrap}>
            <HeadBar word={lanWrap('Change wallet password')}/>
            <Spin spinning={stateObj.isSpining}>
                <div className={s.contentWrap}>
                    <div className={s.topTitle}>{lanWrap('Old password')}</div>
                    <Input.Password onChange={(e) => oldSecInput(e)} className={s.input} placeholder={lanWrap('Wallet password')}/>
                    <div className={s.forMargin}>{OLD_PASS_ARR.includes(infoStatus) && info()}</div>
                    <SecretInput title={lanWrap('New password')} secretKey='secret' checkSecretKey='confirmSecret' store={SWStore}/>
                    {NEW_PASS_ARR.includes(infoStatus) && info()}
                    <div className={cx(s.confirm, stateObj.buttonActive ? s.active : '')} onClick={btnCLick}>{lanWrap('confirm')}</div>
                </div>
            </Spin>
        </div>
    )
}

export default observer(ChangeSec);