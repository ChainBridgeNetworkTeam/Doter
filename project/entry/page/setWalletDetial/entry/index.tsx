/*
 * @Author: guanlanluditie 
 * @Date: 2021-02-25 09:53:26 
 * @Last Modified by: guanlanluditie
 * @Last Modified time: 2021-03-14 20:47:26
 */


import React, { FC } from 'react';
import s from './index.css';
import HeadBar from '@widgets/headBar';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import cx from 'classnames';
import { useStores } from '@utils/useStore';
import { PAGE_NAME } from '@constants/app';
import { globalStoreType } from '@entry/store';
//  import RetrieveStore from '../store';

interface HState {
    address?: string;
}

const Entry:FC = function() {
    let { t } = useTranslation();
    const globalStore = useStores('GlobalStore') as globalStoreType;
    const history = useHistory();

    //  国际化的包裹函数
    const lanWrap = (input: string) => t(`setWalletDetial:${input}`);

    const { address } = history.location.state as HState;
    const configAccount = globalStore.accountObj[address] as Record<string, any>;

    function jump(path: string) {
        //  重新进入的时候要重置数据
        // RetrieveStore.resetStore();
        history.push(path, { address });
    }

    return (
        <div className={s.wrap}>
            <HeadBar word={lanWrap('Wallet management')}/>
            <div className={cx(s.item, s.topItem)}>
                <div>{lanWrap('Wallet address')}</div>
                <div className={s.addressItem}>{address}</div>
            </div>
            <div className={s.item} onClick={() => jump(PAGE_NAME.SW_EDIT_NAME)}>
                <div>{lanWrap('Wallet name')}</div>
                <div className={s.aName}>
                    <div className={s.conName}>{configAccount.meta.name}</div>
                    <div className={s.arrow}/>
                </div>
            </div>
            <div className={s.item} onClick={() => jump(PAGE_NAME.SW_EDIT_SECRET)}>
                <div>{lanWrap('Wallet password')}</div>
                <div className={s.aName}>
                    <div className={s.arrow}/>
                </div>
            </div>
            <div className={s.bottonTitle}>{lanWrap('Wallet backup')}</div>
            <div className={s.item} onClick={() => jump(PAGE_NAME.SW_EDIT_BACKUP)}>
                <div>{lanWrap('Backup keystore')}</div>
                <div className={s.aName}>
                    <div className={s.arrow}/>
                </div>
            </div>
            <div className={s.btn} onClick={() => jump(PAGE_NAME.SW_EDIT_DELETE)}>{lanWrap('delete')}</div>
        </div>
    )
}

export default Entry;