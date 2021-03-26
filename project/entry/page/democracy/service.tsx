import { postReq } from '@utils/request';
import { SUBSCAN_DOMAIN } from '@constants/chain';

//  拉取最近的公投
export function getReferendas() {
    return postReq(`${SUBSCAN_DOMAIN}/api/scan/democracy/referendums`, {
        page: 0,
        row: 25
    })
}

//  获取某个公投详情
export function getReferDetail(referendum_index: number) {
    return postReq(`${SUBSCAN_DOMAIN}/api/scan/democracy/referendum`, {
        referendum_index
    })
}

