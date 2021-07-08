/*
 * @Author: dianluyuanli-wp
 * @LastEditors: dianluyuanli-wp
 * @Date: 2021-05-29 10:36:59
 * @LastEditTime: 2021-07-07 23:42:24
 */
import { formatBalance, isHex } from '@polkadot/util';
import { SEED_LENGTHS, ADDRESS_FORMAT } from '@constants/chain';
import type { KeyringPair$Json } from '@polkadot/keyring/types';
import keyring from '@polkadot/ui-keyring';
import { keyExtractSuri, mnemonicValidate } from '@polkadot/util-crypto';
import { LOCAL_CONFIG } from '@constants/chrome';
import { getStorage, setStorage } from '@utils/chrome';
import { useTranslation } from 'react-i18next';
import type { CreateResult } from '@polkadot/ui-keyring/types';
import { runInAction } from 'mobx';
import globalStore from '@entry/store';
import type BN from 'bn.js';
import type { Time } from '@polkadot/util/types';
import BNObj from 'bn.js';
import { useMemo } from 'react';
import i18n from 'i18next';
import { NET_TYPE, POLKADOT_TOKEN_RATE, KUSAMA_TOKEN_RATE } from '@constants/chain';
import { decodeAddress, encodeAddress } from '@polkadot/util-crypto';
import { BN_ONE, extractTime } from '@polkadot/util';
import { LOCAL_LANGUAGE } from '@constants/app';

type Result = [number, string, Time];

const DEFAULT_TIME = new BNObj(6000);

export interface addressArrayObj {
    accountAddress: Array<string>
}

//  这玩意不知道怎么用，先手动拼一下吧
export function myFormatBalance(balance: number | string | BN | BigInt ) {
    return (parseFloat(formatBalance(balance, { withSi: false })) / 10).toFixed(5);
}

//  将地址处理成有好一点的形式xxx....xxx
export function addressFormat(address: string, padLength = 4) {
    address = encodeAddress(address, globalStore.isKusama ? ADDRESS_FORMAT.KUSAMA : ADDRESS_FORMAT.POLKADOT);
    return address.slice(0, padLength) + '....' + address.slice(address.length - padLength);
}

//  校验助记词输入
export function validateMnemonicOrHexSeed(inputValue: string) {
    let result = {
        success: true,
        errMsg: ''
    };
    let parsedAns;
    const isEnglish = i18n.language === 'en';
    try {
        parsedAns = keyExtractSuri(inputValue);
    } catch {
        result.success = false;
        result.errMsg = isEnglish ? 'Invalid mnemonic' : '无效的助记词';
        return result
    }
    const { phrase } = parsedAns;

    if (isHex(phrase)) {
        if (!isHex(phrase, 256)) {
            result.success = false;
            result.errMsg = 'Hex seed needs to be 256-bits'
        }
    } else {
        //  判断助记词个数
        if (!SEED_LENGTHS.includes((phrase as string).split(' ').length)) {
            result.success = false;
            result.errMsg = `Mnemonic needs to contain ${SEED_LENGTHS.join(', ')} words`
        } else if (!mnemonicValidate(phrase)) {
            //  助记词校验
            result.success = false;
            result.errMsg = 'Not a valid mnemonic seed'
        }
    }
    return result;
}

//  校验keyStore输入
export function validateKeyStoreJsonStr(content: string) {
    let result = {
        success: true,
        errMsg: ''
    };
    let json: KeyringPair$Json;
    try {
        json = JSON.parse(content) as KeyringPair$Json;
        keyring.createFromJson(json);
    } catch {
        result.success = false;
        result.errMsg = i18n.language === 'en' ? 'Invalid Keystore' : '无效的keystore';
    }
    return result;
}

//  添加新账号，同步store和chrome storage
export async function addNewAccount(result: CreateResult) {
    const { pair } = result;
    const targetAdd = encodeAddress(pair.publicKey, globalStore.isKusama ? ADDRESS_FORMAT.KUSAMA : ADDRESS_FORMAT.POLKADOT)
    runInAction(() => {
        globalStore.favoriteAccount = targetAdd || globalStore.favoriteAccount;
    })
}

//  更新账号信息，内存和chrome存储都更新
// export async function updateAccountInfo(result: CreateResult) {
//     const { json } = result;
//     const { address } = json
//     //  同步本地的store状态
//     runInAction(() => {
//         globalStore.accountObj = Object.assign({}, globalStore.accountObj, { [address]: json })
//     })
//     //  修改chromeStorage
//     await setStorage({
//         [address]: json
//     })
// }

//  将canvas转换成dataUrl
export function canvasToDataURL(canvas: any){
	return canvas.toDataURL('image/png', 1.0);
}

//  将dataUrl转换成blob
export function dataURLToBlob(dataurl: string){
	var arr = dataurl.split(',');
	var mime = arr[0].match(/:(.*?);/)[1];
	var bstr = atob(arr[1]);
	var n = bstr.length;
	var u8arr = new Uint8Array(n);
	while(n--){
		u8arr[n] = bstr.charCodeAt(n);
	}
	return new Blob([u8arr], {type:mime});
}

//  将字符串转化成转账金额
export function dotStrToTransferAmount(amount: string) {
    return parseFloat(amount) * (globalStore.isKusama ? KUSAMA_TOKEN_RATE : POLKADOT_TOKEN_RATE);
}

//  获取不同网络下基本单位到对应主单位的汇率，比如用在查转账费
//  将基本单位转化为DOT或者KSM
export function useTokenRate () {
    const rate = useMemo(() => {
        return globalStore.netType === NET_TYPE.KUSAMA ? KUSAMA_TOKEN_RATE : POLKADOT_TOKEN_RATE;
    }, [globalStore.netType]);
    return rate;
}

//  获取不同网络下基本单位的汇率，预估转账费,将查转账费接口的返回内容转化为单位是DOT或者KSM的转账费
export function useFeeRate () {
    const feeRate = useMemo(() => {
        return globalStore.netType === NET_TYPE.KUSAMA ? Math.pow(10, 6) : Math.pow(10, 3);
    }, [globalStore.netType]);
    return feeRate;
}

/**
 * @Author: dianluyuanli-wp
 * @LastEditors: dianluyuanli-wp
 * @param {string} add
 * 如果不是匹配的地址格式，抛出错误
 */
export function checkAddressFormat(add: string) {
    const firstChar = add[0];
    if (!globalStore.isKusama && firstChar !== '1') {
        throw(new Error('address is not in polkadot format'))
    } else if (!/[A-Z]/.test(firstChar)) {
        throw(new Error('address is in not KSM format'))
    }
}

export function useTokenName () {
    const name = useMemo(() => {
        return globalStore.netType === NET_TYPE.KUSAMA ? 'KSM' : 'DOT';
    }, [globalStore.netType]);
    return name;
}

export function useBlockTime (blocks = BN_ONE): Result {
  const { t } = useTranslation();

  return useMemo(
    (): Result => {
    //   const blockTime = (
    //     a.consts.babe?.expectedBlockTime ||
    //     a.consts.difficulty?.targetBlockTime ||
    //     a.consts.timestamp?.minimumPeriod.muln(2) ||
    //     DEFAULT_TIME
    //   );
      const blockTime = DEFAULT_TIME;
      const time = extractTime(blockTime.mul(blocks as any).toNumber());
      const { days, hours, minutes, seconds } = time;
      const timeStr = [
        days ? (days > 1) ? t<string>('{{days}} days', { replace: { days } }) : t<string>('1 day') : null,
        hours ? (hours > 1) ? t<string>('{{hours}} hrs', { replace: { hours } }) : t<string>('1 hr') : null,
        minutes ? (minutes > 1) ? t<string>('{{minutes}} mins', { replace: { minutes } }) : t<string>('1 min') : null,
        seconds ? (seconds > 1) ? t<string>('{{seconds}} s', { replace: { seconds } }) : t<string>('1 s') : null
      ]
        .filter((value): value is string => !!value)
        .slice(0, 2)
        .join(' ');

      return [
        blockTime.toNumber(),
        timeStr,
        time
      ];
    },
    [blocks, t]
  );
}

export function getBlockTime(blocks = BN_ONE) {
    const blockTime = DEFAULT_TIME;
    const time = extractTime(blockTime.mul(blocks as any).toNumber());
    const { days, hours, minutes, seconds } = time;
    const timeStr = [
      days ? (days > 1) ? `${days} days` : '1 day' : null, 
      hours ? (hours > 1) ? `${hours} hours` : '1 hr' : null,
      minutes ? (minutes > 1) ? `${minutes} minutes` : '1 min' : null,
      seconds ? (seconds > 1) ? `${seconds} seconds` : '1 s' : null
    ]
      .filter((value): value is string => !!value)
      .slice(0, 2)
      .join(' ');
    return timeStr
}

export function updateLanguage(lan: 'english' | 'chinese') {
    const targetLan = lan === 'english' ? 'en' : 'zh';
    window.localStorage.setItem(LOCAL_LANGUAGE, targetLan);
    i18n.changeLanguage(targetLan);
    runInAction(() => {
        globalStore.localConfig.language = lan;
    })
    setStorage({
        [LOCAL_CONFIG]: {
            ...globalStore.localConfig,
            language: lan
        }
    })
}

/**
 * @Author: dianluyuanli-wp
 * @LastEditors: dianluyuanli-wp
 * 
 * 主要是用来给各种非dapp唤起的弹窗来重新设置样式，为了保证样式一致
 */
export function retrieveWindow () {
    const target = document.getElementsByTagName('html')[0];
    target.style.cssText = 'width: 375px; height: 601px; font-size: 26.66667vw; overflow-x: hidden;'
    setTimeout(() => {
        target.style.cssText = 'width: 375px; height: 600px; font-size: 26.66667vw; overflow-x: hidden;'
    }, 10);
}

/**
 * @Author: dianluyuanli-wp
 * @LastEditors: dianluyuanli-wp
 * 
 * 为了给page唤起的宽弹窗处理
 */
export function setWindowForPop () {
    const target = document.getElementsByTagName('html')[0];
    target.style.cssText = 'width: 560px; height: 601px; font-size: 17.8581vw; overflow-x: hidden;'
    setTimeout(() => {
        target.style.cssText = 'width: 560px; height: 600px; font-size: 17.8581vw; overflow-x: hidden;'
    }, 10);
}

/**
 * @Author: dianluyuanli-wp
 * @LastEditors: dianluyuanli-wp
 * 给有Dapp唤起的弹窗使用
 */
export function setWindowForDapp () {
    const target = document.getElementsByTagName('html')[0];
    target.style.cssText = 'width: 560px; font-size: 17.8581vw; overflow-x: hidden;'
}

/**
 * @Author: dianluyuanli-wp
 * @LastEditors: dianluyuanli-wp
 * 
 * 提升用户体验，提前计算矿工费
 */
export async function computedFee() {
    await globalStore.initPromise;
    const estimateAdd = '14MXedfxTovBvJVRfLQFGpsLwKWjS7PpaM98kqyiVkrffwPL';
    const { api, isKusama, ableBalance } = globalStore;
    const feeRate = isKusama ? Math.pow(10, 6) : Math.pow(10, 3);
    //  实时计算交易费用
    try {
        const transfer = api.tx.balances.transfer(estimateAdd, dotStrToTransferAmount(ableBalance))
        const { partialFee } = await transfer.paymentInfo(estimateAdd);
        return parseFloat(partialFee.toHuman().split(' ')[0]) / feeRate + '';
    } catch(e) {
        console.log(e);
        return '';
    }
}

