import {createSelector} from 'reselect';
import {AppState} from '../rootReducer';
import {StockData} from '../../data/mappings';

const getFormula = (state: AppState) => state.formula.formula;

export const getFormulaSelector = createSelector(getFormula, (formula: string) => formula);

const getCurrentData = (state: AppState) => state.formula.data;

export const getCurrentDataSelector = createSelector(getCurrentData, (data: StockData | null) => data);

const getSelectedSymbol = (state: AppState) => state.formula.selectedSymbol;

export const getSelectedSymbolSelector = createSelector(getSelectedSymbol, (selectedSymbol: string | undefined) => selectedSymbol);

const getCurrentViewData = (state: AppState) => state.formula.viewData;

export const getCurrentViewDataSelector = createSelector(getCurrentViewData, (data: StockData) => data);
