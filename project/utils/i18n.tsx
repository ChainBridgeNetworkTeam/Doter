/*
 * @Author: guanlanluditie 
 * @Date: 2021-01-28 00:12:30 
 * @Last Modified by: guanlanluditie
 * @Last Modified time: 2021-03-20 21:26:36
 */
//  import LanguageDetector from 'i18next-browser-languagedetector';
import i18n from "i18next";
import { homeCn, homeEn } from '@entry/page/home/language'; //  主页语言文件
import { aboutEn, aboutZh } from '@entry/page/aboutUs/language'; // 关于
import { createEn, createZh } from '@entry/page/createAccount/language'; // 创建钱包
import { generalSettingEn, generalSettingZh } from '@entry/page/generalSetting/language'; // 通用设置
import { receiptEn, receiptZh } from '@entry/page/receipt/language'; // 收款
import { receiptAddressEn, receiptAddressZh } from '@entry/page/recipientAddress/language'; //  收款地址管理页
import { retriveWalletEn, retriveWalletZh } from '@entry/page/retriveWallet/language'; // 恢复钱包
import { setPanelEn, setPanelZh } from '@entry/page/setPanel/language'; //  设置主面板
import { setWalletDetialEn, setWalletDetialZh } from '@entry/page/setWalletDetial/language'; //  单个钱包细节设置
import { transferEn, transferZh } from '@entry/page/transfer/language'; // 转账
import { userAgreementEn, userAgreementZh } from '@entry/page/userAgreement/language'; //  用户协议
import { walletManageEn, walletManageZh } from '@entry/page/walletManage/language'; // 总的钱包管理入口页
import { widgetsEn, widgetsZh } from '@widgets/language'; // 各个小组件
import { democracyZh, democracyEn } from '@entry/page/democracy/language'; //  链上治理
import { transRecordEn, transRecordZh } from '@entry/page/transferRecord/language'; // 转账记录
import { LOCAL_LANGUAGE } from '@constants/app';
import {
  initReactI18next
} from 'react-i18next';

const language = window.localStorage.getItem(LOCAL_LANGUAGE) || 'en';

//  i18n.use(LanguageDetector) //嗅探当前浏览器语言
i18n.use(initReactI18next) //init i18next
.init({
  //引入资源文件
  resources: {
    en: {
      home: homeEn,
      aboutUs: aboutEn,
      createAccount: createEn,
      generalSetting: generalSettingEn,
      receipt: receiptEn,
      recipientAddress: receiptAddressEn,
      retriveWallet: retriveWalletEn,
      setPanel: setPanelEn,
      setWalletDetial: setWalletDetialEn,
      transfer: transferEn,
      userAgreement: userAgreementEn,
      walletManage: walletManageEn,
      widgets: widgetsEn,
      democracy: democracyEn,
      transRecord: transRecordEn,
    },
    zh: {
      home: homeCn,
      aboutUs: aboutZh,
      createAccount: createZh,
      generalSetting: generalSettingZh,
      receipt: receiptZh,
      recipientAddress: receiptAddressZh,
      retriveWallet: retriveWalletZh,
      setPanel: setPanelZh,
      setWalletDetial: setWalletDetialZh,
      transfer: transferZh,
      userAgreement: userAgreementZh,
      walletManage: walletManageZh,
      widgets: widgetsZh,
      democracy: democracyZh,
      transRecord: transRecordZh,
    },
  },
  //选择默认语言，选择内容为上述配置中的key，即en/zh
  fallbackLng: language,
  debug: false,
  interpolation: {
    escapeValue: false, // not needed for react as it escapes by default
  },
})

export default i18n;