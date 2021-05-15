/*
 * @Author: dianluyuanli-wp
 * @LastEditors: dianluyuanli-wp
 * @Date: 2021-04-06 23:45:39
 * @LastEditTime: 2021-05-15 21:00:44
 */
import { postReq, getSubscanReqDomain } from '@utils/request';

//  拉取最近的公投
export function getReferendas() {
    return postReq(`${getSubscanReqDomain()}/api/scan/democracy/referendums`, {
        page: 0,
        row: 25
    })
}

//  获取某个公投详情
export function getReferDetail(referendum_index: number) {
    return postReq(`${getSubscanReqDomain()}/api/scan/democracy/referendum`, {
        referendum_index
    })
}

