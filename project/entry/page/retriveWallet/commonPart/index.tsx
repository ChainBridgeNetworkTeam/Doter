/*
 * @Author: guanlanluditie 
 * @Date: 2021-02-17 17:20:34 
 * @Last Modified by: guanlanluditie
 * @Last Modified time: 2021-04-03 17:13:43
 */

import React, { FC } from 'react';
import s from './index.scss';
import { useTranslation } from 'react-i18next';
import { Input } from 'antd';
import cx from 'classnames';
import { runInAction } from 'mobx';
import { observer } from 'mobx-react';
import { changeInput } from '@utils/input';
import { keyring } from '@polkadot/ui-keyring';
import UserAgreement from '@widgets/userAgreement';
import RetrieveStore, { retrieveStoreType } from '../store';
import SecretInput from '@widgets/secretInput';
import { useHistory } from 'react-router-dom';
import { CHECT_STATUS } from '../store';
import { createAccountSuri, jsonRestore } from '@utils/message/message';
import type { KeyringPair$Json } from '@polkadot/keyring/types';
import { PAGE_NAME } from '@constants/app';
import type { CreateResult } from '@polkadot/ui-keyring/types';
import { addNewAccount } from '@utils/tools';

const CommonPart:FC = function() {
    let { t } = useTranslation();
    const history = useHistory();
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
        runInAction(() => {
            RetrieveStore.checkStatus = CHECT_STATUS.PASS;
        });
        if (isInMnemonic) {
            const mnemoRes = keyring.addUri(mnemonicWords, secret, { name });
            //  store和chrome存储都同步
            createAccountSuri(name, secret, mnemonicWords, undefined).catch(e => console.log('backup accound from mnemonic failed', e));
            await addNewAccount(mnemoRes);
        } else {
            const parsedJson = JSON.parse(keyStoreJsonStr) as KeyringPair$Json;
            let restorePair;
            try {
                //  校验密码
                restorePair = keyring.restoreAccount(parsedJson, secret);
            } catch {
                return runInAction(() => RetrieveStore.checkStatus = CHECT_STATUS.WRONG_PASS);
            }
            //  同步background的account
            jsonRestore(parsedJson, secret).catch(e => console.log('backup from json file failed', e));
            //  store和chrome存储都同步
            await addNewAccount({ json: parsedJson, pair: restorePair } as CreateResult);
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
        return <div className={cx(s.checkInfo, 'reCheckInfo')}>{contentMap[RetrieveStore.checkStatus]}</div>
    }

    const { name, checkAgreement, buttonActive, secret } = RetrieveStore;
    return (
        <>
            {isInMnemonic && <>
                    <div className={cx(s.title, s.topTitle)}>{lanWrap('user name')}</div>
                    <Input
                        value={name}
                        onChange={(e) => changeInput(RetrieveStore, 'name', e)}
                        className={cx(s.secInput, s.retrieveInput)} placeholder={lanWrap('title of account')}
                    />
                </>
            }
            {isInMnemonic ? <SecretInput secretKey='secret' checkSecretKey='confirmSecret' store={RetrieveStore}/>
                : <>
                    <div className={s.formTitle}>{lanWrap('Original password')}</div>
                    <Input.Password
                        value={secret}
                        onChange={(e) => changeInput(RetrieveStore, 'secret', e)}
                        className={cx(s.input, s.retrieveInput)}
                        placeholder={lanWrap('Wallet password')}
                    />
                </>  
            }
            {checkInfo()}
            <div className={s.bottonPart}>
                <UserAgreement isCheck={checkAgreement} externalCallBack={changeStatus}/>
                <div className={cx(s.btn, buttonActive ? s.btnActive : '', 'reBtn')} onClick={importAccount}>{lanWrap('Import Wallet')}</div>
            </div>

        </>
    )
}

export default observer(CommonPart);