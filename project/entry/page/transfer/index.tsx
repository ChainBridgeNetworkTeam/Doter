/*
 * @Author: guanlanluditie 
 * @Date: 2021-02-13 23:57:28 
 * @Last Modified by: guanlanluditie
 * @Last Modified time: 2021-03-25 22:36:52
 */
import React, { FC, useEffect, useReducer, useMemo } from 'react';
import s from './index.css';
import './index.antd.css';
import HeadBar from '@widgets/headBar';
import { useTranslation } from 'react-i18next';
import cx from 'classnames';
import { useStores } from '@utils/useStore';
import { globalStoreType } from '../../store';
import { addressFormat } from '@utils/tools';
import { dotStrToTransferAmount } from '@utils/tools';
import { keyring } from '@polkadot/ui-keyring';
import DotInput from '@widgets/balanceDotInput';
import { message } from 'antd';

import { Input, AutoComplete } from 'antd';

const  TRANSFER_STEP = {
    ONE: 0,
    TWO: 1
}

interface transferStateObj {
    addressErrMsg?: string,
    transAmountErrMsg?: string,
    status?: number,
    targetAdd?: string,
    transferAmount?: string,
    secret?: string,
    buttonActive?: boolean,
    errMsg?: string,
    partialFee?: string;
}
const Transfer:FC = function() {
    let { t } = useTranslation();
    //  国际化的包裹函数
    const lanWrap = (input: string) => t(`transfer:${input}`);

    //  状态管理
    function stateReducer(state: Object, action: transferStateObj) {
        return Object.assign({}, state, action);
    }
    const [stateObj, setState] = useReducer(stateReducer, { 
        addressErrMsg: '',
        transAmountErrMsg: '',
        status: TRANSFER_STEP.ONE,
        transferAmount: '0',
        targetAdd: '',
        buttonActive: false,
        errMsg: '',
        secret: '' } as transferStateObj
    );
    const globalStore = useStores('GlobalStore') as globalStoreType;
    const { balance, currentAccount, api, ableBalance } = globalStore;
    //  判断当前阶段
    const isStepOne = useMemo(() => stateObj.status === TRANSFER_STEP.ONE, [stateObj.status]);
    //  判断摁钮是否可点击
    const buttonIsAcctive = useMemo(() => {
        const { transAmountErrMsg, addressErrMsg, targetAdd, transferAmount, secret } = stateObj;
        if (isStepOne) {
            return !!(!transAmountErrMsg && !addressErrMsg && targetAdd && transferAmount)
        } else {
            return !!secret
        }
    }, [stateObj.transferAmount, stateObj.transAmountErrMsg, stateObj.addressErrMsg, stateObj.targetAdd])
    const aferIcon = (
        <div className={s.icon}/>
    )

    useEffect(() => {
        async function computedFee() {
            //  实时计算交易费用
            try {
                const { targetAdd, transferAmount } = stateObj;
                if (!targetAdd) {
                    return;
                }
                const transfer = api.tx.balances.transfer(targetAdd, dotStrToTransferAmount(transferAmount))
                const { partialFee } = await transfer.paymentInfo(currentAccount.address);
                setState({
                    partialFee: parseFloat(partialFee.toHuman().split(' ')[0]) / 1000 + ''
                })
            } catch {
            }
        }
        computedFee();
    }, [stateObj.transferAmount, stateObj.targetAdd])

    const fee = (
        <div className={s.fee}>{stateObj.partialFee} DOT</div>
    )
    //  校验地址
    function addressInput(e: React.ChangeEvent<HTMLInputElement>) {
        let inputValue = e.target.value;
        try {
            const publicKey = keyring.decodeAddress(inputValue);
            keyring.encodeAddress(publicKey);
        } catch(e) {
            return setState({
                addressErrMsg: lanWrap('bad address')
            })
        }
        setState({
            addressErrMsg: inputValue === currentAccount.address ? lanWrap('Collection address and payment address cannot be the same') : '',
            targetAdd: inputValue
        })
    }
    //  验证输入金额
    function inputAmount(inputValue: string) {
        setState({ transferAmount: inputValue })
    }

    function inputSec(e: React.ChangeEvent<HTMLInputElement>) {
        setState({
            secret: e.target.value
        })
    }

    function addInput(value: string) {
        setState({
            targetAdd: value
        })
    }

    function setAmountErrString(err: string) {
        setState({
            transAmountErrMsg: err
        })
    }

    async function buttonClick() {
        const { secret, targetAdd, transferAmount } = stateObj;
        if (buttonIsAcctive) {
            if (isStepOne) {
                setState({
                    status: TRANSFER_STEP.TWO
                })  
            } else {
                let sendPair = keyring.createFromJson(currentAccount);
                try {
                    sendPair.decodePkcs8(secret)
                } catch(e) {
                    console.log(e);
                    setState({ errMsg: lanWrap('Wrong password') })
                    return;
                }
                try {
                    const tx = api.tx.balances.transfer(targetAdd, dotStrToTransferAmount(transferAmount));
                    const hash = await tx.signAndSend(sendPair);
                    message.info(lanWrap('success'))
                } catch (e) {
                    if (e.toString().includes('Invalid Transaction: Inability to pay some fees')) {
                        setState({ errMsg: lanWrap('The balance is too low')})
                    }
                    console.log(e)
                }
            }
        }
    }

    function selectAddress() {
        const { addressArr, accountObj, recipientArr } = globalStore;
        //  个人的账户和转账账户拼接起来
        return addressArr.filter(item => item !== currentAccount.address).map(item => {
            const { address, meta } = accountObj[item];
            return {
                label: meta.name + ' - ' + addressFormat(address),
                value: address
            }
        }).concat(recipientArr.map(item => {
            const { comment, address } = item;
            return {
                label: comment + ' - ' + addressFormat(address),
                value: address
            }
        }))
    }

    function renderStepOne() {
        return <div className={s.contentWrap}>
            <div className={cx(s.formTitle, s.topT)}>{lanWrap('Collection address')}</div>
            <AutoComplete
                className={cx(s.input, 'tInput')}
                onChange={addInput}
                children={<Input onChange={(e) => addressInput(e)}
                    addonAfter={aferIcon}
                    placeholder={lanWrap('Enter the address')}/>}
                options={selectAddress()}
            />
            <div className={s.addressError}>{stateObj.addressErrMsg}</div>
            <div className={cx(s.formTitle, s.mid)}>{lanWrap('amount of money')} <span className={s.tAmount}>{ableBalance} DOT {lanWrap('available')}</span></div>
            <DotInput changeInputFn={inputAmount} controlValue={stateObj.transferAmount} setErr={setAmountErrString} allDot={ableBalance}/>
            <div className={s.feeWrap}>
                <Input
                    disabled
                    value={lanWrap('Transfer fee')}
                    addonAfter={fee}
                    className={cx('feeInput', 'tInput')}/>
            </div>
        </div>
    }

    function isStepTwo() {
        return <div className={s.contentWrap}>
            <div className={cx(s.formTitle, s.topT)}>{lanWrap('Transfer information')}</div>
            <div className={s.tableWrap}>
                <div className={s.sTd}>
                    <div>{lanWrap('Transfer amount')}</div><div className={s.tContent}>{stateObj.transferAmount} DOT</div>
                </div>
                <div className={s.sTd}>
                    <div>{lanWrap('Collection address')}</div><div className={cx(s.tContent, s.tCAdd)}>{stateObj.targetAdd}</div>
                </div>
                <div className={s.sTd}>
                    <div>{lanWrap('Payment address')}</div><div className={cx(s.tContent, s.tCAdd)}>{currentAccount.address}</div>
                </div>
                <div className={s.sTd}>
                    <div>{lanWrap('Transfer fee')}</div><div className={s.tContent}>{parseFloat(stateObj.partialFee).toFixed(5)} DOT</div>
                </div>
            </div>
            <div className={cx(s.formTitle, s.topT)}>{lanWrap('Password confirmation')}</div>
            <Input.Password onChange={(e) => inputSec(e)} className={cx(s.input, 'sInput')} placeholder={lanWrap('Please input a password')}/>
            <div className={s.addressError}>{stateObj.errMsg}</div>
        </div>
    }
    const { targetAdd, transferAmount } = stateObj;
    return (
        <div className={s.wrap}>
            <HeadBar word={lanWrap('Transfer')}/>
            {isStepOne ? renderStepOne() : isStepTwo()}
            <div className={cx(s.button, (targetAdd && transferAmount) ? '' : s.shadowBtn)} onClick={buttonClick}>{isStepOne ? lanWrap('next step') : lanWrap('confirm')}</div>
        </div>
    )
}

export default Transfer;