/*
 * @Author: guanlanluditie 
 * @Date: 2021-02-13 15:55:08 
 * @Last Modified by: guanlanluditie
 * @Last Modified time: 2021-03-05 10:00:19
 */

import React, { FC, useEffect } from 'react';
import s from './index.css';
import HeadBar from '@widgets/headBar';
import { useTranslation } from 'react-i18next';
import cx from 'classnames';
import Qrcode from 'qrcode';
import { useStores } from '@utils/useStore';
import { globalStoreType } from '../../store';
import { message } from 'antd';
import { canvasToDataURL, dataURLToBlob } from '@utils/tools';
import { saveAs } from 'file-saver';
import copyContent from 'copy-to-clipboard';

const Recient:FC = function() {
    let { t } = useTranslation();
    const globalStore = useStores('GlobalStore') as globalStoreType;
    const { currentAccount } = globalStore;

    //  国际化的包裹函数
    const lanWrap = (input: string) => t(`receipt:${input}`);

    useEffect(() => {
        Qrcode.toCanvas(document.getElementById('qrcode'), currentAccount.address)
    }, [])

    function copyAdd() {
        message.success(lanWrap('Copy succeeded'));
        copyContent(currentAccount.address);
    }

    function downLoadImg() {
        let qrCodeCanvas = document.getElementById('qrcode');
        const dataUrl = canvasToDataURL(qrCodeCanvas);
        const blob = dataURLToBlob(dataUrl);
        saveAs(blob, `${currentAccount.meta.name}_address_qrCode.png`)
    }

    return (
        <div className={s.wrap}>
            <HeadBar word={lanWrap('Collection')}/>
            <div className={s.content}>
                <div className={s.topTip}>{lanWrap('Scan the QR code and transfer money to me')}</div>
                <canvas className={s.qrCode} id='qrcode'/>
                <div className={s.topTip}>{lanWrap('Wallet address')}</div>
                <div className={s.address}>{currentAccount.address}</div>
            </div>
            <div className={s.bottm}>
                <div className={cx(s.buttonWord, s.copy)} onClick={copyAdd}>{lanWrap('Copy address')}</div>
                <div className={s.split}/>
                <div className={cx(s.buttonWord, s.downLoad)} onClick={downLoadImg}>{lanWrap('Download collection code')}</div>
            </div>
        </div>
    )
}

export default Recient;