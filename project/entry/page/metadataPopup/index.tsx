/*
 * @Author: dianluyuanli-wp
 * @LastEditors: dianluyuanli-wp
 * @Date: 2021-05-29 20:44:42
 * @LastEditTime: 2021-05-29 21:28:12
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
import { approveMetaRequest, rejectMetaRequest  } from '@utils/message/message';

const Auth:FC = function() {
    let { t } = useTranslation();
    const globalStore = GlobalStore as unknown as globalStoreType ;
    const history = useHistory();

    //  国际化的包裹函数
    const lanWrap = (input: string) => t(`authPopup:${input}`);

    const target = globalStore.authReqList.slice(-1)?.[0];
    const _onApprove = (metaId: string) => {
        approveMetaRequest(metaId).catch((error: Error) => console.error(error));
    }
    const _onReject = (metaId: string) => {
        rejectMetaRequest(metaId).catch((error: Error) => console.error(error));
    }

    function renderList() {
        return globalStore.metadataReqList.map((item, index) => {
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
    console.log(globalStore.metadataReqList[0]);
    return (
        <div className={s.wrap}>
            <div className={s.title}>
                <div className={s.logo}/>
                Doter
            </div>
            <div className={s.dotLogo}/>
            <div className={s.auth}>{lanWrap('Authorize')}</div>
            {/* {renderList()} */}
        </div>
    )
}

export default observer(Auth);