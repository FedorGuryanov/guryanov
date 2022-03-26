import * as React from 'react'
import {FC, memo} from 'react'
import './Promo.scss'

export const Promo: FC = memo(
    () => {
        return <div className="Promo__wrapper">
            <div className="Promo">
                <div className="Promo__way-wrapper">
                    <div className="Promo__way">
                        find your way to evaluate stocks
                    </div>
                </div>
                <div className="Promo__description _top">
                    <b>The stocker</b> is a tool which helps develop formulas for&nbsp;value&nbsp;investing.
                </div>
                <div className="Promo__description _next">
                    Enter the valuation formula — you can use some well-known formulas such&nbsp;as
                    PS&nbsp;Ratio&nbsp;(MC/R) or&nbsp;others.
                    <br/><br/>
                    We will evaluate 100 largest US companies using this formula and sort them out for you, so you can
                    find
                    the best companies for investment.
                    <br/><br/>
                    Enter custom values in the form and calculate value for&nbsp;any&nbsp;company you&nbsp;want.
                    <br/><br/>
                    Create your own valuation formula and share the result!
                </div>
                <div className="Promo__start">
                    👇 proceed to the formula 👇
                </div>
            </div>
        </div>
    }
);
