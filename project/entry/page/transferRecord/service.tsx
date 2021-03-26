/*
 * @Author: guanlanluditie 
 * @Date: 2021-03-14 19:03:45 
 * @Last Modified by: guanlanluditie
 * @Last Modified time: 2021-03-14 20:50:27
 */

import { postReq } from '@utils/request';
import { SUBSCAN_DOMAIN } from '@constants/chain';

//  拉取用户转账信息
export function getTransRecord(address: string, pageNum: number, pageSize: number) {
    return postReq(`${SUBSCAN_DOMAIN}/api/scan/transfers`, {
        address,
        page: pageNum,
        row: pageSize
    })
}

//  拉取单笔详情
export function getRecordDetail(hash: string) {
    return postReq(`${SUBSCAN_DOMAIN}/api/scan/extrinsic`, {
        hash,
    })
}

