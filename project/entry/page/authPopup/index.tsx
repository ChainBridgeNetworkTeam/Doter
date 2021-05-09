/*
 * @Author: guanlanluditie 
 * @Date: 2021-03-31 23:01:20 
 * @Last Modified by: guanlanluditie
 * @Last Modified time: 2021-04-01 08:45:08
 */

import React, { FC } from 'react';
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

    //  国际化的包裹函数
    const lanWrap = (input: string) => t(`authPopup:${input}`);

    const target = globalStore.authReqList.slice(-1)?.[0];
    const _onApprove = (authId: string) => {
        approveAuthRequest(authId).catch((error: Error) => console.error(error));
    }
    const _onReject = (authId: string) => {
        rejectAuthRequest(authId).catch((error: Error) => console.error(error));
    }

    function renderList() {
        return globalStore.authReqList.map((item, index) => {
            const { id = '0' } = item;
            return <div key={index} className={s.sWraper}>
                <div className={s.infoWrap}>
                    <div className={cx(s.icon, s.icon1)}/>
                    <div className={s.infomation}>{lanWrap('App automatically identified as%, requesting access to your account address').replace('%', target.request.origin)}</div>
                </div>
                <div className={s.infoWrap}>
                    <div className={cx(s.icon, s.icon2)}/>
                    <div className={s.infomation}>{lanWrap('You can only allow this request when you trust the application')}</div>
                </div>
                <BottomBtn word={lanWrap('Allow this application to access')} cb={() => _onApprove(id)} propClass={cx(s.btn, s.btn1)}/>
                <BottomBtn word={lanWrap('Reject')} cb={() => _onReject(id)} propClass={cx(s.btn, s.btnRej)}/>
            </div>
        })
    }

    return (
        <div className={s.wrap}>
            <div className={s.title}>
                <div className={s.logo}/>
                Doter
            </div>
            <div className={s.dotLogo}/>
            <div className={s.auth}>{lanWrap('Authorize')}</div>
            {renderList()}
        </div>
    )
}

export default observer(Auth);