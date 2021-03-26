/*
 * @Author: guanlanluditie 
 * @Date: 2021-02-12 19:59:05 
 * @Last Modified by: guanlanluditie
 * @Last Modified time: 2021-03-18 11:42:27
 */

 // 获取本地存储
function getLocalStorage(obj: Object) {
    let ans = {} as Record<string, any>;
    for(let key in obj) {
        ans[key] = JSON.parse(localStorage.getItem(key));
    }
    return ans;
}

//  设置本地存储
function setLocalStorage(obj: Record<string, any>) {
    for(let key in obj) {
        localStorage.setItem(key, JSON.stringify(obj[key]));
    }
}

//  移除本地存储
function removeLocalStorage(keys: string | Array<string>) {
    const keyArray = typeof keys === 'string' ? [keys] : keys;
    keyArray.forEach(item => {
        localStorage.removeItem(item);
    })
}
//  chrome本地存储相关
//  manifeast里面的all_url对于白板无效，还是需要搞localstorage缓存

//  走chrome本地存储有个问题，依赖content.js,不能在白板页启动，这里使用官方的Account方案，详见ui-keyring初始化部分
export function getStorage(obj: Record<string, any>) {
    return new Promise((res, rej) => {
        // sendMessageToContentScript({
        //     method: 'getStorage',
        //     payLoad: obj,
        // }, function(response: Object) {
        //     console.log(response, 'yyy')
        //     res(response);
        // })
        const keys = Object.keys(obj);
        const response = {} as Record<string, any>;
        keys.map(key => {
            const target = JSON.parse(window.localStorage.getItem(key) || JSON.stringify(''));
            if (target) {
                response[key] = target;
            } else {
                response[key] = obj[key];
            }
        })
        res(response);
    })
}

export function setStorage(obj: Record<string, any>) {
    return new Promise((res, rej) => {
        // sendMessageToContentScript({
        //     method: 'setStorage',
        //     payLoad: obj,
        // }, function(response: Object) {
        //     res(response);
        // })
        const keys = Object.keys(obj);
        const response = {} as Record<string, any>;
        keys.map(key => {
            window.localStorage.setItem(key, JSON.stringify(obj[key]));
        })
        res(response);
    })
}

export function removeStorage(keys: string | string[]) {
    return new Promise((res, rej) => {
        // sendMessageToContentScript({
        //     method: 'removeStorage',
        //     payLoad: keys,
        // }, function(response: Object) {
        //     res(response);
        // })
        const arr = typeof keys === 'string' ? [keys] : keys;
        arr.map(item => {
            window.localStorage.removeItem(item);
        })
    })
}

export function sendMessageToContentScript(message: Object, callback: Function)
{
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs)
	{
		chrome.tabs.sendMessage(tabs[0].id, message, function(response)
		{
			if(callback) callback(response);
		});
	});
}
