/*
 * @Author: guanlanluditie 
 * @Date: 2021-03-31 23:01:20 
 * @Last Modified by: guanlanluditie
 * @Last Modified time: 2021-04-01 08:45:08
 */

import React, { FC, useCallback } from 'react';
import cx from 'classnames';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { observer } from 'mobx-react';
import { globalStoreType } from '@entry/store';
import GlobalStore from '@entry/store';
import BottomBtn from '@widgets/bottomBtn';
import s from './index.scss';
import { approveAuthRequest, rejectAuthRequest } from '@utils/message/message';

const Auth:FC = function() {
    let { t } = useTranslation();
    const globalStore = GlobalStore as unknown as globalStoreType ;
    const history = useHistory();

    const _onApprove = useCallback(() => {
        const authId = globalStore.authReqList.slice(-1)?.[0].id || '0';
        approveAuthRequest(authId).catch((error: Error) => console.error(error));
    }, [globalStore.authReqList]);
    const _onReject = useCallback(() => {
        const authId = globalStore.authReqList.slice(-1)?.[0].id || '0';
        rejectAuthRequest(authId).catch((error: Error) => console.error(error));
    }, [globalStore.authReqList]);

    return (
        <div className={s.wrap}>

        </div>
    )
}

export default observer(Auth);