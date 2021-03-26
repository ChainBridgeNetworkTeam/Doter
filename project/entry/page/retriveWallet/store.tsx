/*
 * @Author: guanlanluditie 
 * @Date: 2021-02-17 17:24:57 
 * @Last Modified by: guanlanluditie
 * @Last Modified time: 2021-02-26 09:45:38
 */

import { observable, action, makeAutoObservable } from 'mobx';

export interface retrieveStoreType {
    name: string;
    secret: string;
    checkAgreement: boolean;
    mnemonicWords: string;
    mnemonicErrMsg: string;
    buttonActive: boolean;
    checkStatus: number;
    confirmSecret: string;
    keyStoreJsonStr: string;
    keyStoreErrMsg: string;
}

export const CHECT_STATUS = {
    PASS: 0,
    SECRECT_NOT_EQUAL: 1,
    NOT_CHECK_AGREEMETN: 2,
    SECRET_TOO_SHORT: 3,
    WRONG_PASS: 4
}

class RetrieveStore {
    constructor() {
        makeAutoObservable(this);
    }
    //  用户名
    @observable name: string = '';
    //  注册输入密码
    @observable secret: string = '';
    //  二次确认密码
    @observable confirmSecret: string = '';
    //  用户协议是否选中
    @observable checkAgreement: boolean = false;
    //  输入助记词
    @observable mnemonicWords: string = '';
    //  助记词错误
    @observable mnemonicErrMsg: string = '请输入助记词';
    //  keyStore json内容
    @observable keyStoreJsonStr: string = '';
    //  keyStore errMsg
    @observable keyStoreErrMsg: string = '';
    //  是否可以创建
    @observable buttonActive: boolean = false;
    //  检查状态
    @observable checkStatus: number = CHECT_STATUS.PASS;

    //  重置store,方便下次创建
    @action.bound
    resetStore() {
        this.name = '';
        this.secret = '';
        this.checkAgreement = false;
        this.confirmSecret = '';
        this.keyStoreJsonStr = '';
        this.keyStoreErrMsg = '';
        this.mnemonicErrMsg = '';
    }
}

export default new RetrieveStore();