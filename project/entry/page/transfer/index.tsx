/*
 * @Author: your name
 * @Date: 2021-04-06 23:45:39
 * @LastEditTime: 2021-07-22 22:37:39
 * @LastEditors: dianluyuanli-wp
 * @Description: In User Settings Edit
 * @FilePath: /Doter/project/entry/page/transfer/index.tsx
 */

import React, { FC, useEffect, useReducer, useMemo } from 'react';
import s from './index.scss';
import HeadBar from '@widgets/headBar';
import { useTranslation } from 'react-i18next';
import cx from 'classnames';
import { addressFormat, dotStrToTransferAmount } from '@utils/tools';
import { keyring } from '@polkadot/ui-keyring';
import DotInput from '@widgets/balanceDotInput';
import { useHistory } from 'react-router-dom';
import { useTokenName, useFeeRate, checkAddressFormat } from '@utils/tools';
import globalStore from '@entry/store';
import { observer } from 'mobx-react';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { PAGE_NAME } from '@constants/app';
import { Input, AutoComplete, Spin, message, Modal } from 'antd';

const  TRANSFER_STEP = {
    ONE: 0,
    TWO: 1
}

const { confirm } = Modal;

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
    isLoading?: boolean;
}
const Transfer:FC = function() {
    let { t } = useTranslation();
    const history = useHistory();
    const tokenName = useTokenName();
    const feeRate = useFeeRate();
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
        partialFee: '',
        buttonActive: false,
        isLoading: false,
        errMsg: '',
        secret: '' } as transferStateObj
    );
    const { balance, lockBalance, currentAccount, api, ableBalance } = globalStore;
    //  判断当前阶段
    const isStepOne = useMemo(() => stateObj.status === TRANSFER_STEP.ONE, [stateObj.status]);
    //  判断摁钮是否可点击
    const buttonIsAcctive = useMemo(() => {
        const { transAmountErrMsg, addressErrMsg, targetAdd, transferAmount, secret, partialFee } = stateObj;
        if (isStepOne) {
            return !!(!transAmountErrMsg && !addressErrMsg && targetAdd && transferAmount && transferAmount !== '0' && partialFee !== '' && partialFee !== '0')
        } else {
            return !!secret
        }
    }, [stateObj.status, stateObj.transferAmount, stateObj.transAmountErrMsg, stateObj.addressErrMsg, stateObj.targetAdd, stateObj.secret, stateObj.partialFee])
    const aferIcon = (
        <div className={s.icon}/>
    )

    const fixDicimal = globalStore.isKusama ? 7 : 5;

    useEffect(() => {
        // async function computedFee() {
        //     //  实时计算交易费用
        //     try {
        //         const { targetAdd, transferAmount } = stateObj;
        //         if (!targetAdd) {
        //             return;
        //         }
        //         const transfer = api.tx.balances.transfer(targetAdd, dotStrToTransferAmount(transferAmount))
        //         const { partialFee } = await transfer.paymentInfo(currentAccount.address);
        //         console.log(partialFee.toHuman(), parseFloat(partialFee.toHuman().split(' ')[0]) / 1000 + '');
        //         setState({
        //             partialFee: parseFloat(partialFee.toHuman().split(' ')[0]) / feeRate + ''
        //         })
        //     } catch {
        //     }
        // }
        // computedFee();
        setState({ partialFee: globalStore.estimatedMinerFee })
    }, [stateObj.transferAmount, stateObj.targetAdd, globalStore.estimatedMinerFee])

    //  校验地址
    //  React.ChangeEventHandler<HTMLTextAreaElement> React.ChangeEvent<HTMLInputElement>
    function addressInput(e: React.ChangeEvent<HTMLTextAreaElement>) {
        let inputValue = e.target.value;
        try {
            const publicKey = keyring.decodeAddress(inputValue);
            keyring.encodeAddress(publicKey);
            checkAddressFormat(inputValue);
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
        console.log('outer input')
        setState({ transferAmount: inputValue })
    }

    function inputSec(e: React.ChangeEvent<HTMLInputElement>) {
        const targetVallue = e.target.value;
        if (!targetVallue) {
            setState({
                errMsg: ''
            })
        }
        setState({
            secret: targetVallue
        })
    }

    function addInput(value: string) {
        setState({
            addressErrMsg: value === currentAccount.address ? lanWrap('Collection address and payment address cannot be the same') : '',
            targetAdd: value
        })
    }

    function setAmountErrString(err: string) {
        setState({
            transAmountErrMsg: err
        })
    }

    function balanceCheckPass() {
        const { transferAmount, partialFee } = stateObj;
        const thrteshold = globalStore.isKusama ? 0.0000333 : 1;
        const thresholdContent = globalStore.isKusama ? '33.33 micro KSM' : '1 DOT';
        const afterTxLessOne = (parseFloat(ableBalance) - parseFloat(transferAmount) + parseFloat(lockBalance) - parseFloat(partialFee)) < thrteshold;
        return new Promise((res, rej) => {
            if (afterTxLessOne) {
                if (lockBalance === '0') {
                    confirm({
                        title: lanWrap('confirm to transfer'),
                        className: s.modalWrapper,
                        icon: <ExclamationCircleOutlined />,
                        content: t('transfer:wiiBeReaped', { threshold: thresholdContent }),
                        onOk() {
                            res(true)
                        },
                        onCancel() {
                            res(false)
                        }
                    })
                } else {
                    confirm({
                        icon: <ExclamationCircleOutlined />,
                        className: s.infoM,
                        content: lanWrap('hasLocked'),
                        onOk() {
                            res(false)
                        },
                    })
                }
            } else {
                res(true);
            }
        })
    }

    async function buttonClick() {
        const { secret, targetAdd, transferAmount } = stateObj;
        if (buttonIsAcctive) {
            if (isStepOne) {
                //  强判断是否超过余额
                if (parseFloat(stateObj.transferAmount) > (parseFloat(ableBalance) - parseFloat(stateObj.partialFee))) {
                    return message.error(t('widgets:your credit is running low'));
                }
                setState({
                    status: TRANSFER_STEP.TWO,
                    errMsg: ''
                })
            } else {
                //  对转账后的剩余金额进行提醒或阻止
                const checkRes = await balanceCheckPass();
                if (!checkRes) {
                    return;
                }
                setState({
                    isLoading: true
                })
                let sendPair = keyring.createFromJson(currentAccount);
                try {
                    sendPair.decodePkcs8(secret)
                } catch(e) {
                    console.log(e);
                    setState({ errMsg: lanWrap('Wrong password'), isLoading: false });
                    return;
                }
                try {
                    const tx = api.tx.balances.transfer(targetAdd, dotStrToTransferAmount(transferAmount));
                    const hash = await tx.signAndSend(sendPair);
                    message.info(lanWrap('success')).then(() => {
                        history.push(PAGE_NAME.HOME);
                    });
                } catch (e) {
                    if (e.toString().includes('Invalid Transaction: Inability to pay some fees')) {
                        setState({ errMsg: lanWrap('The balance is too low')})
                    }
                    message.error(e.toString());
                    console.log(e)
                } finally {
                    setState({
                        isLoading: false
                    })
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
        return <div className={s.contentWrapOne}>
            <div className={cx(s.formTitle, s.topT)}>{lanWrap('Collection address')}</div>
            <AutoComplete
                className={cx(s.input, s.tInput)}
                onChange={addInput}
                options={selectAddress()}
            >
                <div className={s.texWrap}>
                    <Input.TextArea onChange={addressInput}
                        value={stateObj.targetAdd}
                        className={s.textArea}
                        autoSize={{ minRows: 2, maxRows: 2 }}
                        placeholder={lanWrap('Enter the address')}/>
                    {aferIcon}
                </div>
            </AutoComplete>
            <div className={s.addressError}>{stateObj.addressErrMsg}</div>
            <div className={cx(s.formTitle, s.mid)}>{lanWrap('amount of money')} <span className={s.tAmount}>{parseFloat(ableBalance).toFixed(4)} {tokenName} {lanWrap('available')}</span></div>
            <DotInput changeInputFn={inputAmount} minerFee={parseFloat(stateObj.partialFee || '0') * 1.1} controlValue={stateObj.transferAmount} setErr={setAmountErrString} allDot={ableBalance}/>
            <div className={s.placeH}/>
            <Spin spinning={!stateObj.partialFee}>
                <div className={s.feeWrap}>
                    <span>{lanWrap('Transfer fee')}</span>
                    <span className={s.feeStl}>{parseFloat(stateObj.partialFee || '0').toFixed(fixDicimal)} {tokenName}</span>
                </div>
            </Spin>
        </div>
    }
    function isStepTwo() {
        return <div className={s.contentWrap}>
            <div className={cx(s.formTitle, s.topT)}>{lanWrap('Transfer information')}</div>
            <div>
                <div className={s.sTd}>
                    <div>{lanWrap('Transfer amount')}</div><div className={s.tContent}>{stateObj.transferAmount} {tokenName}</div>
                </div>
                <div className={s.sTd}>
                    <div>{lanWrap('Collection address v2')}</div><div className={cx(s.tContent, s.tCAdd)}>{stateObj.targetAdd}</div>
                </div>
                <div className={s.sTd}>
                    <div>{lanWrap('Payment address')}</div><div className={cx(s.tContent, s.tCAdd)}>{currentAccount.address}</div>
                </div>
                <div className={s.sTd}>
                    <div>{lanWrap('Transfer fee')}</div><div className={s.tContent}>{parseFloat(stateObj.partialFee).toFixed(fixDicimal)} {tokenName}</div>
                </div>
            </div>
            <div className={cx(s.formTitle, s.topT)}>{lanWrap('Password confirmation')}</div>
            <Input.Password onChange={(e) => inputSec(e)} className={cx(s.input, s.sInput)} placeholder={lanWrap('Please input a password')}/>
            <div className={s.addressError}>{stateObj.errMsg}</div>
        </div>
    }

    function createPageBack() {
        //  条件判断回退
        if (stateObj.status === TRANSFER_STEP.ONE) {
            history.goBack();
        } else {
            setState({
                status: TRANSFER_STEP.ONE
            })
        }
    }

    return (
        <div className={s.wrap}>
            <HeadBar selfBack={createPageBack} word={lanWrap('Transfer')}/>
            {isStepOne ? renderStepOne() : isStepTwo()}
            <Spin spinning={stateObj.isLoading}>
                <div className={cx(s.button, buttonIsAcctive ? s.canClick : s.shadowBtn)} onClick={buttonClick}>{isStepOne ? lanWrap('next step') : lanWrap('confirm')}</div>
            </Spin>
        </div>
    )
}

export default observer(Transfer);