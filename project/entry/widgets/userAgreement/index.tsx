/*
 * @Author: guanlanluditie 
 * @Date: 2021-02-17 15:46:34 
 * @Last Modified by: guanlanluditie
 * @Last Modified time: 2021-03-25 21:17:11
 */

import React, { FC, useState } from 'react';
import s from './index.css';
import { PAGE_NAME } from '@constants/app';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import cx from 'classnames';

interface BarProps {
    isCheck: boolean,
    externalCallBack?: Function
}
const HeadBar:FC<BarProps> = function(props:BarProps) {
    const history = useHistory();

    function changeAgreeStatus() {
        props.externalCallBack?.();
    }
    let { t } = useTranslation();
    //  国际化的包裹函数
    const lanWrap = (input: string) => t(`widgets:${input}`);

    //  跳转到用户协议
    function toAgreement(e: React.MouseEvent<HTMLSpanElement, MouseEvent>) {
        e.stopPropagation();
        history.push(PAGE_NAME.USER_AGREEMENT);
    }
    return (
        <>
            <div className={s.agreeWrap} onClick={changeAgreeStatus}>
                <div className={cx(s.check, props.isCheck ? s.accept : s.notAccept)}/>
                <div className={s.agrCon}>{lanWrap('I have read and agree to the user agreement')}<span className={s.agreement} onClick={toAgreement}>《{lanWrap('User agreement')}》</span></div>
            </div>
        </>
    )
}

export default HeadBar;