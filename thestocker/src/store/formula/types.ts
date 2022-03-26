import {SET_DATA, SET_FORMULA, SET_VIEW_DATA} from './actionTypes';
import {StockData} from '../../data/mappings';

export interface FormulaState {
    formula: string;
    selectedSymbol?: string;
    data: StockData | null;
    viewData: StockData;
}

export interface SetFormulaPayload {
    formula: string;
}

export interface SetViewDataPayload {
    data: StockData;
}

export interface SetDataPayload {
    symbol?: string;
    data: StockData | null;
}

export type SetFormulaAction = {
    type: typeof SET_FORMULA;
    payload: SetFormulaPayload;
};

export type SetViewDataAction = {
    type: typeof SET_VIEW_DATA;
    payload: SetViewDataPayload;
};

export type SetDataAction = {
    type: typeof SET_DATA;
    payload: SetDataPayload;
};

export type FormulaActions = SetFormulaAction | SetViewDataAction | SetDataAction;
