/*
 * @Author: guanlanluditie 
 * @Date: 2021-01-28 00:13:41 
 * @Last Modified by: guanlanluditie
 * @Last Modified time: 2021-03-25 22:43:43
 */
import { observable, runInAction, action, makeAutoObservable, computed, toJS } from 'mobx';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { ADDRESS_ARRAY, FAVORITE_ACCOUNT, RECIPIENT_ARRAY, LOCAL_CONFIG } from '@constants/chrome';
import keyring from '@polkadot/ui-keyring';
import { getStorage, setStorage } from '@utils/chrome';
import { OFFICAL_END_POINT } from '@constants/chain';
import { AccountsStore } from '@polkadot/extension-base/stores';
import { accounts as accountsObservable } from '@polkadot/ui-keyring/observable/accounts';
import type { SubjectInfo, SingleAddress } from '@polkadot/ui-keyring/observable/types';
import type { KeyringPair$Json } from '@polkadot/keyring/types';
import type BN from 'bn.js';

export interface globalStoreType {
    hasInit: boolean,
    api: ApiPromise,
    addressArr: Array<string>,
    favoriteAccount: string,
    accountObj: Record<string, KeyringPair$Json>,
    balance: number | string | BN | BigInt,
    ableBalance: string;
    lockBalance: string;
    currentAccount: KeyringPair$Json,
    recipientArr: Array<recipientObj>
    localConfig: loaclConfigType,
    dotToDollar: string,
}

interface metaData {
    name: string,
    whenCreated: number
}
export interface account {
    address: string,
    meta: metaData
}

export interface recipientObj {
    address: string;
    comment: string;
}

export interface loaclConfigType {
    language?: 'english' | 'chinese',
    autoLockTime?: number,
    lastInSTM?: number
}

const mock = {
    '5EhmYogkqoyHiCDEfMWvQkEBcJjuaaZ4chW5K1z3TuioHTP7': {
        address: '5EhmYogkqoyHiCDEfMWvQkEBcJjuaaZ4chW5K1z3TuioHTP7',
        meta: {
            name: "wang",
            whenCreated: 1613125836858
        }
    }
}

const add = '5EhmYogkqoyHiCDEfMWvQkEBcJjuaaZ4chW5K1z3TuioHTP7';

class AppStore {
    @observable hasInit: boolean = false;
    @observable api: ApiPromise;
    //  地址列表
    @observable addressArr: Array<string> = [];
    //  当前地址
    @observable favoriteAccount: string = '';
    //  账号映射
    @observable accountObj: Record<string, Object> = {};
    //  当前账户余额
    @observable balance: number | string | BN | BigInt = 0;
    //  可用余额
    @observable ableBalance: string;
    //  锁定余额
    @observable lockBalance: string;
    //  转账账户列表
    @observable recipientArr: Array<recipientObj> = [];
    //  本地配置对象
    @observable localConfig: loaclConfigType = {} ;
    //  1Dot兑美元汇率
    dotToDollar: string = '0';

    constructor() {
        makeAutoObservable(this)
    }

    @computed
    get currentAccount() {
        return this.accountObj[this.favoriteAccount] || this.accountObj[this.addressArr[0]] || {}
    }

    @action.bound
    async prepareAccount(): Promise<void> {
        let ans = await getStorage({ 
            [ADDRESS_ARRAY]: [],
            [FAVORITE_ACCOUNT]: '',
            [RECIPIENT_ARRAY]: [],
            [LOCAL_CONFIG]: {
                language: 'english',
                autoLockTime: Infinity,
                lastInSTM: 0
            }}) as any || {};

        //  订阅账户的变化
        const subscription = accountsObservable.subject.subscribe((accounts: SubjectInfo): void =>
            {
                const addArrs = Object.keys(accounts);
                console.log(accounts, 'sub');
                const parsedAccObj = {} as Record<string, any>;
                addArrs.map(key => {
                    parsedAccObj[key] = accounts[key].json
                })
                runInAction(() => {
                    this.accountObj = parsedAccObj;
                    this.addressArr = addArrs;
                })
                setStorage({
                    [ADDRESS_ARRAY]: addArrs,
                })
            }
        );
         const firsetAcc = ans.accountAddress[0];
        runInAction(() => {
            this.favoriteAccount = ans.favoriteAccount || firsetAcc;
            this.localConfig = ans[LOCAL_CONFIG];
            this.recipientArr = ans[RECIPIENT_ARRAY];

            // this.favoriteAccount = add;
            // this.addressArr = [add];
            // this.accountObj = Object.assign.apply(null, [{}, mock]);
            // this.recipientArr = [{ address: add, comment: 'wef' }];
        });
    }

    //  初始化api
    @action.bound
    async init(): Promise<void> {
        //  keyring初始化
        keyring.loadAll({
            //  genesisHash: this.api.genesisHash as any,
            ss58Format: 0,
            //  store: new AccountsStore(),
            type: 'ed25519'
        }, [])
        const provider = new WsProvider(OFFICAL_END_POINT);
        let initSuccess = true;
        this.api = await (ApiPromise.create({
            provider
        }).catch(e => {
            console.log(e);
            initSuccess = false;
            return {} as ApiPromise;
        }));
        console.log('api init');
        runInAction(() => {
            this.hasInit = initSuccess;
        })
    }
}

export default new AppStore();
