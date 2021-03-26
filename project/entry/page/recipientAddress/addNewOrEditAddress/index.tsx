/*
 * @Author: guanlanluditie 
 * @Date: 2021-02-28 09:30:32 
 * @Last Modified by: guanlanluditie
 * @Last Modified time: 2021-03-06 11:17:32
 */

import React, { FC, useReducer, useEffect } from 'react';
import s from './index.css';
import HeadBar from '@widgets/headBar';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import cx from 'classnames';
import { Input, Modal } from 'antd';
import { runInAction } from 'mobx';
import { useStores } from '@utils/useStore';
import { keyring } from '@polkadot/ui-keyring';
import { setStorage } from '@utils/chrome'
import { globalStoreType } from '@entry/store';
import { RECIPIENT_ARRAY } from '@constants/chrome';

interface AddStatus {
    input?: string,
    errInfo?: string,
    otherInfo?: string,
    isEnable?: boolean
}

interface historyState {
    target?: string;
    address?: string;
}

const Entry:FC = function() {
    let { t } = useTranslation();
    const globalStore = useStores('GlobalStore') as globalStoreType;
    const history = useHistory();

    const { addressArr, recipientArr } = globalStore;

    //  国际化的包裹函数
    const lanWrap = (input: string) => t(`recipientAddress:${input}`);

    //  状态管理
    function stateReducer(state: Object, action: AddStatus) {
        return Object.assign({}, state, action);
    }
    const [stateObj, setState] = useReducer(stateReducer, { input: '', errInfo: '', otherInfo: '', isEnable: false } as AddStatus);

    const { target, address } = history.location.state as historyState;
    const isEdit = target === 'edit';


    const targetConfig = isEdit ? recipientArr.find(item => item.address === address) : { address: '', comment: '' };

    useEffect(() => {
        if (isEdit) {
            setState({
                input: address,
                otherInfo: targetConfig.comment
            })
        }
    }, [])

    function addInput(e: React.ChangeEvent<HTMLInputElement>) {
        const inputValue = e.target.value;
        try {
            const publicKey = keyring.decodeAddress(inputValue);
            keyring.encodeAddress(publicKey);
        } catch(e) {
            return setState({
                errInfo: lanWrap('bad address')
            })
        }
        if (addressArr.includes(inputValue) || recipientArr.some(item => item.address === inputValue)) {
            return setState({
                errInfo: lanWrap('The address already exists')
            })
        }
        setState({
            errInfo: '',
            input: inputValue
        })
    }

    async function confirm() {
        const { input, otherInfo, errInfo } = stateObj;
        if (errInfo) {
            return;
        }
        const copyArr = recipientArr.slice();
        const newConfig = { address: input, comment: otherInfo };
        if (isEdit) {
            const rank = copyArr.findIndex(item => item.address === address);
            copyArr[rank] = newConfig;
        } else {
            copyArr.push(newConfig)
        }

        runInAction(() => {
            globalStore.recipientArr = copyArr;
        })
        //  修改chromeStorage
        await setStorage({
            [RECIPIENT_ARRAY]: copyArr
        })
        history.goBack();
    }

    function otherInfoChange(e: React.ChangeEvent<HTMLInputElement>) {
        setState({
            otherInfo: e.target.value
        })
    }

    function deleteAddress() {
        Modal.confirm({
            content: lanWrap('Are you sure you want to delete the address?'),
            async onOk() {
                const copyArr = recipientArr.slice();
                const rank = copyArr.findIndex(item => item.address === address);
                copyArr.splice(rank, 1);
                runInAction(() => {
                    globalStore.recipientArr = copyArr;
                })
                //  修改chromeStorage
                await setStorage({
                    [RECIPIENT_ARRAY]: copyArr
                })
                history.goBack();
            },
            centered: true,
            onCancel() {},
        })
    }

    useEffect(() => {
        const { errInfo, input } = stateObj;
        setState({
            isEnable: errInfo === '' && input !== ''
        })
    }, [stateObj.input, stateObj.errInfo])

    return (
        <div className={s.wrap}>
            <HeadBar word={isEdit? lanWrap('Edit address') : lanWrap('Add address')}/>
            <div className={s.contentWrap}>
                <div className={s.top}>
                    <div className={s.icon}/>
                    <div>DOT</div>
                </div>
                <div className={s.middle}>{lanWrap('Address information')}</div>
                <Input defaultValue={targetConfig.address} className={s.input} placeholder={lanWrap('Enter the address')} onChange={addInput}/>
                <Input defaultValue={targetConfig.comment} className={s.input} placeholder={lanWrap('remarks')} onChange={otherInfoChange}/>
                <div className={s.info}>{stateObj.errInfo}</div>
                <div className={cx(s.btn, stateObj.isEnable ? s.enable : '', isEdit ? s.eCBtn : '')} onClick={confirm}>{isEdit ? lanWrap('save') : lanWrap('complete')}</div>
                {isEdit && <div className={cx(s.btn, s.deleteBtn)} onClick={deleteAddress}>{lanWrap('delete')}</div>}
            </div>
        </div>
    )
}

export default Entry;