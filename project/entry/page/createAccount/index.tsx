/*
 * @Author: guanlanluditie 
 * @Date: 2021-01-27 00:17:53 
 * @Last Modified by: guanlanluditie
 * @Last Modified time: 2021-03-04 23:18:11
 */

import React, { FC } from 'react';
import s from './index.scss';
import HeadBar from '@widgets/headBar';
import { useTranslation } from 'react-i18next';
import SecretPart from './secret';
import Mnemonic from './mnemonic';
import { observer } from 'mobx-react';
import { CREAT_STAGE } from './contants';
import { useHistory } from 'react-router-dom';
import createStore from './store';
import cx from 'classnames';
import { runInAction } from 'mobx';

const CreactAccount:FC = function() {
    let { t } = useTranslation();
    const history = useHistory();

    function stageRender() {
        switch (createStore.createStage) {
            case CREAT_STAGE.SECRECT:
                return <SecretPart />
            default:
                return <Mnemonic />
        }
    }
    function resetStatus() {
        createStore.resetStore();
    }

    function createPageBack() {
        //  条件判断回退
        const { createStage } = createStore;
        if (createStage === CREAT_STAGE.SECRECT) {
            resetStatus()
            history.goBack();
        } else if (createStage === CREAT_STAGE.MNEMONIC_MASK || createStage === CREAT_STAGE.MNEMONIC_PLAIN) {
            runInAction(() => {
                createStore.createStage = CREAT_STAGE.SECRECT
            })
        } else {
            runInAction(() => {
                createStore.createStage = CREAT_STAGE.MNEMONIC_PLAIN
            })
        }
    }
 
    return (
        <div className={cx(s.wrap, createStore.createStage !== CREAT_STAGE.SECRECT ? s.mnBg : '')}>
            <HeadBar selfBack={createPageBack} word={t('createAccount:create wallet')}/>
            {stageRender()}
        </div>
    )
}

export default observer(CreactAccount);