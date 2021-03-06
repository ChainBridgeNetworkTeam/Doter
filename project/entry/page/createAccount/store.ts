/*
 * @Author: guanlanluditie 
 * @Date: 2021-02-03 11:30:55 
 * @Last Modified by: guanlanluditie
 * @Last Modified time: 2021-02-11 09:54:20
 */
import { action, makeAutoObservable } from 'mobx';
import { CREAT_STAGE } from './contants';
//  import { OFFICAL_END_POINT } from '@constants/url';

export interface CreateStoreType {
    accountName: string;
    inputSec: string;
    inputSecConfirm: string;
    createStage: number;
    resetStore: Function;
    userAgreementSlect: boolean;
}

class CreateAccountStore {
    constructor() {
        makeAutoObservable(this);
    }
    //  用户名
    accountName: string = '';
    //  注册输入密码
    inputSec: string = '';
    //  密码确认
    inputSecConfirm: string = '';
    //  注册阶段
    createStage: number = CREAT_STAGE.SECRECT;
    //  用户协议是否勾选
    userAgreementSlect = false;

    //  重置store,方便下次创建
    @action.bound
    resetStore() {
        this.createStage = 0;
        this.inputSec = '';
        this.inputSecConfirm = '';
        this.accountName = '';
    }
}

export default new CreateAccountStore();