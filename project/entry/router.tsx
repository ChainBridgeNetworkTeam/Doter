/*
 * @Author: dianluyuanli-wp 
 * @Date: 2021-01-29 11:39:22 
 * @Last Modified by: dianluyuanli-wp
 * @Last Modified time: 2021-04-02 08:42:32
 */

import React, { useCallback, useEffect, useState } from 'react';
import { MobXProviderContext, Provider, observer } from 'mobx-react';
import { toJS } from 'mobx';
import Home from './page/home';
import GlobalStore from './store';
import CreateAccount from './page/createAccount'; //    创建账号
import CreateAccountStore from './page/createAccount/store';
import UserAgreement from './page/userAgreement'; //    用户协议
import Recient from './page/receipt'; //    收款
import Transfer from './page/transfer'; //  转账
import SetPanel from './page/setPanel'; //  设置面板
import WalletManage from './page/walletManage'; //  钱包入口
import RetrieveWallet from './page/retriveWallet/entry'; // 恢复账号-入口
import rw_mnemonic from './page/retriveWallet/mnemonic'; // 助记词恢复账号
import rw_keystore from './page/retriveWallet/keyStore'; // 恢复钱包-keystore
import setWalletDetailEntry from './page/setWalletDetial/entry'; //  钱包设置-入口
import setWalletDetailEditName from './page/setWalletDetial/editName'; //  单个账号-修改名字
import setWalletDetailSecret from './page/setWalletDetial/changeSecret'; //    单个账号-改密码
import setWalletDetailBackup  from './page/setWalletDetial/backupKeyStore'; // 单个账号-备份keyStore文件
import setWalletDetailDeleteAccount from './page/setWalletDetial/deletaAccount'; //   单个账号-删除账号
import recipientAddressEntry from './page/recipientAddress/entry'; // 收款地址-入口
import recipientAddressAddNew from './page/recipientAddress/addNewOrEditAddress'; //  收款地址-新增地址
import generalSettingEntry from './page/generalSetting/entry'; //   通用配置 入口
import generalSettingLanguage from './page/generalSetting/language/index'; // 通用配置 语言
import generalSettingAutolock from './page/generalSetting/autoLock'; // 通用配置 自动锁定
import aboutUs from './page/aboutUs'; //     关于我们
import democracy from './page/democracy'; //    民主治理
import democracyVote from './page/democracy/voteForReferenda'; //   民主治理，投票
import democracyCheck from './page/democracy/voteCheck'; // 民主治理，投票确认
import transferRecord from './page/transferRecord'; //  转账记录
import transferRecordDetail from './page/transferRecord/recordDetail'; //   转账单笔详情
import Authorize from './page/authPopup'; //    账号注入授权弹窗
import SignPopup from './page/signPopup'; //    交易签名确认弹窗
import MetadataPopup from './page/metadataPopup'; //    metadata同步更新弹窗
import RetrieveStore from './page/retriveWallet/store';
import DemocracyStore from './page/democracy/store';
import { PAGE_NAME } from '@constants/app';
import { runInAction } from 'mobx';
import { retrieveWindow, setWindowForPop, setWindowForDapp, computedFee } from '@utils/tools';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import { subscribeAuthorizeRequests, subscribeSigningRequests, subscribeMetadataRequests } from '@utils/message/message';

function AppRouter() {
    const storeObj = {
        GlobalStore,
        CreateAccountStore,
        RetrieveStore,
        DemocracyStore
    }

    useEffect(() => {
        (async function() {
            Promise.all([
                //  订阅metadata同步请求，尽管没啥用
                subscribeMetadataRequests((list) => {
                    GlobalStore.setMetadataList(list);
                }),
                //  订阅认证请求
                subscribeAuthorizeRequests((list) => {
                    GlobalStore.setAuthList(list);
                }),
                //  订阅签名请求
                subscribeSigningRequests((list) => GlobalStore.setSignList(list as any))
            ],).catch(console.error);
            const fee = await computedFee();
            if (fee) {
                runInAction(() => {
                    GlobalStore.estimatedMinerFee = fee;
                })
            }
        })();
    },[]);

    const Root = useCallback(() => {
        //  分两种情况，直接由dapp唤起或者是通过点击右上角唤起，为了保证样式一致，需要一些特殊操作
        const { signReqList, authReqList, metadataReqList } = GlobalStore;
        //  右上角点击
        if (!document.getElementById('notification')) {
            if (signReqList.length || metadataReqList.length || authReqList.length) {
                setTimeout(() => {
                    setWindowForPop();
                }, 50)
                return signReqList.length ? <SignPopup /> : (authReqList.length ? <Authorize /> : <MetadataPopup />);
            } else {
                retrieveWindow();
                return <Home />
            }
        } else {
            setWindowForDapp();
            if (signReqList.length) {
                return <SignPopup />;
            } else if (metadataReqList.length) {
                return <MetadataPopup />
            } else {
                return <Authorize />
            }
        }
    }, [GlobalStore.authReqList, GlobalStore.signReqList, GlobalStore.metadataReqList])

    return <MobXProviderContext.Provider value={storeObj}>
        {/* 用这个元素来收集依赖 */}
        <div style={{ display: 'none'}}>{GlobalStore.authReqList.length}</div>
        <Router>
            <Switch>
                {/* 账户创建页 */}
                <Route exact path={PAGE_NAME.CREATE_ACCOUNT} component={CreateAccount}/>
                {/* 用户协议 */}
                <Route exact path={PAGE_NAME.USER_AGREEMENT} component={UserAgreement}/>
                {/* 收款页 */}
                <Route exact path={PAGE_NAME.RECIENT} component={Recient} />
                {/* 转账页 */}
                <Route exact path={PAGE_NAME.TRANSFER} component={Transfer} />
                {/* 设置 */}
                <Route exact path={PAGE_NAME.SET_PANEL} component={SetPanel} />
                {/* 钱包管理 */}
                <Route exact path={PAGE_NAME.WALLET_MANAGE} component={WalletManage} />
                {/* 恢复钱包 */}
                <Route path={PAGE_NAME.RETRIEVE_WALLET} render={() => {
                    return <>
                        <Route exact path={PAGE_NAME.RETRIEVE_WALLET} component={RetrieveWallet}/>
                        <Route exact path={PAGE_NAME.RW_MNEMONIC} component={rw_mnemonic}/>
                        <Route exact path={PAGE_NAME.RW_KEYSTORE} component={rw_keystore}/>
                    </>
                }} />
                {/* 单个钱包配置 */}
                <Route path={PAGE_NAME.SINGLE_WALLTE_MANAGE} render={() => {
                    return <>
                        <Route exact path={PAGE_NAME.SINGLE_WALLTE_MANAGE} component={setWalletDetailEntry}/>
                        <Route exact path={PAGE_NAME.SW_EDIT_NAME} component={setWalletDetailEditName}/>
                        <Route exact path={PAGE_NAME.SW_EDIT_SECRET} component={setWalletDetailSecret}/>
                        <Route exact path={PAGE_NAME.SW_EDIT_BACKUP} component={setWalletDetailBackup}/>
                        <Route exact path={PAGE_NAME.SW_EDIT_DELETE} component={setWalletDetailDeleteAccount}/>
                    </>
                }} />
                {/* 收款地址管理 */}
                <Route path={PAGE_NAME.RECIPIENT_ADDRESS} render={() => {
                    return <>
                        <Route exact path={PAGE_NAME.RECIPIENT_ADDRESS} component={recipientAddressEntry}/>
                        <Route exact path={PAGE_NAME.RECIPIENT_ADD_NEW_OR_EDIT} component={recipientAddressAddNew}/>
                    </>
                }} />
                {/* 通用配置 */}
                <Route path={PAGE_NAME.GENERAL_SETTING} render={() => {
                    return <>
                        <Route exact path={PAGE_NAME.GENERAL_SETTING} component={generalSettingEntry}/>
                        <Route exact path={PAGE_NAME.GENERAL_SETTING_LANGUAGE} component={generalSettingLanguage}/>
                        <Route exact path={PAGE_NAME.GENERAL_SETTING_AUTOLOCK} component={generalSettingAutolock}/>
                    </>
                }} />
                {/* 关于我们 */}
                <Route exact path={PAGE_NAME.ABOUT_US} component={aboutUs} />
                {/* 民主治理 */}
                <Route path={PAGE_NAME.DEMOCRACY} render={() => {
                    return <>
                        <Route exact path={PAGE_NAME.DEMOCRACY} component={democracy}/>
                        <Route exact path={PAGE_NAME.DEMOCRACY_VOTE} component={democracyVote}/>
                        <Route exact path={PAGE_NAME.DEMOCRACY_CHECK} component={democracyCheck}/>
                    </>
                }} />
                {/* 转账记录 */}
                <Route
                path={PAGE_NAME.TRANSFER_RECORD} render={() => {
                    return <>
                        <Route exact path={PAGE_NAME.TRANSFER_RECORD} component={transferRecord}/>
                        <Route exact path={PAGE_NAME.TRANSFER_RECORD_DETAIL} component={transferRecordDetail}/>
                    </>
                }} />
                {/* 首页 */}
                <Route path='' exact component={Root} />
            </Switch>
        </Router>
    </MobXProviderContext.Provider>
}

export default observer(AppRouter);
