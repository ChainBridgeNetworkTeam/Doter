/*
 * @Author: guanlanluditie 
 * @Date: 2021-02-03 10:57:31 
 * @Last Modified by: guanlanluditie
 * @Last Modified time: 2021-03-25 21:29:59
 */
import React, { FC, useReducer } from 'react';
import s from './index.scss';
import { Input, Form } from 'antd';
import { useTranslation } from 'react-i18next';
import cx from 'classnames';
import { useStores } from '@utils/useStore';
import { changeInput } from '@utils/input';
import { CREAT_STAGE } from '../contants';
import { observer } from 'mobx-react';
import { runInAction } from 'mobx';
import UserAgreement from '@widgets/userAgreement';
import { CreateStoreType } from '../store';
import SecretInput from '@widgets/secretInput';
import createStore from '../store';

const CREATE_STORE_KEY = {
    INPUT_SEC: 'inputSec',
    INPUT_SEC_CONFIRM: 'inputSecConfirm'
};

const INFO_STATUS = {
    COMMON: 0,
    CHECK_AGREEMENT: 1,
    SECRET_NOT_EQUAL: 2,
    SEC_TOO_SHORT: 3
}

interface CreateStateObj {
    sectStatus?: 'weak' | 'strong',
    showSec?: boolean,
    infoStatus?: number
}

const SecretPart:FC = function() {
    let { t } = useTranslation();
    
    //  状态管理
    function stateReducer(state: Object, action: CreateStateObj) {
        return Object.assign({}, state, action);
    }
    const [stateObj, setState] = useReducer(stateReducer, { infoStatus: INFO_STATUS.COMMON } as CreateStateObj);
    //  const createStore = useStores('CreateAccountStore') || {} as CreateStoreType;
    const mnLan = (input: string) => t(`createAccount:${input}`);

    //  切换用户协议状态
    function changeAgreeSta() {
        runInAction(() => {
           createStore.userAgreementSlect = !createStore.userAgreementSlect;
        })
    }
    //  创建账户
    function createAccount() {
        const { inputSec, inputSecConfirm } = createStore;
        console.log(inputSec, 'xxx111');
        //  密码过短
        if (inputSec.length <= 7) {
            return setState({
                infoStatus: INFO_STATUS.SEC_TOO_SHORT
            })
        }
        //  密码不一致
        if (inputSec !== inputSecConfirm) {
            return setState({
                infoStatus: INFO_STATUS.SECRET_NOT_EQUAL
            })
        }
        //  没有勾选用户协议
        if (!createStore.userAgreementSlect) {
            return setState({
                infoStatus: INFO_STATUS.CHECK_AGREEMENT
            })
        }
        //  进入下一阶段
        runInAction(() => {
            createStore.createStage = CREAT_STAGE.MNEMONIC;
        })
        console.log(createStore.createStage, 'xxxxx');
    }

    function infoPart(type: number) {
        const contentMap = {
            [INFO_STATUS.COMMON]: () => <>
                <div className={s.info}>{mnLan('info1')}</div>
                <div className={s.info}>{mnLan("info2")}</div>
            </>,
            [INFO_STATUS.CHECK_AGREEMENT]: () => <div className={s.info}>{mnLan('Please check the user agreement')}</div>,
            [INFO_STATUS.SECRET_NOT_EQUAL]: () => <div className={s.info}>{mnLan('The password is inconsistent')}</div>,
            [INFO_STATUS.SEC_TOO_SHORT]: () => <div className={s.info}>{mnLan('The password is less than 8 digits')}</div>
        }
        return contentMap[type]();
    }
    //  修改眼睛内容，antd有点问题没有办法传入node节点的时候带上类名
    // function secretIcon(show) {
    //     const styleObj = {
    //         width: '0.18rem',
    //         height: '0.18rem',
    //         backgroundSize: '100% 100%',
    //         backgroundImage: "url('./img/openEye.png')"
    //     }
    //     return (show ? <div className={cx(s.secretIcon, s.canSee)} style={{color: 'red'}}>1</div> : <span className={cx(s.secretIcon, s.canNotSee)} style={styleObj}>2</span>)
    // }
    const { inputSec, inputSecConfirm, accountName, userAgreementSlect } = createStore;
    const activeBtn = createStore.userAgreementSlect && inputSec && inputSecConfirm && accountName;
    return (
        <div className={s.contentWrap}>
            <div className={cx(s.formTitle, s.topT, 'testT')}>{mnLan('Wallet name')}</div>
            <Form.Item className={s.formWrap}>
                <Input value={createStore.accountName} onChange={(e) => changeInput(createStore, 'accountName', e)} className={s.input} maxLength={12} placeholder={mnLan('1-12 characters')}/>
            </Form.Item>
            <SecretInput secretKey={CREATE_STORE_KEY.INPUT_SEC} checkSecretKey={CREATE_STORE_KEY.INPUT_SEC_CONFIRM} store={createStore}/>
            <div className={cx(s.explainInfo, 'error')}>
                {infoPart(stateObj.infoStatus)}
            </div>
            <div className={s.pad}/>
            <UserAgreement isCheck={userAgreementSlect} externalCallBack={changeAgreeSta}/>
            <div className={cx(s.createBtn, activeBtn ? '' : s.shadowBtn, 'btn')} onClick={createAccount}>{mnLan('Creating wallets')}</div>
        </div>
    )
}

export default observer(SecretPart);