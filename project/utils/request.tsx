/*
 * @Author: dianluyuanli-wp
 * @LastEditors: dianluyuanli-wp
 * @Date: 2021-04-06 23:45:39
 * @LastEditTime: 2021-05-15 20:59:38
 */
import request from 'umi-request';
import GlobalStore from '@entry/store';
import { NET_TYPE, SUBSCAN_DOMAIN, KUSAMA_DOMAIN } from '@constants/chain';

//  包装的toast请求
export function postReq(api:string, data: Record<string, any> = {}, option?: Record<string, any>) {
    return request.post(api, {
        data,
        ...option
    })
}

//  包装的get请求
export function getReq(api:string, data: Record<string, any> = {}, option?: Record<string, any>) {
    return request.get(api, {
        data,
        ...option
    })
}

//  根据环境判断subscan请求的域名
export function getSubscanReqDomain() {
    const isPolkadot = GlobalStore.netType === NET_TYPE.POLKADOT;
    return isPolkadot ? SUBSCAN_DOMAIN : KUSAMA_DOMAIN;
}