/*
 * @Author: guanlanluditie 
 * @Date: 2021-03-01 09:40:07 
 * @Last Modified by: guanlanluditie
 * @Last Modified time: 2021-03-25 22:06:54
 */

import React, { FC, useState } from 'react';
import s from './index.scss';
import HeadBar from '@widgets/headBar';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import cx from 'classnames';
import { observer } from 'mobx-react';
import { runInAction } from 'mobx';
import { LOCAL_CONFIG } from '@constants/chrome';
import CommonBtn from '@widgets/bottomBtn';
import { setStorage } from '@utils/chrome';
import { updateLanguage } from '@utils/tools';
import { LOCAL_LANGUAGE, PAGE_NAME } from '@constants/app';
import globalStore from '../../../store';

const Entry:FC = function() {
    let { t, i18n } = useTranslation();
    const history = useHistory();

    const { localConfig } = globalStore;
    const [conLanguage, setLan] = useState(localConfig.language)

    //  国际化的包裹函数
    const lanWrap = (input: string) => t(`generalSetting:${input}`);

    function changeLanguage() {
        const lan = conLanguage;
        const targetLan = lan === 'english' ? 'en' : 'zh';
        i18n.changeLanguage(targetLan);
        updateLanguage(conLanguage);
        history.push(PAGE_NAME.HOME);
    }

    function changeLoacl(lan: 'english' | 'chinese') {
        setLan(lan);
    }

    return (
        <div className={s.wrap}>
            <HeadBar word={lanWrap('language')}/>
            <div className={cx(s.item, 'chineseT')} onClick={() => changeLoacl('chinese')}>
                <div>简体中文</div>
                <div className={s.right}>
                    {conLanguage === 'chinese' && <div className={cx(s.arrow, 'chineseArrow')}/>}
                </div>
            </div>
            <div className={s.item}  onClick={() => changeLoacl('english')}>
                <div>English</div>
                <div className={s.right}>
                    {conLanguage !== 'chinese' && <div className={s.arrow}/>}
                </div>
            </div>
            <CommonBtn word={lanWrap('save')} propClass={s.btn} cb={changeLanguage}/>
        </div>
    )
}

export default observer(Entry);