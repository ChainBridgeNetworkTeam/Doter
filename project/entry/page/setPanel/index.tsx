/*
 * @Author: guanlanluditie 
 * @Date: 2021-02-15 21:55:52 
 * @Last Modified by: guanlanluditie
 * @Last Modified time: 2021-03-06 11:42:09
 */

import React, { FC } from 'react';
import s from './index.css';
import HeadBar from '@widgets/headBar';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import cx from 'classnames';
import { PAGE_NAME } from '@constants/app';

const SetPanel:FC = function() {
    let { t } = useTranslation();
    const history = useHistory();

    //  国际化的包裹函数
    const lanWrap = (input: string) => t(`setPanel:${input}`);

    function jump(path: string) {
        history.push(path);
    }

    return (
        <div className={s.wrap}>
            <HeadBar word={lanWrap('Setting')}/>
            <div className={cx(s.item, s.wallet)} onClick={() => jump(PAGE_NAME.WALLET_MANAGE)}>{lanWrap('Wallet management')}</div>
            <div className={cx(s.item, s.add)} onClick={() => jump(PAGE_NAME.RECIPIENT_ADDRESS)}>{lanWrap('Transfer address')}</div>
            <div className={cx(s.item, s.common)} onClick={() => jump(PAGE_NAME.GENERAL_SETTING)}>{lanWrap('General settings')}</div>
            <div className={cx(s.item, s.about)} onClick={() => jump(PAGE_NAME.ABOUT_US)}>{lanWrap('About doter')}</div>
            <div className={cx(s.item, s.agreement)} onClick={() => jump(PAGE_NAME.USER_AGREEMENT)}>{lanWrap('User agreement')}</div>
        </div>
    )
}

export default SetPanel;