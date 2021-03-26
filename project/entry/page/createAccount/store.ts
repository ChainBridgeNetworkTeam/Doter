/*
 * @Author: guanlanluditie 
 * @Date: 2021-02-03 11:30:55 
 * @Last Modified by: guanlanluditie
 * @Last Modified time: 2021-02-11 09:54:20
 */
import { observable, runInAction, action, makeAutoObservable } from 'mobx';
import { ApiPromise, WsProvider } from '@polkadot/api'
import keyring from '@polkadot/ui-keyring';
//  import { OFFICAL_END_POINT } from '@constants/url';

export interface CreateStoreType {
    accountName: string;
    inputSec: string;
    inputSecConfirm: string;
    createStage: number;
    resetStore: Function
}

class CreateAccountStore {
    constructor() {
        makeAutoObservable(this);
    }
    //  用户名
    @observable accountName: string = '';
    //  注册输入密码
    @observable inputSec: string = '';
    //  密码确认
    @observable inputSecConfirm: string = '';
    //  注册阶段
    @observable createStage: number = 0;

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