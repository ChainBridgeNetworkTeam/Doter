/*
 * @Author: guanlanluditie 
 * @Date: 2021-03-03 09:12:31 
 * @Last Modified by: guanlanluditie
 * @Last Modified time: 2021-03-24 23:45:58
 */

import React, { FC } from 'react';
import s from './index.css';
import HeadBar from '@widgets/headBar';
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
            { text: 'Twitter', link: '@ChainBridgeNetwork'},
            //  { text: t('aboutUs:WeChat official account'), link: 'ChainBridgeNetwork'}
        ];
        return array.map(item => {
            const { text, link } = item;
            return <div className={s.itemWrap}  key={text}>
                <div>{text}</div>
                <div className={s.link} onClick={() => jumpToLink(link)}>{link}</div>
            </div>
        })
    }

    return (
        <div className={s.wrap}>
            <HeadBar word={t('aboutUs:about Doter')}/>
            <div className={s.logo} />
            <div className={s.title}>Doter</div>
            <div className={s.title}>v0.0.1</div>
            {renderItem()}
        </div>
    )
}

export default observer(Entry);