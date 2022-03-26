import {SET_DATA, SET_FORMULA, SET_VIEW_DATA} from './actionTypes';
import {SetDataAction, SetFormulaAction, SetViewDataAction,} from './types';
import {StockData} from '../../data/mappings';

export const setFormulaAction = (payload: { formula: string }): SetFormulaAction => ({
    type: SET_FORMULA,
    payload,
});

export const setViewDataAction = (payload: { data: StockData }): SetViewDataAction => ({
    type: SET_VIEW_DATA,
    payload,
});

export const setDataAction = (payload: { data: StockData | null, symbol?: string }): SetDataAction => ({
    type: SET_DATA,
    payload,
});
