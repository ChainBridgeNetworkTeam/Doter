/*
 * @Author: guanlanluditie 
 * @Date: 2021-03-13 16:49:18 
 * @Last Modified by: guanlanluditie
 * @Last Modified time: 2021-03-13 16:55:11
 */

import React, { FC } from 'react';
import s from './index.css';
import cx from 'classnames';

interface BarProps {
    word: string,
    propClass?: Function,
    cb: Function;
}
const BottomButton:FC<BarProps> = function(props:BarProps) {
    const { word, propClass, cb } = props;

    function callBack() {
        cb();
    }
    return (
        <div className={cx(s.wrap, propClass)} onClick={callBack}>{word}</div>
    )
}

export default BottomButton;