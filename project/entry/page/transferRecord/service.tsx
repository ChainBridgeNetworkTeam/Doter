/*
 * @Author: guanlanluditie 
 * @Date: 2021-03-14 19:03:45 
 * @Last Modified by: guanlanluditie
 * @Last Modified time: 2021-03-14 20:50:27
 */

import { postReq, getSubscanReqDomain } from '@utils/request';

//  拉取用户转账信息
export function getTransRecord(address: string, pageNum: number, pageSize: number) {
    return postReq(`${getSubscanReqDomain()}/api/scan/transfers`, {
        address,
        page: pageNum,
        row: pageSize
    })
}

//  拉取单笔详情
export function getRecordDetail(hash: string) {
    return postReq(`${getSubscanReqDomain()}/api/scan/extrinsic`, {
        hash,
    })
}

