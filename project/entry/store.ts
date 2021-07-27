/*
 * @Author: guanlanluditie 
 * @Date: 2021-01-28 00:13:41 
 * @Last Modified by: guanlanluditie
 * @Last Modified time: 2021-04-05 10:52:17
 */
import { runInAction, action, makeAutoObservable, computed, toJS } from 'mobx';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { ADDRESS_ARRAY, FAVORITE_ACCOUNT, RECIPIENT_ARRAY, LOCAL_CONFIG, MAINTAIN_NET } from '@constants/chrome';
import keyring from '@polkadot/ui-keyring';
import { getStorage, setStorage, chromeLocalGet, chromeLocalSet } from '@utils/chrome';
import { OFFICAL_END_POINT, KUSAMA_END_POINT, NET_TYPE, ADDRESS_FORMAT } from '@constants/chain';
import { AccountsStore } from '@polkadot/extension-base/stores';
import { accounts as accountsObservable } from '@polkadot/ui-keyring/observable/accounts';
import type { SubjectInfo } from '@polkadot/ui-keyring/observable/types';
import type { KeyringPair, KeyringPair$Json, KeyringPair$Meta } from '@polkadot/keyring/types';
import type { SignerPayloadJSON, SignerPayloadRaw } from '@polkadot/types/types';
import type { KeypairType } from '@polkadot/util-crypto/types';
import { encodeAddress } from '@polkadot/util-crypto';
import { TypeRegistry } from '@polkadot/types';
import { cryptoWaitReady } from '@polkadot/util-crypto';
import { getDotInfo } from '@entry/service';
import type BN from 'bn.js';
import { computedFee } from '@utils/tools';
import { Subscription } from 'rxjs';
import type { MetadataRequest } from '@polkadot/extension-base/background/types';

export interface RequestAuthorizeTab {
    origin: string;
}
export interface AuthorizeRequest {
    id: string;
    request: RequestAuthorizeTab;
    url: string;
}

export interface AccountJson extends KeyringPair$Meta {
    address: string;
    genesisHash?: string | null;
    isExternal?: boolean;
    isHardware?: boolean;
    isHidden?: boolean;
    name?: string;
    parentAddress?: string;
    suri?: string;
    type?: KeypairType;
    whenCreated?: number;
}

export interface RequestSign {
    readonly payload: SignerPayloadJSON | SignerPayloadRaw;
  
    sign (registry: TypeRegistry, pair: KeyringPair): { signature: string };
}

export interface SigningRequest {
    account: AccountJson;
    id: string;
    request: RequestSign;
    url: string;
}
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
    authReqList: Array<AuthorizeRequest>;
    signReqList: Array<SigningRequest>;
    netType: string;
    isKusama: boolean;
    estimatedMinerFee: string;

    changeNetType: (value: string) => void;
    metadataReqList: MetadataRequest[];
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

//  export let initResolve = () => {};
class AppStore {
    hasInit: boolean = false;
    api: ApiPromise;
    //  地址列表
    addressArr: Array<string> = [];
    //  当前地址
    favoriteAccount: string = '';
    //  账号映射
    accountObj: Record<string, KeyringPair$Json> = {} as Record<string, KeyringPair$Json>;
    //  当前账户余额
    balance: number | string | BN | BigInt = 0;
    //  可用余额
    ableBalance: string;
    //  锁定余额
    lockBalance: string;
    //  转账账户列表
    recipientArr: Array<recipientObj> = [];
    //  本地配置对象
    localConfig: loaclConfigType = {} ;
    //  1Dot兑美元汇率
    dotToDollar: string = '0';

    // 认证请求列表1
    authReqList: Array<AuthorizeRequest> = [];
    //  签名请求列表
    signReqList: Array<SigningRequest> = [];
    //  网络类型 polkadot或者kusama
    netType: string = '';
    //  估算旷工费
    estimatedMinerFee = ''
    initResolve = () => {};
    // 包一个promise，方便外界看是否完成初始化
    initPromise = new Promise((res: any, rej) => {
        this.initResolve = () => {
            res();
        };
    })

    //  账户订阅
    accountSubscribtion: Subscription = {} as Subscription;

    metadataReqList: MetadataRequest[] = [];

    //  设置认证请求列表
    setAuthList(valueList: Array<AuthorizeRequest>) {
        this.authReqList = valueList;
    }
    //  设置签名请求列表
    setSignList(valueList: Array<SigningRequest>) {
        this.signReqList = valueList;
    }
    //  设置metadata请求列表
    setMetadataList(valueList: Array<MetadataRequest>) {
        this.metadataReqList = valueList;
    }
    constructor() {
        makeAutoObservable(this)
    }

    @computed
    get currentAccount() {
        return this.accountObj[this.favoriteAccount] || this.accountObj[this.addressArr[0]] || {} as KeyringPair$Json
    }

    @computed
    get isKusama() {
        return this.netType === NET_TYPE.KUSAMA;
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

        const chormeLocalStorage = await chromeLocalGet({
            [RECIPIENT_ARRAY]: [],
            [FAVORITE_ACCOUNT]: ans[ADDRESS_ARRAY][0]
        }) as any || {};
        //  订阅账户的变化,核心内容通过库来存取
        const subscription = accountsObservable.subject.subscribe((accounts: SubjectInfo): void =>
            {
                const addArrs = Object.keys(accounts);
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
            this.accountSubscribtion = subscription;
            this.favoriteAccount = chormeLocalStorage[FAVORITE_ACCOUNT] || firsetAcc;
            this.localConfig = ans[LOCAL_CONFIG];
            //  常用的地址存在chrome本地存储,根据环境调整格式
            this.recipientArr = chormeLocalStorage[RECIPIENT_ARRAY].map((item: recipientObj) => {
                const { address, comment } = item;
                return {
                    address: encodeAddress(address, this.isKusama ? ADDRESS_FORMAT.KUSAMA : ADDRESS_FORMAT.POLKADOT),
                    comment: comment
                }
            });
        });
    }

    @action.bound
    async changeNetType(type: string) {
        runInAction(() =>{
            this.netType = type;
            this.estimatedMinerFee = '';
        })
        await chromeLocalSet({
            [MAINTAIN_NET]: type,
        })
        this.hasInit = false;
        await this.changApiNetWork();
        //  重新估计矿工费
        const fee = await computedFee();
        if (fee) {
            runInAction(() => {
                this.estimatedMinerFee = fee;
            })
        }
        //  首页刷新
        // location.reload();
    }

    @action.bound
    async changApiNetWork() {
        const netUrl = this.isKusama ? KUSAMA_END_POINT : OFFICAL_END_POINT;
        const provider = new WsProvider(netUrl);
        let initSuccess = true;
        const res = await getDotInfo();
        const tokenName = this.isKusama ? 'KSM' : 'DOT';
        runInAction(() => {
            this.dotToDollar = res?.data?.detail?.[tokenName]?.price || '0';
        })
        this.api = await (ApiPromise.create({
            provider
        }).catch(e => {
            console.log(e);
            initSuccess = false;
            return {} as ApiPromise;
        }));
        console.log('api init again');
        runInAction(() => {
            this.hasInit = initSuccess;
        })
    }

    //  初始化api
    @action.bound
    async init(): Promise<void> {
        const netType = await chromeLocalGet({
            [MAINTAIN_NET]: NET_TYPE.POLKADOT,
        }) as any || {};
        const isKusama = netType[MAINTAIN_NET] === NET_TYPE.KUSAMA;
        runInAction(() => {
            this.netType = netType[MAINTAIN_NET];
        })
        //  keyring初始化
        cryptoWaitReady().then(() => keyring.loadAll({
            //  genesisHash: this.api.genesisHash as any,
            store: new AccountsStore(),
            //  控制地址格式，0是polkadot格式，2是kusama格式
            ss58Format: isKusama ? ADDRESS_FORMAT.KUSAMA : ADDRESS_FORMAT.POLKADOT,
            //  类型要和bg的保持一致，否则会有bug,删除账号的时候有问题
            type: 'sr25519'
        }, []));
        const netUrl = isKusama ? KUSAMA_END_POINT : OFFICAL_END_POINT;
        const provider = new WsProvider(netUrl);
        let initSuccess = true;
        this.api = await (ApiPromise.create({
            provider
        }).catch(e => {
            console.log(e);
            initSuccess = false;
            return {} as ApiPromise;
        }));
        console.log('api init');
        this.initResolve();
        runInAction(() => {
            this.hasInit = initSuccess;
        })
    }
}

export default new AppStore();
