/*
 * @Author: guanlanluditie 
 * @Date: 2021-01-22 22:36:26 
 * @Last Modified by: guanlanluditie
 * @Last Modified time: 2021-04-03 17:23:47
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
import s from './index.scss';
import cx from 'classnames';
import { useTokenName } from '@utils/tools';
import { NET_TYPE } from '@constants/chain';

interface homeStatue {
    showLanPanel?: boolean;
}

const HomePage:FC = function() {
    const history = useHistory();
    let { t ,i18n} = useTranslation();
    const globalStore = useStores('GlobalStore') as globalStoreType;
    const { currentAccount } = globalStore;
    const tokenName = useTokenName();

    //  是否初始化完成
    const hasInit = useMemo(() => globalStore.hasInit, [globalStore.hasInit]);
    function jump(path: string) {
        console.log(path, 'path');
        history.push(path);
    }

    //  状态管理
    function stateReducer(state: Object, action: homeStatue) {
        return Object.assign({}, state, action);
    }
    const [stateObj, setState] = useReducer(stateReducer, {  showLanPanel:false } as homeStatue);
    const { showLanPanel } = stateObj;
    //  拉取dot兑美元汇率
    useEffect(() => {
        async function getInfo() {
            if (globalStore.dotToDollar === '0') {
                const res = await getDotInfo();
                runInAction(() => {
                    globalStore.dotToDollar = res?.data?.detail?.[tokenName]?.price || '0';
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
                const endoceAdd = keyring.encodeAddress('H7ZHDh569b1HLpRKuVQmBwYXttsH6C7fGPWFmDidkCpqpoe' || address);
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
    useEffect(() => {
        //  设置消息提醒高度，全局的
        message.config({
            top: 270,
            duration: 1,
        })
    }, [])

    function copyClick() {
        const { address } = currentAccount;
        copyContent(address);
        message.success({
            content: t('home:copy success'),
        });
    }

    const balanceObj = comLeft();
    const { balance, lockBalance = '0', preserveDot = '0' } = balanceObj;

    function toSingleManage(e: React.MouseEvent<HTMLSpanElement, MouseEvent>, address: string) {
        //  避免冒泡
        e.stopPropagation();
        history.push(PAGE_NAME.SINGLE_WALLTE_MANAGE, { address })
    }

    function changeNet() {
        const type = globalStore.netType;
        const targetType = type === NET_TYPE.POLKADOT ? NET_TYPE.KUSAMA : NET_TYPE.POLKADOT;
        globalStore.changeNetType(targetType);
    }

    function AccountPage() {
        const target = currentAccount;
        const { address, meta } = target;
        const useDolar = (parseFloat(balance) * parseFloat(globalStore.dotToDollar)).toFixed(2);
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
                    <div className={s.aName}>
                        <div>{meta.name}</div>
                        <div className={s.tail} onClick={(e) => toSingleManage(e, address)}>···</div>
                    </div>
                    <div>
                        <div className={s.address}>{addressFormat(address)}</div>
                        <div className={s.copyIcon} onClick={() => copyClick()}/>
                    </div>
                </div>
                <div onClick={changeNet}>111</div>
                <div className={cx(s.pIcon, globalStore.netType === NET_TYPE.KUSAMA ? s.kusama : '')}/>
                <Spin spinning={balance === ''}>
                    <div className={s.balance}>{parseFloat(balance).toFixed(4)} {tokenName}</div>
                    <div className={s.usd}>${parseFloat(useDolar).toFixed(4)} USD</div>
                    <div className={s.balanceDetial}>
                        <div className={s.aWrap}>
                            <div>{parseFloat(lockBalance).toFixed(4)} {tokenName}</div>
                            <div className={s.balanceDes}>{t('home:locked')}</div>
                        </div>
                        <div className={s.split}/>
                        <div className={s.aWrap}>
                            <div>{parseFloat(parseFloat(balance) - parseFloat(lockBalance) - parseFloat(preserveDot) / Math.pow(10, 10) + '').toFixed(4)} {tokenName}</div>
                            <div className={s.balanceDes}>{t('home:Available balance')}</div>
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

    function openLanPanel(e: React.MouseEvent<HTMLSpanElement, MouseEvent>) {
        e.stopPropagation();
        setState({
            showLanPanel: !showLanPanel
        })
    }

    function outerChangeLan() {
        setState({
            showLanPanel: false
        })
    }

    function changeLanguage(value: 'en' | 'zh') {
        i18n.changeLanguage(value)
    }

    function homeWithoutAccount() {
        return <div onClick={outerChangeLan}>
            <div className={s.changeLan}>
                <div className={s.lTitle} onClick={openLanPanel}>{i18n.language === 'en' ? 'English' : '中文'}</div>
                {showLanPanel && <>
                    <div className={s.lselect} onClick={() => changeLanguage('zh')}>中文</div>
                    <div className={s.lselect} onClick={() => changeLanguage('en')}>English</div>
                </>}
            </div>
            <div className={s.wrap}>
                <div className={s.loggo} />
            </div>
            <div className={s.word}>{t('home:doter is a polkadot wallet')}</div>
            <div className={s.word}>{t('home:welcome to use')}</div>
            <div className={cx(s.btn, s.create)} onClick={() => jump(PAGE_NAME.CREATE_ACCOUNT)}>{t('home:create wallet')}</div>
            <div className={cx(s.btn, s.importIcon)} onClick={() => jump(PAGE_NAME.RETRIEVE_WALLET)}>{t('home:import wallet')}</div>
        </div>
    }
    const hasAccount = currentAccount.address;
    return (
        <div>
            {hasAccount ? AccountPage() : homeWithoutAccount()}
        </div>
    )
}

export default observer(HomePage);