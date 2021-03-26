import { formatBalance, isHex } from '@polkadot/util';
import { SEED_LENGTHS } from '@constants/chain';
import type { KeyringPair$Json } from '@polkadot/keyring/types';
import keyring from '@polkadot/ui-keyring';
import { keyExtractSuri, mnemonicValidate } from '@polkadot/util-crypto';
import { ADDRESS_ARRAY } from '@constants/chrome';
import { getStorage, setStorage } from '@utils/chrome';
import { globalStoreType } from '@entry/store';
import { useTranslation } from 'react-i18next';
import type { CreateResult } from '@polkadot/ui-keyring/types';
import { runInAction } from 'mobx';
import globalStore from '@entry/store';
import type BN from 'bn.js';
import type { Time } from '@polkadot/util/types';
import BNObj from 'bn.js';
import { useMemo } from 'react';
import { BN_ONE, extractTime } from '@polkadot/util';

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
    return address.slice(0, padLength) + '....' + address.slice(address.length - padLength);
}

//  校验助记词输入
export function validateMnemonicOrHexSeed(inputValue: string) {
    let result = {
        success: true,
        errMsg: ''
    };
    let parsedAns;
    try {
        parsedAns = keyExtractSuri(inputValue);
    } catch {
        result.success = false;
        result.errMsg = '错误的输入'
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
        result.errMsg = '错误的输入';
        return;
    }
    return result;
}

//  添加新账号，同步store和chrome storage
export async function addNewAccount(result: CreateResult) {
    const { json } = result;
    const { address } = json
    const saveKey = json.address;
    let origin = await getStorage({ [ADDRESS_ARRAY]: [] }) as addressArrayObj;
    let newArray = origin[ADDRESS_ARRAY];
    //  本地存储的账号信息,看来不需要脱敏，因为polkadot.js直接放在localstorage里面
    const localSaveObj = json;
    newArray.push(saveKey);
    //  同步本地的store状态
    runInAction(() => {
        //  globalStore.addressArr = newArray,
        globalStore.favoriteAccount = globalStore.favoriteAccount || address;
        //  globalStore.accountObj = Object.assign({}, globalStore.accountObj, { [address]: localSaveObj })
    })
    //  修改chromeStorage
    await setStorage({
        // [ADDRESS_ARRAY]: newArray,
        [address]: localSaveObj
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
    return parseFloat(amount) * Math.pow(10, 10)
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
      const time = extractTime(blockTime.mul(blocks).toNumber());
      const { days, hours, minutes, seconds } = time;
      console.log(time ,'xxx');
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
    const time = extractTime(blockTime.mul(blocks).toNumber());
    const { days, hours, minutes, seconds } = time;
    console.log(time ,'xxx');
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

