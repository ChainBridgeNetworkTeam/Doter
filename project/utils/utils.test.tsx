/*
 * @Author: your name
 * @Date: 2021-04-25 22:48:18
 * @LastEditTime: 2021-04-26 08:50:42
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /Doter/project/utils/utils.test.tsx
 */

import { myFormatBalance, addressFormat, validateMnemonicOrHexSeed, validateKeyStoreJsonStr, dotStrToTransferAmount } from './tools';
import keyring from '@polkadot/ui-keyring';

const testKeyStoreJson = {"encoded":"quXlEwqQ5VXyU6rEZJx7aPCqNuDNk0dv1RR2jgQJCgMAgAAAAQAAAAgAAABbe1b7qGsXVk9jvzMgMkVNkchomxCiZzfC6rxbD4vIfdk8lCuaiYEsCNBC3Lx0tWqBs+pFYokWGPqOQ3QEqmRsPuSZ6kkRxuyRTdnGHUX7Lt129kl8xELrcsxE3t4zuPUddvqltp0cw0ssibZbeJSD38dhsoBK8TlvDmEWRKSrS3ybUj2BokltTl1TkwoY56z64sM8bLnARHLc083h","encoding":{"content":["pkcs8","ed25519"],"type":["scrypt","xsalsa20-poly1305"],"version":"3"},"address":"138zXWBiXnW9fjWR43x65WE2KiEpWKtkE2oxNav6NoWntQFH","meta":{"name":"test2","whenCreated":1618650418740}};

const errorKeyStoreJson = {"encoded":"quXlEwqQ5VXyU6rEZJx7aPCqNuDNk0dv1RR2jgQJCgMAgAAAAQAAAAgAAABbe1b7qGsXVk9jvzMgMkVNkchomxCiZzfC6rxbD4vIfdk8lCuaiYEsCNBC3Lx0tWqBs+pFYokWGPqOQ3QEqmRsPuSZ6kkRxuyRTdnGHUX7Lt129kl8xELrcsxE3t4zuPUddvqltp0cw0ssibZbeJSD38dhsoBK8TlvDmEWRKSrS3ybUj2BokltTl1TkwoY56z64sM8bLnARHLc083h","encoding":{"content":["pkcs8","ed25519"],"type":["scrypt","xsalsa20-poly1305"],"version":"3"},"address":"138zXWBiXnW9fj1WR43x65WE2KiEpWKtkE2oxNav6NoWntQFH","meta":{"name":"test2","whenCreated":1618650418740}};
keyring.loadAll({
    //  genesisHash: this.api.genesisHash as any,
    ss58Format: 0,
    //  store: new AccountsStore(),
    type: 'ed25519'
}, [])
describe('test format for balance', () => {
    it('format', () => {
      expect(myFormatBalance('1500632')).toBe('0.15006');
    });

    it('address format', () => {
        expect(addressFormat('158bdo5qm7Cgb2TmbPVpjHhQPWiu5utvSTL5QEDJEN9pLjuF')).toBe('158b....LjuF');
    })

    it('validateMnemonic for words length', () => {
        expect(validateMnemonicOrHexSeed('apple bear')).toStrictEqual({"errMsg": "Mnemonic needs to contain 12, 15, 18, 21, 24 words", "success": false});
    })

    it('retrieve store test: success', () => {
        expect(validateKeyStoreJsonStr(JSON.stringify(testKeyStoreJson))).toStrictEqual({"errMsg": "", "success": true})
    })

    it('retrieve store test: error', () => {
        expect(validateKeyStoreJsonStr(JSON.stringify(errorKeyStoreJson))).toStrictEqual({"errMsg": "无效的keystore", "success": false})
    })

    it('transfor str to amount', () => {
        expect(dotStrToTransferAmount('1.5')).toStrictEqual(15000000000);
    })
})
