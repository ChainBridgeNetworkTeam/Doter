/*
 * @Author: guanlanluditie 
 * @Date: 2021-03-12 23:53:03 
 * @Last Modified by: guanlanluditie
 * @Last Modified time: 2021-03-25 22:25:08
 */

import React, { FC, useReducer, useState } from 'react';
import s from './index.scss';
import { useTranslation } from 'react-i18next';
import cx from 'classnames';
import { useStores } from '@utils/useStore';
import { globalStoreType } from '@entry/store';
import { InputNumber, message } from 'antd';
import { observer } from 'mobx-react';
import { useTokenName } from '@utils/tools';
import { valueType } from 'antd/lib/statistic/utils';

interface BarProps {
    changeInputFn: Function,
    controlValue: string,
    setErr: Function,
    wrapCls?: string,
    allDot?: string;
    minerFee: number;
}

interface InputStatus {
    transAmountErrMsg: string;
    wrapCls?: string;
}

const DotInput:FC<BarProps> = function(props:BarProps) {
    let { t } = useTranslation();
    const tokenName = useTokenName();
    //  国际化的包裹函数
    const lanWrap = (input: string) => t(`widgets:${input}`);
    const { changeInputFn, wrapCls, setErr, allDot, controlValue, minerFee } = props;

    const globalStore = useStores('GlobalStore') as globalStoreType;
    const { balance } = globalStore;

    const [cValue, setCValue ] = useState(controlValue);

    //  状态管理
    function stateReducer(state: Object, action: InputStatus) {
        return Object.assign({}, state, action);
    }
    const [stateObj, setState] = useReducer(stateReducer, {
        transAmountErrMsg: ''
    } as InputStatus);

    //  验证输入金额
    function inputAmount(value: valueType) {
        const inputValue = value;
        const intReg = /^([0-9]{1,})$/; // 判断整数的正则
        const floatReg = /^([0-9]{1,}[.][0-9]*)$/; //   判断小数的正则
        const strInput = (inputValue || 0).toString();
        if (intReg.test(strInput) || floatReg.test(strInput)) {
            if (inputValue > (parseFloat(balance as string) - minerFee)) {
                const errStr = lanWrap('your credit is running low');
                setState({
                    transAmountErrMsg: errStr
                })
                setErr(errStr)
            } else {
                setState({ transAmountErrMsg: '' })
                setErr('')
            }
        } else {
            const errStr = lanWrap('Wrong format');
            setState({
                transAmountErrMsg: errStr
            })
            setErr(errStr)
        }
        changeInputFn(strInput);
        setCValue(strInput);
    }

    //  点击全部
    function allBtnClick() {
        const legalAllMount = Math.max((parseFloat(allDot) * Math.pow(10, 10) - minerFee * Math.pow(10, 10)) / Math.pow(10, 10), 0) + ''
        changeInputFn(legalAllMount);
        setCValue(legalAllMount);
    }

    const amountIcon = (
        <div className={s.amountIconWrap} onClick={allBtnClick}>
            {tokenName}<div className={s.split} /><div>{lanWrap('all')}</div>
        </div>
    )

    return (
        <div className={wrapCls}>
            <div className={s.inputWrap}>
                <InputNumber
                    bordered={false}
                    stringMode
                    onChange={inputAmount}
                    value={parseFloat(cValue === '0' ? '' : cValue)}
                    className={s.tInput}
                    min={0}
                />
                {amountIcon}
            </div>

            <div className={s.addressError}>{stateObj.transAmountErrMsg}</div>
        </div>
    )
}

export default observer(DotInput);