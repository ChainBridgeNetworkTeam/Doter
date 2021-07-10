/*
 * @Author: guanlanluditie 
 * @Date: 2021-02-26 08:53:09 
 * @Last Modified by: guanlanluditie
 * @Last Modified time: 2021-03-18 23:14:52
 */

import React, { FC, useState } from 'react';
import s from './index.scss';
import HeadBar from '@widgets/headBar';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import cx from 'classnames';
import { useStores } from '@utils/useStore';
import { globalStoreType } from '@entry/store';
import { Input, message } from 'antd';
import { keyring } from '@polkadot/ui-keyring';
import { editAccount } from '@utils/message/message';

interface HState {
    address?: string;
}

const ERR_STATUS = {
    NO_ERR: 0,
    USED_NAME: 1,
}

const Entry:FC = function() {
    let { t } = useTranslation();
    const globalStore = useStores('GlobalStore') as globalStoreType;
    const history = useHistory();

    const [newName, setNewName] = useState('');
    const [errStatus, setSecStatus] = useState(ERR_STATUS.NO_ERR);

    //  国际化的包裹函数
    const lanWrap = (input: string) => t(`setWalletDetial:${input}`);

    const { address } = history.location.state as HState;

    function enterNewName(e: React.ChangeEvent<HTMLInputElement>) {
        const inputContent = e.target.value;
        if (Object.values(globalStore.accountObj).map(item => item.meta.name).includes(inputContent)) {
            return setSecStatus(ERR_STATUS.USED_NAME)
        } else {
            setSecStatus(ERR_STATUS.NO_ERR)
        }
        setNewName(e.target.value);
    }

    async function confirm() {
        if (newName.length === 0) {
            return;
        }
        //  update to background accound
        editAccount(address, newName);
        const targetPair = keyring.getPair(address);
        keyring.saveAccountMeta(targetPair, Object.assign({}, targetPair.meta, { name: newName }));
        message.info(lanWrap('Name updated'));
        setTimeout(() => {
            history.goBack();
        }, 1500);
    }

    const errInfoMap = {
        [ERR_STATUS.NO_ERR]: '',
        [ERR_STATUS.USED_NAME]: lanWrap('usedName'),
    }

    return (
        <div className={s.wrap}>
            <HeadBar word={lanWrap('Change wallet name')}/>
            <Input onChange={enterNewName} className={s.input} placeholder={lanWrap('1-12 characters')} maxLength={12}/>
            <div className={s.info}>{errInfoMap[errStatus]}</div>
            <div className={cx(s.confirm, (newName.length > 0) && errStatus === ERR_STATUS.NO_ERR ? s.heighLight : '')} onClick={confirm}>{lanWrap('confirm')}</div>
        </div>
    )
}

export default Entry;