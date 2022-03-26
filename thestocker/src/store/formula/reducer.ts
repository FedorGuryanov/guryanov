import {SET_DATA, SET_FORMULA, SET_VIEW_DATA} from './actionTypes';

import {FormulaActions, FormulaState} from './types';
// import * as dataRes from '../../data/dataRes.json';
const dataRes = require('../../data/dataRes.json');

const initialState: FormulaState = {
    formula: '',
    selectedSymbol: dataRes.AAPL.Symbol,
    data: dataRes.AAPL.data,
    viewData: dataRes.AAPL.data
};

// eslint-disable-next-line import/no-anonymous-default-export
export default (state = initialState, action: FormulaActions) => {
    switch (action.type) {
        case SET_FORMULA:
            return {
                ...state,
                formula: action.payload.formula,
            };
        case SET_VIEW_DATA:
            return {
                ...state,
                viewData: action.payload.data,
            };
        case SET_DATA:
            return {
                ...state,
                selectedSymbol: action.payload.symbol,
                data: action.payload.data,
            };
        default:
            return {
                ...state,
            };
    }
};
