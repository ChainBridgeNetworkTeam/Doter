/*
 * @Author: guanlanluditie 
 * @Date: 2021-03-12 23:35:58 
 * @Last Modified by: guanlanluditie
 * @Last Modified time: 2021-03-22 22:31:04
 */

import { postReq, getSubscanReqDomain } from '@utils/request';

//  拉取用户信息
export function getAddInfo(address: string) {
    return postReq(`${getSubscanReqDomain()}/api/v2/scan/search`, {
        key: address,
        page: 0,
        row: 1
    })
}

//  用于拉取获取
export function getDotInfo() {
    return postReq(`${getSubscanReqDomain()}/api/scan/token`, {})
}
