/*
 * @Author: guanlanluditie 
 * @Date: 2021-03-01 09:40:07 
 * @Last Modified by: guanlanluditie
 * @Last Modified time: 2021-03-25 22:06:54
 */

import React, { FC } from 'react';
import s from './index.css';
import HeadBar from '@widgets/headBar';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import cx from 'classnames';
import { observer } from 'mobx-react';
import { runInAction } from 'mobx';
import { LOCAL_CONFIG } from '@constants/chrome';
import { useStores } from '@utils/useStore';
import { globalStoreType } from '@entry/store';
import { addressFormat } from '@utils/tools';
import { setStorage } from '@utils/chrome';
import { LOCAL_LANGUAGE } from '@constants/app';

const Entry:FC = function() {
    let { t, i18n } = useTranslation();
    const globalStore = useStores('GlobalStore') as globalStoreType;
    const history = useHistory();

    const { localConfig } = globalStore;

    //  国际化的包裹函数
    const lanWrap = (input: string) => t(`generalSetting:${input}`);

    function changeLanguage(lan: 'english' | 'chinese') {
        if (lan === localConfig.language) {
            return;
        }
        const targetLan = lan === 'english' ? 'en' : 'zh';
        window.localStorage.setItem(LOCAL_LANGUAGE, targetLan);
        i18n.changeLanguage(targetLan);
        runInAction(() => {
            globalStore.localConfig.language = lan;
        })
        setStorage({
            [LOCAL_CONFIG]: {
                ...localConfig,
                language: lan
            }
        })
    }

    return (
        <div className={s.wrap}>
            <HeadBar word={lanWrap('language')}/>
            <div className={s.item} onClick={() => changeLanguage('chinese')}>
                <div>简体中文</div>
                <div className={s.right}>
                    {localConfig.language === 'chinese' && <div className={s.arrow}/>}
                </div>
            </div>
            <div className={s.item}  onClick={() => changeLanguage('english')}>
                <div>English</div>
                <div className={s.right}>
                    {localConfig.language !== 'chinese' && <div className={s.arrow}/>}
                </div>
            </div>
            {/* <div className={s.btn}>保存</div> */}
        </div>
    )
}

export default observer(Entry);