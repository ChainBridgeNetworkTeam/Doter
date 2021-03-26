/*
 * @Author: guanlanluditie 
 * @Date: 2021-02-28 09:30:32 
 * @Last Modified by: guanlanluditie
 * @Last Modified time: 2021-03-06 11:07:24
 */

import React, { FC } from 'react';
import s from './index.css';
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
        return recipientArr.map((item, index) => {
            const { address, comment } = item;
            return <div key={index} className={s.itemWrap} onClick={() => jump(PAGE_NAME.RECIPIENT_ADD_NEW_OR_EDIT, { target: 'edit', address })}>
                <div className={s.icon} />
                <div className={s.content}>
                    <div className={s.comment}>{comment}</div>
                    <div className={s.address}>{addressFormat(address)}</div>
                </div>
            </div>
        })
    }

    return (
        <div className={s.wrap}>
            <HeadBar word={lanWrap('Transfer address')} showRightIcon rightIconCB={() => jump(PAGE_NAME.RECIPIENT_ADD_NEW_OR_EDIT, { target: 'add' })}/>
            {itemsRender()}
        </div>
    )
}

export default Entry;