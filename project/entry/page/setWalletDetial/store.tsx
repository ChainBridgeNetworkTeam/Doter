/*
 * @Author: guanlanluditie 
 * @Date: 2021-02-26 09:42:57 
 * @Last Modified by: guanlanluditie
 * @Last Modified time: 2021-02-26 09:50:19
 */

import { observable, action, makeAutoObservable } from 'mobx';

export interface singleAccEditStoreType {
    secret: string;
    confirmSecret: string;
}

class SingleAccEditStore {
    constructor() {
        makeAutoObservable(this);
    }
    //  注册输入密码
    @observable secret: string = '';
    //  二次确认密码
    @observable confirmSecret: string = '';

    //  重置store,方便下次创建
    @action.bound
    resetStore() {
        this.secret = '';
        this.confirmSecret = '';
    }
}

export default new SingleAccEditStore();