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
import { toJS } from 'mobx';
import type { SignerPayloadJSON } from '@polkadot/types/types';
import s from '../authPopup/index.scss';
import styles from './index.scss';
import { approveAuthRequest, rejectAuthRequest } from '@utils/message/message';
import { getReferDetail } from '../democracy/service';

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
    console.log(toJS(GlobalStore.signReqList), 'sign');
    const target = GlobalStore.signReqList[0];
    if (!target) {
        return null;
    }
    const { address, name } = target.account;

    function getReferDetail() {
        const target = GlobalStore.signReqList[0];

        const { genesisHash, version, nonce, method } = target.request.payload as SignerPayloadJSON;
        const contentArray = [{ title: 'from', value: target.url}, { title: 'genesis', value: genesisHash},
        { title: 'version', value: version}, { title: 'nonce', value: nonce }, { title: 'method data', value: method }];
        const table =  contentArray.map((item, index) => {
            const { title, value } = item;
            return <div className={styles.detail} key={index}>
                <div className={styles.left}>{title}</div>
                <div className={styles.right}>{value}</div>
            </div>
        })
        return <div className={styles.tableWrap}>

        </div>
    }
    return (
        <div className={styles.wrap}>
            <div className={s.title}>
                <div className={s.logo}/>
                Doter
            </div>
            <div className={s.dotLogo}/>
            <div className={s.auth}>签名信息</div>
            <div className={styles.addWrap}>
                <div>{name}</div>
                <div className={styles.addDetail}>{address}</div>
            </div>
            {getReferDetail()}
        </div>
    )
}

export default observer(Auth);