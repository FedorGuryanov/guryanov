import {combineReducers} from 'redux';

import essayReducer from './essay/reducer';

const rootReducer = combineReducers({
    essay: essayReducer,
});

export type AppState = ReturnType<typeof rootReducer>;

export default rootReducer;
