import {all, fork} from 'redux-saga/effects';

import essaySaga from './essay/sagas';

export function* rootSaga() {
    yield all([fork(essaySaga)]);
}
