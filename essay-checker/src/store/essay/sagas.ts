import axios from 'axios';
import {all, call, put, select, takeLatest} from 'redux-saga/effects';

import {
    createEssayFailure,
    createEssaySuccess,
    fetchEssayFailure,
    fetchEssaySuccess, updateEssayFailure,
    updateEssaySuccess
} from './actions';
import {
    CREATE_ESSAY_REQUEST,
    FETCH_ESSAY_REQUEST,
    UPDATE_CHECK_ESSAY_REQUEST,
    UPDATE_ESSAY_REQUEST
} from './actionTypes';
import {CreateEssayRequest, Essay, FetchEssayRequest, UpdateEssayRequest} from './types';
import {AppState} from '../rootReducer';

// const HOST = '';
const HOST = 'http://localhost:80';

const getEssay = (id: string) =>
    axios.get<Essay>(HOST + '/api/works/' + id);

const createEssay = (essay: Essay) =>
    axios.post<Essay>(HOST + '/api/works', {essay});

const updateEssay = (id: string, essay: Essay) =>
    axios.put<Essay>(HOST + '/api/works/' + id, {essay});

const updateCheckEssay = (id: string, essay: Essay) =>
    axios.put<Essay>(HOST + '/api/works/check/' + id, {essay});

const getEssaySelect = (state: AppState) => state.essay.essay;

function* fetchEssaySaga(action: FetchEssayRequest) {
    try {
        const response: { data: Essay } = yield call(getEssay, action.payload.id);
        yield put(
            fetchEssaySuccess({
                essay: response.data,
            })
        );
    } catch (e: any) {
        yield put(
            fetchEssayFailure({
                error: e.message,
            })
        );
    }
}

function* updateEssaySaga(action: UpdateEssayRequest) {
    try {
        const id: string | undefined = action.payload._id;
        if (id) {
            const essay: Essay = yield select(getEssaySelect);
            if (JSON.stringify(essay) === JSON.stringify(action.payload) && essay.status === "open") {
                yield put(updateEssaySuccess());
            } else {
                const response: { data: Essay } = yield call(updateEssay, id, action.payload);
                yield put(updateEssaySuccess());
                yield put(
                    fetchEssaySuccess({essay: {...response.data, _id: action.payload._id}})
                );
            }
        }
    } catch (e: any) {
        yield put(
            updateEssayFailure({
                error: e.message,
            })
        );
    }
}

function* updateCheckEssaySaga(action: UpdateEssayRequest) {
    try {
        const id: string | undefined = action.payload._id;
        if (id) {
            const response: { data: Essay } = yield call(updateCheckEssay, id, action.payload);
            yield put(
                updateEssaySuccess()
            );
            yield put(
                fetchEssaySuccess({essay: {...response.data, _id: action.payload._id}})
            );
        }
    } catch (e: any) {
        yield put(
            updateEssayFailure({
                error: e.message,
            })
        );
    }
}

function* createEssaySaga(action: CreateEssayRequest) {
    try {
        const response: { data: { id: string } } = yield call(createEssay, action.payload);
        yield put(
            createEssaySuccess({
                id: response.data.id,
            })
        );
    } catch (e: any) {
        yield put(
            createEssayFailure({
                error: e.message,
            })
        );
    }
}

/*
  Starts worker saga on latest dispatched `FETCH_TODO_REQUEST` action.
  Allows concurrent increments.
*/
function* essaySaga() {
    yield all([takeLatest(FETCH_ESSAY_REQUEST, fetchEssaySaga)]);
    yield all([takeLatest(CREATE_ESSAY_REQUEST, createEssaySaga)]);
    yield all([takeLatest(UPDATE_ESSAY_REQUEST, updateEssaySaga)]);
    yield all([takeLatest(UPDATE_CHECK_ESSAY_REQUEST, updateCheckEssaySaga)]);
}

export default essaySaga;
