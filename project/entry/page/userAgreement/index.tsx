/*
 * @Author: guanlanluditie 
 * @Date: 2021-02-07 11:50:33 
 * @Last Modified by: guanlanluditie
 * @Last Modified time: 2021-03-22 21:37:27
 */

import React, { FC } from 'react';
import s from './index.css';
import HeadBar from '@widgets/headBar';
import { useTranslation } from 'react-i18next';
import cx from 'classnames';

const CreactAccount:FC = function() {
    let { t } = useTranslation();
    //  国际化的包裹函数
    const lanWrap = (input: string) => t(`userAgreement:${input}`);

    const ContentArr = [
        { classN: cx(s.bold, s.center, s.big), content: lanWrap('title')},
        { classN: cx(s.bold), content: lanWrap('introducton1-0')},
        { classN: cx(s.bold), content: lanWrap('introducton1-1')},
        { classN: cx(s.bold), content: lanWrap('int1-3')},
        { classN: cx(s.bold, s.big), content: lanWrap('c1-0')},
        { classN: cx(s.bold), content: lanWrap('c1-1')},
        { classN: cx(s.bold), content: lanWrap('c1-2')},
        { classN: cx(s.bold), content: lanWrap('c1-3')},
        { classN: cx(s.bold), content: lanWrap('c1-4')},
        { classN: cx(s.bold, s.big), content: lanWrap('c2-0')},
        { classN: '', content: lanWrap('c2-1')},
        { classN: cx(s.bold), content: lanWrap('c2-2')},
        { classN: '', content: lanWrap('c2-3')},
        { classN: cx(s.bold, s.big), content: lanWrap('c2-4')},
        { classN: '', content: lanWrap('c3-1')},
        { classN: cx(s.bold), content: lanWrap('c3-2')},
        { classN: '', content: lanWrap('c3-3')},
        { classN: cx(s.bold, s.big), content: lanWrap('c4-0')},
        { classN: cx(s.bold, s.big), content: lanWrap('c4-1')},
        { classN: cx(s.ident), content: lanWrap('c4-2')},
        { classN: cx(s.bold, s.big), content: lanWrap('c4-3')},
        { classN: cx(s.ident), content: lanWrap('c4-4')},
        { classN: cx(s.bold, s.big), content: lanWrap('c4-5')},
        { classN: cx(s.ident), content: lanWrap('c4-6')},
        { classN: cx(s.bold, s.big), content: lanWrap('c4-7')},
        { classN: cx(s.ident), content: lanWrap('c4-8')},
        { classN: cx(s.bold, s.big), content: lanWrap('c4-9')},
        { classN: cx(s.ident), content: lanWrap('c4-10')},
        { classN: cx(s.bold, s.big), content: lanWrap('c4-11')},
        { classN: cx(s.ident), content: lanWrap('c4-12')},
        { classN: cx(s.bold, s.big), content: lanWrap('c4-13')},
        { classN: cx(s.ident), content: lanWrap('c4-14')},
        { classN: cx(s.bold, s.big), content: lanWrap('c4-15')},
        { classN: cx(s.ident), content: lanWrap('c4-16')},
        { classN: cx(s.bold, s.big), content: lanWrap('c4-17')},
        { classN: cx(s.ident), content: lanWrap('c4-18')},
        { classN: cx(s.bold, s.big), content: lanWrap('c4-19')},
        { classN: cx(s.ident), content: lanWrap('c4-20')},
        { classN: cx(s.bold), content: lanWrap('c4-21')},
        { classN: cx(s.bold, s.center, s.big), content: lanWrap('title2')},
        { classN: cx(s.bold), content: lanWrap('introducton1-0')},
        { classN: cx(s.bold), content: lanWrap('introducton1-1')},
        { classN: cx(s.bold), content: lanWrap('p1-0')},
        { classN: cx(s.bold, s.ident), content: lanWrap('p1-1')},
        { classN: cx(s.bold, s.ident), content: lanWrap('p1-2')},
        { classN: cx(s.bold, s.big), content: lanWrap('p1-3')},
        { classN: cx(s.ident), content: lanWrap('p1-4')},
        { classN: cx(s.ident, s.bold,), content: lanWrap('p1-5')},
        { classN: cx(s.ident), content: lanWrap('p1-6')},
        { classN: cx(s.bold, s.big), content: lanWrap('p1-7')},
        { classN: cx(s.ident), content: lanWrap('p1-8')},
        { classN: cx(s.bold, s.big), content: lanWrap('p1-9')},
        { classN: cx(s.ident), content: lanWrap('p1-10')},
        { classN: cx(s.bold, s.big), content: lanWrap('p1-11')},
        { classN: cx(s.ident), content: lanWrap('p1-12')},
        { classN: cx(s.ident, s.bold), content: lanWrap('p1-13')},
        { classN: cx(s.bold, s.big), content: lanWrap('p1-14')},
        { classN: cx(s.ident), content: lanWrap('p1-15')},
        { classN: cx(s.bold, s.big), content: lanWrap('p1-16')},
        { classN: cx(s.ident), content: lanWrap('p1-17')},
        { classN: cx(s.bold, s.big), content: lanWrap('p1-18')},
        { classN: cx(s.ident), content: lanWrap('p1-19')},
        { classN: cx(s.bold, s.big), content: lanWrap('p1-20')},
        { classN: cx(s.ident, s.bold), content: lanWrap('p1-21')},
        { classN: cx(s.bold, s.big), content: lanWrap('p1-22')},
        { classN: cx(s.ident), content: lanWrap('p1-23')},
        { classN: cx(s.bold), content: lanWrap('p1-24')},
    ]

    function getContent() {
        return ContentArr.map((item, index) => {
            const { classN, content } = item;
            return <p className={classN} key={index}>{content}</p>
        })
    }
    return (
        <div className={s.wrap}>
            <HeadBar word={lanWrap('User agreement')}/>
            <div className={s.contentWrap}>
                {getContent()}
            </div>
        </div>
    )
}

export default CreactAccount;