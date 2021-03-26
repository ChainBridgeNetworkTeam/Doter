/*
 * @Author: guanlanluditie 
 * @Date: 2021-01-22 22:36:26 
 * @Last Modified by: guanlanluditie
 * @Last Modified time: 2021-03-22 22:41:29
 */
import React, { FC, useEffect, useReducer, useMemo, useState } from 'react';
import { runInAction, toJS } from 'mobx';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PAGE_NAME } from '@constants/app';
import { useStores } from '@utils/useStore';
import { globalStoreType } from '../../store';
import { observer } from 'mobx-react';
import { myFormatBalance, addressFormat } from '@utils/tools';
import { Spin, message } from 'antd';
import copyContent from 'copy-to-clipboard';
import { getAddInfo, getDotInfo } from '@entry/service';
import { keyring } from '@polkadot/ui-keyring';
import s from './index.css';
import cx from 'classnames';

const HomePage:FC = function() {
    const history = useHistory();
    let { t ,i18n} = useTranslation();
    const globalStore = useStores('GlobalStore') as globalStoreType;
    const { currentAccount } = globalStore;

    //  是否初始化完成
    const hasInit = useMemo(() => globalStore.hasInit, [globalStore.hasInit]);
    function jump(path: string) {
        console.log(path, 'path');
        history.push(path);
    }
    function changeLanguage() {
        i18n.changeLanguage(i18n.language=='en'?'zh':'en')
    }

    //  拉取dot兑美元汇率
    useEffect(() => {
        async function getInfo() {
            if (globalStore.dotToDollar === '0') {
                const res = await getDotInfo();
                runInAction(() => {
                    globalStore.dotToDollar = res?.data?.detail?.DOT?.price || '0';
                })
            }
        }
        getInfo();
    }, [])

    function comLeft() {
        const [value, setValue] = useState({
            balance: '0',
            lockBalance: '0',
            preserveDot: '0'
        });
        useEffect(() => {
            async function com() {
                const { address } = globalStore.currentAccount;
                //  没有地址直接返回
                if (!address) {
                    return;
                }
                const endoceAdd = keyring.encodeAddress(address);
                const res = await getAddInfo(endoceAdd);
                const { balance = 0, lock = 0, reserved = 0 } = res?.data?.account || {};
                setValue({
                    balance,
                    lockBalance: lock,
                    preserveDot: reserved
                });
                runInAction(() => {
                    globalStore.balance = balance;
                    globalStore.lockBalance = lock;
                    globalStore.ableBalance = parseFloat(balance) - parseFloat(lock) - parseFloat(reserved) / Math.pow(10, 10)+ '';
                })
            }
            com();
        }, [globalStore.currentAccount, globalStore.dotToDollar])
        return value;
    }

    function statusIcon() {
        return !hasInit ? <div className={s.connetIcon}>{t('home:connecting')}</div> : null;
    }

    //  跳转subscan
    function seeBloclBrowser() {
        window.open('https://polkadot.subscan.io/')
    }

    function copyClick() {
        const { address } = currentAccount;
        copyContent(address);
        message.success(t('home:copy success'));
    }

    const balanceObj = comLeft();
    const { balance, lockBalance = '0', preserveDot = '0' } = balanceObj;

    function AccountPage() {
        const target = currentAccount;
        const { address, meta } = target;
        const useDolar = (parseFloat(balance) * parseFloat(globalStore.dotToDollar)).toFixed(4);
        return (
            <>
                <div className={s.head}>
                    <div className={s.leftTitle}>
                        <div className={s.titleIcon} />
                        <div>Doter {statusIcon()}</div>
                    </div>
                    <div className={s.toolIcon} onClick={() => jump(PAGE_NAME.SET_PANEL)}/>
                </div>
                <div className={s.account}>
                    <div className={s.aName}>{meta.name}</div>
                    <div>
                        <div className={s.address}>{addressFormat(address)}</div>
                        <div className={s.copyIcon} onClick={() => copyClick()}/>
                    </div>
                </div>
                <div className={s.pIcon}/>
                <Spin spinning={balance === ''}>
                    <div className={s.balance}>{balance} DOT</div>
                    <div className={s.usd}>${useDolar} USD</div>
                    <div className={s.balanceDetial}>
                        <div className={s.aWrap}>
                            <div>{lockBalance} DOT</div>
                            <div>{t('home:locked')}</div>
                        </div>
                        <div className={s.split}/>
                        <div className={s.aWrap}>
                            <div>{parseFloat(balance) - parseFloat(lockBalance) - parseFloat(preserveDot) / Math.pow(10, 10)} DOT</div>
                            <div>{t('home:Available balance')}</div>
                        </div>
                    </div>
                </Spin>
                <div className={s.tWrap}>
                    <div onClick={() => jump(PAGE_NAME.RECIENT)}>
                        <div className={s.grayBtn}>{t('home:receiving')}</div>
                    </div>
                    <div onClick={() => jump(PAGE_NAME.TRANSFER)}>
                        <div className={s.grayBtn}>{t('home:transfer')}</div>
                    </div>
                </div>
                <div className={s.bottomRouter}>
                    <div className={s.iconWrap} onClick={() => jump(PAGE_NAME.DEMOCRACY)}>
                        <div className={cx(s.img, s.democracy)}/>
                        <div className={s.bTitle}>{t('home:Network Governance')}</div>
                    </div>
                    <div className={s.iconWrap} onClick={() => jump(PAGE_NAME.TRANSFER_RECORD)}>
                        <div className={cx(s.img, s.record)}/>
                        <div className={s.bTitle}>{t('home:Transaction records')}</div>
                    </div>
                    <div className={s.iconWrap}>
                        <div className={cx(s.img, s.browser)} onClick={seeBloclBrowser}/>
                        <div className={s.bTitle}>{t('home:Polkadot Explorer')}</div>
                    </div>
                </div>
            </>
        )
    }
    function homeWithoutAccount() {
        return <>
            <div className={s.wrap}>
                <div className={s.loggo} onClick={changeLanguage}/>
            </div>
            <div className={s.word}>{t('home:doter is a polkadot wallet')}</div>
            <div className={s.word}>{t('home:welcome to use')}</div>
            <div className={cx(s.btn, s.create)} onClick={() => jump(PAGE_NAME.CREATE_ACCOUNT)}>{t('home:create wallet')}</div>
            <div className={cx(s.btn, s.importIcon)} onClick={() => jump(PAGE_NAME.RETRIEVE_WALLET)}>{t('home:import wallet')}</div>
        </>
    }
    const hasAccount = currentAccount.address;
    return (
        <div>
            {hasAccount ? AccountPage() : homeWithoutAccount()}
        </div>
    )
}

export default observer(HomePage);