/*
 * @Author: dianluyuanli-wp
 * @LastEditors: dianluyuanli-wp
 * @Date: 2021-05-29 20:44:42
 * @LastEditTime: 2021-05-30 14:35:57
 */

import React, { FC } from 'react';
import cx from 'classnames';
import { useTranslation } from 'react-i18next';
import { observer } from 'mobx-react';
import { globalStoreType } from '@entry/store';
import GlobalStore from '@entry/store';
import BottomBtn from '@widgets/bottomBtn';
import { useMetadata } from '@utils/hooks';
import { retrieveWindow } from '@utils/tools';
import s from './index.scss';
import { approveMetaRequest, rejectMetaRequest  } from '@utils/message/message';

const Auth:FC = function() {
    let { t } = useTranslation();
    const originChain = useMetadata(GlobalStore.metadataReqList[0]?.request?.genesisHash);
    const globalStore = GlobalStore as unknown as globalStoreType ;

    //  国际化的包裹函数
    const lanWrap = (input: string) => t(`metadata:${input}`);

    const _onApprove = (metaId: string) => {
        approveMetaRequest(metaId).catch((error: Error) => console.error(error)).finally(() => retrieveWindow());
    }
    const _onReject = (metaId: string) => {
        rejectMetaRequest(metaId).catch((error: Error) => console.error(error)).finally(() => retrieveWindow());
    }

    function Detail() {
        const target = globalStore.metadataReqList[0];
        if (!target) {
            return null;
        }
        const { id, request, url } = target;
        const { chain, icon, tokenDecimals, tokenSymbol, specVersion } = request;
        const detailList = [{
            title: lanWrap('from'),
            content: url
        }, {
            title: lanWrap('chain'),
            content: chain
        }, {
            title: lanWrap('icon'),
            content: icon
        }, {
            title: lanWrap('decimals'),
            content: tokenDecimals
        }, {
            title: lanWrap('symbol'),
            content: tokenSymbol
        }, {
            title: lanWrap('upgrade'),
            content: `${originChain ? originChain.specVersion : lanWrap('<unknown>')} -> ${specVersion}`
        }]
        return <div className={s.innerWrap}>
            {detailList.map((item, index) => {
                const { title, content } = item;
                return <div className={s.singleWrap} key={index}>
                    <div className={s.col}>{title}</div>
                    <div className={s.content}>{content}</div>
                </div>
            })}
            <div className={s.splitLine}/>
            <div className={s.infoWrap}>
                    <div className={cx(s.icon, s.icon1)}/>
                    <div className={s.infomation}>{lanWrap('information for concern')}</div>
                </div>
            <BottomBtn word={lanWrap('Yes，do this metadata update')} cb={() => _onApprove(id)} propClass={cx(s.btn, s.btn1)}/>
            <BottomBtn word={lanWrap('Reject')} cb={() => _onReject(id)} propClass={cx(s.btn, s.btnRej)}/>
        </div>
    }
    console.log(globalStore.metadataReqList[0]);
    return (
        <div className={s.wrap}>
            <div className={s.title}>
                <div className={s.logo}/>
                Doter
            </div>
            <div className={s.dotLogo}/>
            <div className={s.auth}>{lanWrap('metadata')}</div>
            <Detail />
        </div>
    )
}

export default observer(Auth);