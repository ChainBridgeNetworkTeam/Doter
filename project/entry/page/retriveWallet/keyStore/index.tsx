/*
 * @Author: guanlanluditie 
 * @Date: 2021-02-20 09:07:13 
 * @Last Modified by: guanlanluditie
 * @Last Modified time: 2021-03-06 11:33:17
 */

import React, { FC, useEffect } from 'react';
import s from './index.css';
import HeadBar from '@widgets/headBar';
import { useTranslation } from 'react-i18next';
import { Input } from 'antd';
import cx from 'classnames';
import { observer } from 'mobx-react';
import { runInAction } from 'mobx';
import './index.antd.css';
import { useStores } from '@utils/useStore';
import { globalStoreType } from '@entry/store';
import { validateKeyStoreJsonStr } from '@utils/tools';
import CommonPart from '../commonPart';
import { changeInput } from '@utils/input';
import { retrieveStoreType } from '../store';

const Mnemonic:FC = function() {
    let { t } = useTranslation();
    const globalStore = useStores('GlobalStore') as globalStoreType;
    const RetrieveStore = useStores('RetrieveStore') as retrieveStoreType;

    //  国际化的包裹函数
    const lanWrap = (input: string) => t(`retriveWallet:${input}`);

    function inputRestoreJson(e: React.ChangeEvent<HTMLTextAreaElement>) {
        const inputValue = e.target.value;
        changeInput(RetrieveStore, 'keyStoreJsonStr', e);
        const validateRes = validateKeyStoreJsonStr(inputValue);
        runInAction(() => {
            RetrieveStore.mnemonicErrMsg = validateRes.errMsg;
        })
    }

    useEffect(() => {
        const { name, keyStoreJsonStr, checkAgreement, keyStoreErrMsg } = RetrieveStore;
        runInAction(() => {
            RetrieveStore.buttonActive = (name && keyStoreJsonStr && !keyStoreErrMsg && checkAgreement)
        })
    }, [RetrieveStore.name, RetrieveStore.keyStoreJsonStr, RetrieveStore.keyStoreErrMsg, RetrieveStore.checkAgreement])

    return (
        <div className={s.wrap}>
            <HeadBar word={lanWrap('Creating wallets')}/>
            <div className={s.wordsWrap}>
                <div className={cx(s.title, s.topTitle)}>keyStore Json</div>
                <Input.TextArea autoSize={{ minRows: 2 }} value={RetrieveStore.keyStoreJsonStr} onChange={(e) => inputRestoreJson(e)} className={s.textArea} placeholder={lanWrap('Please paste the contents of keystore JSON file')}/>
                <div className={s.addressError}>{RetrieveStore.keyStoreErrMsg}</div>
                <CommonPart />
            </div>
        </div>
    )
}

export default observer(Mnemonic);