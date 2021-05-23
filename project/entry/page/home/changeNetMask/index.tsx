/*
 * @Author: dianluyuanli-wp
 * @LastEditors: dianluyuanli-wp
 * @Date: 2021-05-20 23:14:27
 * @LastEditTime: 2021-05-22 21:39:12
 */

import React, { FC, useState } from 'react';
import s from './index.scss';
import cx from 'classnames';
import { useTranslation } from 'react-i18next';
import { NET_WORD, NET_TYPE } from '@constants/chain';
import globalStore from '../../../store';

const ChangeNetBtn:FC = function() {
    const [showMask, setShow] = useState(false);
    let { t } = useTranslation();
    t('home:locked')

    function changeNet(inputType: string) {
        const type = globalStore.netType;
        if (inputType === type) {
            return setShow(false);
        } else {
            globalStore.changeNetType(inputType);
        }
    }

    return (
        <>
            <div onClick={() => setShow(true)} className={s.changeBtn}>{globalStore.isKusama ? NET_WORD.KUSAMA : NET_WORD.POLKADOT}<div className={s.cArrow}/></div>
            {showMask && <div className={s.mask}>
                <div className={s.top}>{t('home:selectNet')}<div className={s.close} onClick={() => setShow(false)}/></div>
                <div className={s.single} onClick={() => changeNet(NET_TYPE.POLKADOT)}>
                    <div className={cx(s.icon)}/>
                    <div className={s.wrap}>
                        <div className={s.title}>DOT</div>
                        <div className={s.title2}>Polkadot</div>
                    </div>
                    {!globalStore.isKusama && <div className={s.arrow}/>}
                </div>
                <div className={s.single} onClick={() => changeNet(NET_TYPE.KUSAMA)}>
                    <div className={cx(s.icon, s.kIcon)}/>
                    <div className={s.wrap}>
                        <div className={s.title}>KSM</div>
                        <div className={s.title2}>Kusama</div>
                    </div>
                    {globalStore.isKusama && <div className={s.arrow}/>}
                </div>
            </div>}
        </>
    )
}

export default ChangeNetBtn;