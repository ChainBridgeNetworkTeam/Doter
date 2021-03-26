/*
 * @Author: guanlanluditie 
 * @Date: 2021-01-27 00:17:53 
 * @Last Modified by: guanlanluditie
 * @Last Modified time: 2021-03-04 23:18:11
 */

import React, { FC } from 'react';
import s from './index.css';
import HeadBar from '@widgets/headBar';
import { useTranslation } from 'react-i18next';
import SecretPart from './secret';
import Mnemonic from './mnemonic';
import { observer } from 'mobx-react';
import { useStores } from '@utils/useStore';
import { CREAT_STAGE } from './contants';
import { CreateStoreType } from './store';
import cx from 'classnames';



const CreactAccount:FC = function() {
    let { t } = useTranslation();
    const createStore = useStores('CreateAccountStore') as CreateStoreType;

    function stageRender() {
        const widgetMap = {
            [CREAT_STAGE.SECRECT]: SecretPart,
            [CREAT_STAGE.MNEMONIC]: Mnemonic
        }
        const Target = widgetMap[createStore.createStage];
        return <Target />
    }
    function resetStatus() {
        createStore.resetStore();
    }
 
    return (
        <div className={cx(s.wrap, createStore.createStage === CREAT_STAGE.MNEMONIC ? s.mnBg : '')}>
            <HeadBar externalCallBack={resetStatus} word={t('createAccount:create wallet')}/>
            {stageRender()}
        </div>
    )
}

export default observer(CreactAccount);