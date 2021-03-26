/*
 * @Author: guanlanluditie 
 * @Date: 2021-03-02 23:18:40 
 * @Last Modified by: guanlanluditie
 * @Last Modified time: 2021-03-05 09:45:56
 */

import React, { FC } from 'react';
import s from './index.css';
import HeadBar from '@widgets/headBar';
import { useTranslation } from 'react-i18next';
import { observer } from 'mobx-react';
import { runInAction } from 'mobx';
import { LOCAL_CONFIG } from '@constants/chrome';
import { useStores } from '@utils/useStore';
import { globalStoreType } from '@entry/store';
import { setStorage } from '@utils/chrome';

const Entry:FC = function() {
    let { t } = useTranslation();
    const globalStore = useStores('GlobalStore') as globalStoreType;

    const { localConfig } = globalStore;

    //  国际化的包裹函数
    const lanWrap = (input: string) => t(`generalSetting:${input}`);

    function changAutoLock(time: number) {
        if (time === localConfig.autoLockTime) {
            return;
        }
        runInAction(() => {
            globalStore.localConfig.autoLockTime = time;
        })
        setStorage({
            [LOCAL_CONFIG]: {
                ...localConfig,
                autoLockTime: time
            }
        })
    }

    function itemRender() {
        const array = [{ text: lanWrap('1 minute'), value: 60 }, { text: lanWrap('5 minutes'), value: 300},
            { text: lanWrap('10 minutes'), value: 600}, { text: lanWrap('never'), value: Infinity}]
        return array.map(item => {
            const { text, value } = item;
            return <div className={s.item} onClick={() => changAutoLock(value)} key={text}>
            <div>{text}</div>
            <div className={s.right}>
                {localConfig.autoLockTime === value && <div className={s.arrow}/>}
            </div>
        </div>
        })
    }

    return (
        <div className={s.wrap}>
            <HeadBar word={lanWrap('Auto lock')}/>
            {itemRender()}
        </div>
    )
}

export default observer(Entry);