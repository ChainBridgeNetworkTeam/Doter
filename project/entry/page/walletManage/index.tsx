/*
 * @Author: guanlanluditie 
 * @Date: 2021-02-15 22:25:13 
 * @Last Modified by: guanlanluditie
 * @Last Modified time: 2021-03-06 12:33:42
 */

import React, { FC, useEffect } from 'react';
import s from './index.css';
import HeadBar from '@widgets/headBar';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { runInAction } from 'mobx';
import { observer } from 'mobx-react';
import cx from 'classnames';
import { PAGE_NAME } from '@constants/app';
import { addressFormat } from '@utils/tools';
import { setStorage } from '@utils/chrome';
import { useStores } from '@utils/useStore';
import { FAVORITE_ACCOUNT } from '@constants/chrome';
import type { KeyringPair$Json } from '@polkadot/keyring/types';
import { globalStoreType } from '../../store';

const WalletManage:FC = function() {
    let { t } = useTranslation();
    const globalStore = useStores('GlobalStore') as globalStoreType;
    const history = useHistory();
    //  国际化的包裹函数
    const lanWrap = (input: string) => t(`walletManage:${input}`);

    useEffect(() => {
        console.log(globalStore.accountObj);
    },[])

    function jump(path: string) {
        history.push(path);
    }

    function changeFavorite(address: string) {
        runInAction(() => {
            globalStore.favoriteAccount = address;
        })
        //  设置localStorage存储
        setStorage({
            [FAVORITE_ACCOUNT]: address
        })
    }

    function toSingleManage(e: React.MouseEvent<HTMLSpanElement, MouseEvent>, address: string) {
        //  避免冒泡
        e.stopPropagation();
        history.push(PAGE_NAME.SINGLE_WALLTE_MANAGE, { address })
    }

    function renderAccount() {
        const target = globalStore.accountObj;
        return Object.keys(target).map((item, index) => {
            const { address, meta } = target[item] as KeyringPair$Json;
            return <div key={index} className={s.accountWrap} onClick={() => changeFavorite(address)}>
                <div className={s.firRow}>
                    <div className={s.ffRow}>
                        <div className={cx(s.point, address === globalStore.currentAccount.address ? s.activePoint : '')}/>
                        <div className={s.aName}>{meta.name}</div>
                    </div>
                    <div className={s.tail} onClick={(e) => toSingleManage(e, address)}>···</div>
                </div>
                <div className={s.secAdd}>{addressFormat(address)}</div>
            </div>
        })
    }

    return (
        <div className={s.wrap}>
            <HeadBar word={lanWrap('Wallet management')}/>
            <div className={s.leftBar}>
                <div className={s.tab}>
                    <div className={s.blueBlock}/>
                    <div className={s.polkadotIcon}></div>
                </div>
            </div>
            <div className={s.rigthContent}>
                <div className={s.title}>Polkadot <div className={s.addIcon} onClick={() => jump(PAGE_NAME.RETRIEVE_WALLET)}/></div>
                {renderAccount()}
            </div>
        </div>
    )
}

export default observer(WalletManage);