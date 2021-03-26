/*
 * @Author: guanlanluditie 
 * @Date: 2021-02-17 17:20:34 
 * @Last Modified by: guanlanluditie
 * @Last Modified time: 2021-03-06 11:31:34
 */

import React, { FC } from 'react';
import s from './index.css';
import './index.antd.css';
import { useTranslation } from 'react-i18next';
import { Input } from 'antd';
import cx from 'classnames';
import { runInAction } from 'mobx';
import { observer } from 'mobx-react';
import { changeInput } from '@utils/input';
import { keyring } from '@polkadot/ui-keyring';
import UserAgreement from '@widgets/userAgreement';
import type { retrieveStoreType } from '../store';
import SecretInput from '@widgets/secretInput';
import { useHistory } from 'react-router-dom';
import { CHECT_STATUS } from '../store';
import { useStores } from '@utils/useStore';
import type { KeyringPair$Json } from '@polkadot/keyring/types';
import { PAGE_NAME } from '@constants/app';
import type { CreateResult } from '@polkadot/ui-keyring/types';
import { addNewAccount } from '@utils/tools';

const CommonPart:FC = function() {
    let { t } = useTranslation();
    const history = useHistory();
    const RetrieveStore = useStores('RetrieveStore') as retrieveStoreType;
    //  国际化的包裹函数
    const lanWrap = (input: string) => t(`retriveWallet:${input}`);

    function changeStatus() {
        runInAction(() => {
            RetrieveStore.checkAgreement = !RetrieveStore.checkAgreement;
        })
    }

    const isInMnemonic = history.location.pathname === PAGE_NAME.RW_MNEMONIC;

    async function importAccount() {
        const {  name, mnemonicWords, checkAgreement, secret, confirmSecret, keyStoreJsonStr } = RetrieveStore;
        if (!checkAgreement) {
            return runInAction(() => RetrieveStore.checkStatus = CHECT_STATUS.NOT_CHECK_AGREEMETN)
        }
        //  助记词恢复才需要校验密码
        if (isInMnemonic) {
            if (secret.length < 8) {
                return runInAction(() => RetrieveStore.checkStatus = CHECT_STATUS.SECRET_TOO_SHORT);
            }
            if (confirmSecret !== secret) {
                return runInAction(() => RetrieveStore.checkStatus = CHECT_STATUS.SECRECT_NOT_EQUAL);
            }
        }
        runInAction(() => RetrieveStore.checkStatus === CHECT_STATUS.PASS);
        if (isInMnemonic) {
            const mnemoRes = keyring.addUri(mnemonicWords, secret, { name });
            //  store和chrome存储都同步
            await addNewAccount(mnemoRes);
        } else {
            const parsedJson = JSON.parse(keyStoreJsonStr) as KeyringPair$Json;
            try {
                //  校验密码
                keyring.restoreAccount(parsedJson, secret);
            } catch {
                return runInAction(() => RetrieveStore.checkStatus = CHECT_STATUS.WRONG_PASS);
            }
            //  store和chrome存储都同步
            await addNewAccount({ json: parsedJson } as CreateResult);
        }
        //  回到首页
        history.push(PAGE_NAME.HOME);
    }

    function checkInfo() {
        const contentMap = {
            [CHECT_STATUS.PASS]: '',
            [CHECT_STATUS.NOT_CHECK_AGREEMETN]: lanWrap('Please check the user agreement'),
            [CHECT_STATUS.SECRECT_NOT_EQUAL]: lanWrap('Inconsistent password input'),
            [CHECT_STATUS.SECRET_TOO_SHORT]: lanWrap('The number of password digits is less than 8'),
            [CHECT_STATUS.WRONG_PASS]: lanWrap('Wrong password')
        }
        return <div className={s.checkInfo}>{contentMap[RetrieveStore.checkStatus]}</div>
    }

    const { name, checkAgreement, buttonActive, secret } = RetrieveStore;
    return (
        <>
            <div className={cx(s.title, s.topTitle)}>{lanWrap('user name')}</div>
            <Input
                value={name}
                onChange={(e) => changeInput(RetrieveStore, 'name', e)}
                className={cx(s.secInput, 'retrieveInput')} placeholder={lanWrap('title of account')}
            />
            {isInMnemonic ? <SecretInput secretKey='secret' checkSecretKey='confirmSecret' store={RetrieveStore}/>
                : <>
                    <div className={s.formTitle}>{lanWrap('Original password')}</div>
                    <Input.Password
                        value={secret}
                        onChange={(e) => changeInput(RetrieveStore, 'secret', e)}
                        className={cx(s.input, 'retrieveInput')}
                        placeholder={lanWrap('Wallet password')}
                    />
                </>  
            }
            {checkInfo()}
            <UserAgreement isCheck={checkAgreement} externalCallBack={changeStatus}/>
            <div className={cx(s.btn, buttonActive ? s.btnActive : '')} onClick={importAccount}>{lanWrap('Import Wallet')}</div>
        </>
    )
}

export default observer(CommonPart);