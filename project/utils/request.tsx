import request from 'umi-request';

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