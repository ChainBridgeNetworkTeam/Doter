/*
 * @Author: guanlanluditie 
 * @Date: 2021-02-15 22:25:13 
 * @Last Modified by: guanlanluditie
 * @Last Modified time: 2021-03-27 22:18:35
 */

import React, { FC } from 'react';
import s from './index.scss';
import HeadBar from '@widgets/headBar';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { runInAction } from 'mobx';
import { observer } from 'mobx-react';
import cx from 'classnames';
import { PAGE_NAME } from '@constants/app';
import { addressFormat } from '@utils/tools';
import { chromeLocalSet } from '@utils/chrome';
import { useStores } from '@utils/useStore';
import { FAVORITE_ACCOUNT } from '@constants/chrome';
import { NET_WORD } from '@constants/chain';
import type { KeyringPair$Json } from '@polkadot/keyring/types';
import { globalStoreType } from '../../store';

const WalletManage:FC = function() {
    let { t } = useTranslation();
    const globalStore = useStores('GlobalStore') as globalStoreType;
    const history = useHistory();
    //  国际化的包裹函数
    const lanWrap = (input: string) => t(`walletManage:${input}`);

    function jump(path: string) {
        history.push(path);
    }

    async function changeFavorite(address: string) {
        runInAction(() => {
            globalStore.favoriteAccount = address;
        })
        //  设置localStorage存储
        await chromeLocalSet({
            [FAVORITE_ACCOUNT]: address
        })
        //  回到首页
        history.push(PAGE_NAME.HOME);
    }

    function toSingleManage(e: React.MouseEvent<HTMLSpanElement, MouseEvent>, address: string) {
        //  避免冒泡
        e.stopPropagation();
        history.push(PAGE_NAME.SINGLE_WALLTE_MANAGE, { address })
    }

    function renderAccount() {
        const target = globalStore.accountObj;
        return Object.keys(target).map((item) => (target[item])).sort((a, b) => (a.meta.whenCreated) as number - (b.meta.whenCreated as number)).map((item, index) => {
            const { address, meta } = item as KeyringPair$Json;
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
                    <div className={cx(s.polkadotIcon, globalStore.isKusama ? s.kIcon : '')}></div>
                </div>
            </div>
            <div className={s.rigthContent}>
                <div className={s.title}>{globalStore.isKusama ? NET_WORD.KUSAMA : NET_WORD.POLKADOT} <div className={s.addIcon} onClick={() => jump(PAGE_NAME.RETRIEVE_WALLET)}/></div>
                {renderAccount()}
            </div>
        </div>
    )
}

export default observer(WalletManage);