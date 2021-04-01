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
import s from './index.scss';
import { approveAuthRequest, rejectAuthRequest } from '@utils/message/message';

const Auth:FC = function() {
    let { t } = useTranslation();
    const globalStore = GlobalStore as unknown as globalStoreType ;
    const history = useHistory();

    const _onApprove = (authId: string) => approveAuthRequest(authId).catch((error: Error) => console.error(error));
    const _onReject = (authId: string) => rejectAuthRequest(authId).catch((error: Error) => console.error(error));
 
    function renderList() {
        return globalStore.authReqList.map((item, index) => {
            const { id } = item;
            return (
                <div key={index}>
                    <div onClick={() => _onApprove(id)}>确认</div>
                    <div onClick={() => _onReject(id)}>拒绝</div>
                </div>
            )
        })
    }

    return (
        <div className={s.wrap}>
            <div className={s.logo}>大家好</div>
            {renderList()}
        </div>
    )
}

export default observer(Auth);