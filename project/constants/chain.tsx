/*
 * @Author: dianluyuanli-wp
 * @LastEditors: dianluyuanli-wp
 * @Date: 2021-04-06 23:45:39
 * @LastEditTime: 2021-05-20 22:55:05
 */
import GlobalStore from '@entry/store';
import { useTranslation } from 'react-i18next';
export const OFFICAL_END_POINT = 'wss://rpc.polkadot.io';

//  kusama下主网初始化地址
export const KUSAMA_END_POINT = 'wss://kusama-rpc.polkadot.io';

export const SEED_LENGTHS = [12, 15, 18, 21, 24];

//  subscan的域名
export const SUBSCAN_DOMAIN = 'https://polkadot.subscan.io';

//  kusama下subsacan的域名
export const KUSAMA_DOMAIN = 'https://kusama.subscan.io';

export const NET_TYPE = {
    POLKADOT: 'polkadot',
    KUSAMA: 'kusama',
}

export const NET_WORD = {
    POLKADOT: 'Polkadot',
    KUSAMA: 'Kusama',
}

export const ADDRESS_FORMAT = {
    POLKADOT: 0,
    KUSAMA: 2,
}

//  投票锁定与倍率
export const WEIGHT_ARR = [{
    text: 'notLock',
    ratio: 0.1
}, {
    text: '×1(Lock in for 28 days)',
    ratio: 1
}, {
    text: '×2(Lock in for 56 days)',
    ratio: 2
}, {
    text: '×3(Lock in for 112 days)',
    ratio: 3
}, {
    text: '×4(Lock in for 224 days)',
    ratio: 4
}, {
    text: '×5(Lock in for 448 days)',
    ratio: 5
}, {
    text: '×6(Lock in for 896 days)',
    ratio: 6
}];

export const WEIGHT_ARR_IN_KUSAMA = [{
    text: 'notLock',
    ratio: 0.1
}, {
    text: '×1(Lock in for 8 days)',
    ratio: 1
}, {
    text: '×2(Lock in for 16 days)',
    ratio: 2
}, {
    text: '×3(Lock in for 32 days)',
    ratio: 3
}, {
    text: '×4(Lock in for 64 days)',
    ratio: 4
}, {
    text: '×5(Lock in for 128 days)',
    ratio: 5
}, {
    text: '×6(Lock in for 256 days)',
    ratio: 6
}];

export function useWeightArr() {
    const { t } = useTranslation();
    const lanWrap = (input: string) => t(`democracy:${input}`);
    const targetArr = GlobalStore.isKusama ? WEIGHT_ARR_IN_KUSAMA : WEIGHT_ARR;
    return targetArr.map((item) => {
        const { ratio, text } = item;
        return {
            ratio,
            text: lanWrap(text)
        }
    })
}