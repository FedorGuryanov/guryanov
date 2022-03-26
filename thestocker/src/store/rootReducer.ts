import {combineReducers} from 'redux';

import formulaReducer from './formula/reducer';

const rootReducer = combineReducers({
    formula: formulaReducer,
});

export type AppState = ReturnType<typeof rootReducer>;

export default rootReducer;
