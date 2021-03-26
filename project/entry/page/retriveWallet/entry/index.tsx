/*
 * @Author: guanlanluditie 
 * @Date: 2021-02-16 17:54:00 
 * @Last Modified by: guanlanluditie
 * @Last Modified time: 2021-03-06 11:25:19
 */

import React, { FC } from 'react';
import s from './index.css';
import HeadBar from '@widgets/headBar';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import cx from 'classnames';
import { PAGE_NAME } from '@constants/app';
import RetrieveStore from '../store';

const Entry:FC = function() {
    let { t } = useTranslation();
    const history = useHistory();
    //  国际化的包裹函数
    const lanWrap = (input: string) => t(`retriveWallet:${input}`);

    function jump(path: string) {
        //  重新进入的时候要重置数据
        RetrieveStore.resetStore();
        history.push(path);
    }

    return (
        <div className={s.wrap}>
            <HeadBar word={lanWrap('Creating wallets')}/>
            <div className={cx(s.item, s.wallet)} onClick={() => jump(PAGE_NAME.CREATE_ACCOUNT)}>{lanWrap('Creating wallets')}</div>
            <div className={cx(s.title, s.titlePadding)}>{lanWrap('Import Wallet')}</div>
            <div className={cx(s.item, s.word)} onClick={() => jump(PAGE_NAME.RW_MNEMONIC)}>{lanWrap('Mnemonic words')}</div>
            {/* <div className={cx(s.item, s.key)} onClick={() => {}}>私钥</div> */}
            <div className={cx(s.item, s.store)} onClick={() => jump(PAGE_NAME.RW_KEYSTORE)}>KeyStore</div>
        </div>
    )
}

export default Entry;