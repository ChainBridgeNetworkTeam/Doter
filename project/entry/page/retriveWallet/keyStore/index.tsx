/*
 * @Author: guanlanluditie 
 * @Date: 2021-02-20 09:07:13 
 * @Last Modified by: guanlanluditie
 * @Last Modified time: 2021-03-27 22:25:33
 */

import React, { FC, useEffect } from 'react';
import s from './index.scss';
import HeadBar from '@widgets/headBar';
import { useTranslation } from 'react-i18next';
import { Input } from 'antd';
import cx from 'classnames';
import { observer } from 'mobx-react';
import { runInAction } from 'mobx';
import { useStores } from '@utils/useStore';
import { globalStoreType } from '@entry/store';
import { validateKeyStoreJsonStr } from '@utils/tools';
import CommonPart from '../commonPart';
import { changeInput } from '@utils/input';
import RetrieveStore, { retrieveStoreType } from '../store';

const Mnemonic:FC = function() {
    let { t } = useTranslation();
    const globalStore = useStores('GlobalStore') as globalStoreType;

    //  国际化的包裹函数
    const lanWrap = (input: string) => t(`retriveWallet:${input}`);

    function inputRestoreJson(e: React.ChangeEvent<HTMLTextAreaElement>) {
        const inputValue = e.target.value;
        changeInput(RetrieveStore, 'keyStoreJsonStr', e);
        const validateRes = validateKeyStoreJsonStr(inputValue);
        runInAction(() => {
            RetrieveStore.keyStoreErrMsg = validateRes.errMsg;
        })
    }

    useEffect(() => {
        const { keyStoreJsonStr, checkAgreement, keyStoreErrMsg, secret } = RetrieveStore;
        runInAction(() => {
            RetrieveStore.buttonActive = !!(keyStoreJsonStr && !keyStoreErrMsg && checkAgreement && secret)
        })
    }, [RetrieveStore.name, RetrieveStore.keyStoreJsonStr, RetrieveStore.keyStoreErrMsg, RetrieveStore.checkAgreement, RetrieveStore.secret])

    return (
        <div className={s.wrap}>
            <HeadBar word={lanWrap('Creating wallets')}/>
            <div className={s.wordsWrap}>
                <div className={cx(s.title, s.topTitle)}>Keystore</div>
                <Input.TextArea autoSize={{ minRows: 2 }} value={RetrieveStore.keyStoreJsonStr} onChange={(e) => inputRestoreJson(e)} className={s.textArea} placeholder={lanWrap('Please paste the contents of keystore JSON file')}/>
                <div className={s.addressError}>{RetrieveStore.keyStoreErrMsg}</div>
                <CommonPart />
            </div>
        </div>
    )
}

export default observer(Mnemonic);