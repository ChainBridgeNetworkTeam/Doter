/*
 * @Author: guanlanluditie 
 * @Date: 2021-02-21 10:37:35 
 * @Last Modified by: guanlanluditie
 * @Last Modified time: 2021-03-06 12:40:12
 */


import React, { FC, useState } from 'react';
import s from './index.scss';
import { useTranslation } from 'react-i18next';
import { Form, Input } from 'antd';
import { observer } from 'mobx-react';
import cx from 'classnames';
import { changeInput } from '@utils/input';

interface SecretInput {
    externalCallBack?: Function,
    store?: Record<string, any>,
    secretKey?: string,
    checkSecretKey?: string,
    title?: string,
}
const HeadBar:FC<SecretInput> = function(props:SecretInput) {
    const [secretStatus, setSecretSta] = useState('weak');
    const { secretKey, checkSecretKey, store } = props;
    let { t } = useTranslation();
    //  国际化的包裹函数
    const lanWrap = (input: string) => t(`widgets:${input}`);

    //  修改两个密码
    function changeSecret(e: React.ChangeEvent<HTMLInputElement>, key: string) {
        changeInput(store, key, e);
        if (key === secretKey) {
            const value = e.target.value;
            const hasCapitalLetter = /[A-Z]/.test(value);
            const hasLowcaseLetter = /[a-z]/.test(value);
            const hasNumber = /[0-9]/.test(value);
            const nonAlphanumerics = /[^a-zA-Z0-9]/.test(value);
            const moreThan8 = value.length > 7;
            const res = [hasCapitalLetter, hasLowcaseLetter, hasNumber, moreThan8, nonAlphanumerics].reduce((origin, item) => origin + (item ? 1 : 0), 0);
            setSecretSta(res === 5 ? 'strong' : 'weak')
        }
    }
    return (
        <>
            <div className={cx(s.formTitle, s.midT)}>
                {props.title || lanWrap('password')}
                {store[secretKey] && <div className={cx(s.secWrap)}>
                    {secretStatus === 'strong' ? lanWrap('strong') : lanWrap('weak')}
                </div>}
            </div>
            <Input.Password
                value={store[secretKey]}
                onChange={(e) => changeSecret(e, secretKey)}
                className={cx(s.input)}
                placeholder={lanWrap('Wallet password')}
            />
            <Input.Password
                value={store[checkSecretKey]}
                onChange={(e) => changeSecret(e, checkSecretKey)}
                className={cx(s.input, s.downInput)}
                placeholder={lanWrap('Repeat the password')}
            />
        </>
    )
}

export default observer(HeadBar);