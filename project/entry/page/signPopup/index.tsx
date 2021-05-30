/*
 * @Author: guanlanluditie 
 * @Date: 2021-03-31 23:01:20 
 * @Last Modified by: guanlanluditie
 * @Last Modified time: 2021-04-01 08:45:08
 */

import React, { FC, useCallback, useEffect, useReducer } from 'react';
import cx from 'classnames';
import { useTranslation } from 'react-i18next';
import { observer } from 'mobx-react';
import { globalStoreType } from '@entry/store';
import GlobalStore from '@entry/store';
import BottomBtn from '@widgets/bottomBtn';
import type { SignerPayloadJSON } from '@polkadot/types/types';
import s from '../authPopup/index.scss';
import styles from './index.scss';
import { retrieveWindow } from '@utils/tools';
import { approveSignPassword, cancelSignRequest } from '@utils/message/message';
import { Input, Spin, message } from 'antd';

interface SignState {
    secret?: string;
    signBtnActive?: boolean;
    showLoading?: boolean;
    signIndex?: number;
}

const Auth:FC = function() {
    let { t } = useTranslation();
    const globalStore = GlobalStore as unknown as globalStoreType ;

    //  状态管理
    function stateReducer(state: Object, action: SignState) {
        return Object.assign({}, state, action);
    }
    const [stateObj, setState] = useReducer(stateReducer, { secret: '', signBtnActive: false, showLoading: false, signIndex: 0 } as SignState);

    //  国际化的包裹函数
    const lanWrap = (input: string) => t(`signPopup:${input}`);

    const _onSign = useCallback(
        (): Promise<void> => {
          if (!stateObj.secret) {
              return;
          }
          const signId = GlobalStore.signReqList[stateObj.signIndex]?.id;
          setState({
              showLoading: true
          })
          return approveSignPassword(signId, false, stateObj.secret)
            .then((): void => {
                console.log('transfer succes!')
            })
            .catch((error: Error): void => {
                if (error.toString().includes('supplied passphrase')) {
                    message.error('Wrong password')
                } else {
                    message.error('Signature failed')
                }
            }).finally(() => {
                retrieveWindow();
                setState({
                    showLoading: false
                })
            });
        },
        [stateObj.secret, GlobalStore.signReqList]
    );
    const { secret } = stateObj;
    const _onCancel = useCallback(
        (): Promise<void> => {
        const signId = GlobalStore.signReqList[stateObj.signIndex]?.id;
        return cancelSignRequest(signId)
            .then(() => {
                console.log('cancel success')
            })
            .catch((error: Error) => {
                    console.error(error.toString())
                }
            ).finally(() => {
                retrieveWindow();
            })
        },
        [GlobalStore.signReqList]
    );

    function getTransDetail() {
        const target = GlobalStore.signReqList[stateObj.signIndex];
        if (!target) {
            return null;
        }
        const { address, name } = target.account;
        const { genesisHash, version, nonce, method } = target.request.payload as SignerPayloadJSON;
        const contentArray = [{ title: 'from', value: target.url}, { title: 'genesis', value: genesisHash},
        { title: 'version', value: version}, { title: 'nonce', value: nonce }, { title: 'method data', value: method }];
        const table =  contentArray.map((item, index) => {
            const { title, value } = item;
            return <div className={styles.detail} key={index}>
                <div className={styles.left}>{title}</div>
                <div className={styles.right}>{value}</div>
            </div>
        })
        return <>
            <div className={styles.addWrap}>
                <div>{name}</div>
                <div className={styles.addDetail}>{address}</div>
            </div>
            <div className={styles.tableWrap}>
                {table}
            </div>
        </>
    }

    function setSecret(e: React.ChangeEvent<HTMLInputElement>) {
        setState({
            secret: e.target.value
        })
    }

    function changeSingIndex(diff: number) {
        const target = stateObj.signIndex + diff;

        if (target < 0 || target > GlobalStore.signReqList.length - 1) {
            return;
        } else {
            setState({
                signIndex: target
            })
        }
    }
    return (
        <div className={styles.wrap}>
            <div className={styles.title}>
                <div className={styles.left}>
                    <div className={cx(s.logo, styles.logo)}/>
                    <div>Doter</div>
                </div>
                {GlobalStore.signReqList.length > 1 && <div className={styles.rightPart}>
                    <div className={cx(styles.forwardArrow)} onClick={() => changeSingIndex(-1)}/>
                    <div className={styles.rank}>{`${(stateObj.signIndex || 0) + 1} / ${GlobalStore.signReqList.length}`}</div>
                    <div className={cx(styles.forwardArrow, styles.backWardArrow)} onClick={() => changeSingIndex(1)}/>
                </div>}
            </div>
            <div className={s.dotLogo}/>
            <div className={s.auth}>{lanWrap('sign info')}</div>
            {getTransDetail()}
            <div className={styles.secWrap}>
                <Input.Password onChange={setSecret} className={styles.input} placeholder={lanWrap('wallet secret')}/>
            </div>
            <Spin spinning={stateObj.showLoading}>
                <BottomBtn word={lanWrap('sign')} cb={_onSign} propClass={cx(styles.btn1, secret ? styles.activeBtn : '')}/>
            </Spin>
            <BottomBtn word={lanWrap('cancel')} cb={_onCancel} propClass={cx(styles.btn2)}/>
        </div>
    )
}

export default observer(Auth);