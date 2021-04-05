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
            <div className={s.title}>
                <div className={s.logo}/>
                Doter
            </div>
            <div className={s.dotLogo}/>
            <div className={s.auth}>授权</div>
            <div className={s.infoWrap}>
                <div className={cx(s.icon, s.icon1)}/>
                <div className={s.infomation}>{'自动识别为的应用程序，正在请求访问你的账户地址'}</div>
            </div>
            <div className={s.infoWrap}>
                <div className={cx(s.icon, s.icon2)}/>
                <div className={s.infomation}>{'当您新人该应用程序时，才可允许此请求'}</div>
            </div>
            <BottomBtn word={'允许此应用程序访问'} cb={_onApprove} propClass={cx(s.btn, s.btn1)}/>
            <BottomBtn word={'拒绝'} cb={_onReject} propClass={cx(s.btn, s.btnRej)}/>
            {/* {renderList()} */}
        </div>
    )
}

export default observer(Auth);