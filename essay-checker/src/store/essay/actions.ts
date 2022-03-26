import {
    CLEAR_CURRENT_ESSAY,
    CREATE_ESSAY_FAILURE,
    CREATE_ESSAY_REQUEST,
    CREATE_ESSAY_SUCCESS,
    FETCH_ESSAY_FAILURE,
    FETCH_ESSAY_REQUEST,
    FETCH_ESSAY_SUCCESS, UPDATE_CHECK_ESSAY_REQUEST, UPDATE_ESSAY_FAILURE, UPDATE_ESSAY_REQUEST, UPDATE_ESSAY_SUCCESS,
} from './actionTypes';
import {
    ClearCurrentEssay,
    CreateEssayFailure,
    CreateEssayFailurePayload,
    CreateEssayRequest,
    CreateEssaySuccess,
    CreateEssaySuccessPayload, Essay, EssayFailurePayload,
    FetchEssayFailure,
    FetchEssayFailurePayload,
    FetchEssayRequest,
    FetchEssaySuccess,
    FetchEssaySuccessPayload, UpdateCheckEssayRequest, UpdateEssayFailure, UpdateEssayRequest, UpdateEssaySuccess,
} from './types';

export const fetchEssayRequest = (payload: { id: string }): FetchEssayRequest => ({
    type: FETCH_ESSAY_REQUEST,
    payload,
});

export const fetchEssaySuccess = (
    payload: FetchEssaySuccessPayload
): FetchEssaySuccess => ({
    type: FETCH_ESSAY_SUCCESS,
    payload,
});

export const fetchEssayFailure = (
    payload: FetchEssayFailurePayload
): FetchEssayFailure => ({
    type: FETCH_ESSAY_FAILURE,
    payload,
});

export const createEssayRequest = (payload: Essay): CreateEssayRequest => ({
    type: CREATE_ESSAY_REQUEST,
    payload
});

export const createEssaySuccess = (
    payload: CreateEssaySuccessPayload
): CreateEssaySuccess => ({
    type: CREATE_ESSAY_SUCCESS,
    payload,
});

export const createEssayFailure = (
    payload: CreateEssayFailurePayload
): CreateEssayFailure => ({
    type: CREATE_ESSAY_FAILURE,
    payload,
});

export const updateEssayRequest = (payload: Essay): UpdateEssayRequest => ({
    type: UPDATE_ESSAY_REQUEST,
    payload
});

export const updateCheckEssayRequest = (payload: Essay): UpdateCheckEssayRequest => ({
    type: UPDATE_CHECK_ESSAY_REQUEST,
    payload
});

export const updateEssaySuccess = (): UpdateEssaySuccess => ({
    type: UPDATE_ESSAY_SUCCESS,
});

export const clearCurrentEssay = (): ClearCurrentEssay => ({
    type: CLEAR_CURRENT_ESSAY,
});

export const updateEssayFailure = (
    payload: EssayFailurePayload
): UpdateEssayFailure => ({
    type: UPDATE_ESSAY_FAILURE,
    payload,
});


