/*
 * @Author: guanlanluditie 
 * @Date: 2021-01-27 00:18:06 
 * @Last Modified by: guanlanluditie
 * @Last Modified time: 2021-02-28 09:37:42
 */
import React, { FC } from 'react';
import s from './index.scss';
import { useHistory } from 'react-router-dom';
import cx from 'classnames';

interface BarProps {
    word: string,
    externalCallBack?: Function,
    showRightIcon?: boolean,
    rightIconCB?: Function,
    selfBack?: Function,
}
const HeadBar:FC<BarProps> = function(props:BarProps) {
    const history = useHistory();
    const { word, externalCallBack, rightIconCB, showRightIcon, selfBack } = props;

    function back() {
        externalCallBack?.();
        if (selfBack) {
            selfBack();
        } else {
            history.goBack();
        }
    }

    function addClick() {
        rightIconCB?.();
    }

    return (
        <div className={s.content}>
           {word}
           <div className={s.backArrow} onClick={back}/>
           {/* 右侧的加号Icon */}
           {showRightIcon && <div className={cx(s.addIcon, 'headerT')} onClick={addClick}/>}
        </div>
    )
}

export default HeadBar;