/*
 * @Author: wp
 * @Date: 2021-04-06 23:45:39
 * @LastEditTime: 2021-04-18 16:26:09
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /Doter/project/entry/page/recipientAddress/entry/index.tsx
 */

import React, { FC } from 'react';
import s from './index.scss';
import HeadBar from '@widgets/headBar';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { useStores } from '@utils/useStore';
import { PAGE_NAME } from '@constants/app';
import { globalStoreType } from '@entry/store';
import { addressFormat } from '@utils/tools';

const Entry:FC = function() {
    let { t } = useTranslation();
    const globalStore = useStores('GlobalStore') as globalStoreType;
    const history = useHistory();

    function jump(path: string, state?: Record<string, any>) {
        history.push(path, state);
    }

    //  国际化的包裹函数
    const lanWrap = (input: string) => t(`recipientAddress:${input}`);

    function itemsRender() {
        const { recipientArr } = globalStore;
        
        return recipientArr.length ? recipientArr.map((item, index) => {
            const { address, comment } = item;
            return <div key={index} className={s.itemWrap} onClick={() => jump(PAGE_NAME.RECIPIENT_ADD_NEW_OR_EDIT, { target: 'edit', address })}>
                <div className={s.icon} />
                <div className={s.content}>
                    <div className={s.comment}>{comment}</div>
                    <div className={s.address}>{addressFormat(address)}</div>
                </div>
            </div>
        })
        : <div className={s.noData}>{lanWrap('No Data')}</div>
    }

    return (
        <div className={s.wrap}>
            <HeadBar word={lanWrap('Transfer address')} showRightIcon rightIconCB={() => jump(PAGE_NAME.RECIPIENT_ADD_NEW_OR_EDIT, { target: 'add' })}/>
            {itemsRender()}
        </div>
    )
}

export default Entry;