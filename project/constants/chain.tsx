/*
 * @Author: dianluyuanli-wp
 * @LastEditors: dianluyuanli-wp
 * @Date: 2021-04-06 23:45:39
 * @LastEditTime: 2021-05-16 15:00:27
 */
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
}]

export function useWeightArr() {
    const { t } = useTranslation();
    const lanWrap = (input: string) => t(`democracy:${input}`);
    return WEIGHT_ARR.map((item) => {
        const { ratio, text } = item;
        return {
            ratio,
            text: lanWrap(text)
        }
    })
}