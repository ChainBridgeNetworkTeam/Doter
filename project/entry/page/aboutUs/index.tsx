/*
 * @Author: guanlanluditie 
 * @Date: 2021-03-03 09:12:31 
 * @Last Modified by: guanlanluditie
 * @Last Modified time: 2021-03-28 20:21:43
 */

import React, { FC } from 'react';
import s from './index.css';
import HeadBar from '@widgets/headBar';
import cx from 'classnames';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { observer } from 'mobx-react';
import { useStores } from '@utils/useStore';
import { globalStoreType } from '@entry/store';

const Entry:FC = function() {
    let { t } = useTranslation();
    const globalStore = useStores('GlobalStore') as globalStoreType;
    const history = useHistory();

    function jumpToLink(url: string) {
        window.open(url,"_blank")
    }

    function renderItem() {
        const array = [
            //  { text: t('aboutUs:website'), link: 'https://chainbridge.network'},
            { text: 'Twitter', link: 'https://twitter.com/ChainBridgeNet1'},
            //  { text: t('aboutUs:WeChat official account'), link: 'ChainBridgeNetwork'}
        ];
        return <>
            {array.map(item => {
                    const { text, link } = item;
                    return <div className={s.itemWrap}  key={text}>
                        <div>{text}</div>
                        <div className={s.link} onClick={() => jumpToLink(link)}>{link}</div>
                    </div>
            })}
            <div className={cx(s.itemWrap, s.noPointer)}>
                <div>{t('aboutUs:WeChat official account')}</div>
                <div className={s.ctext}>{'ChainBridgeNetwork'}</div>
            </div>
        </>
    }

    return (
        <div className={s.wrap}>
            <HeadBar word={t('aboutUs:about Doter')}/>
            <div className={s.logo} />
            <div className={s.title}>Doter</div>
            <div className={s.title}>v1.0.0</div>
            {renderItem()}
        </div>
    )
}

export default observer(Entry);