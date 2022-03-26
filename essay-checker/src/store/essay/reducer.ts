import {
    CLEAR_CURRENT_ESSAY,
    CREATE_ESSAY_FAILURE,
    CREATE_ESSAY_REQUEST,
    CREATE_ESSAY_SUCCESS,
    FETCH_ESSAY_FAILURE,
    FETCH_ESSAY_REQUEST,
    FETCH_ESSAY_SUCCESS,
    UPDATE_CHECK_ESSAY_REQUEST,
    UPDATE_ESSAY_FAILURE,
    UPDATE_ESSAY_REQUEST,
    UPDATE_ESSAY_SUCCESS,
} from './actionTypes';

import {EssayActions, EssayState} from './types';

const initialState: EssayState = {
    pendingFetch: false,
    pendingSave: false,
    savedAt: null,
    essayId: null,
    essay: null,
    errorFetch: null,
    errorSave: null,
};

// eslint-disable-next-line import/no-anonymous-default-export
export default (state = initialState, action: EssayActions) => {
    switch (action.type) {
        case FETCH_ESSAY_REQUEST:
            return {
                ...state,
                pendingFetch: true,
            };
        case FETCH_ESSAY_SUCCESS:
            if (JSON.stringify(state.essay) === JSON.stringify(action.payload.essay)) {
                return {
                    ...state,
                    pendingFetch: false,
                    errorFetch: null,
                };
            } else {
                return {
                    ...state,
                    pendingFetch: false,
                    essay: action.payload.essay,
                    errorFetch: null,
                };
            }
        case FETCH_ESSAY_FAILURE:
            return {
                ...state,
                pendingFetch: false,
                essay: null,
                errorFetch: action.payload.error,
            };
        case CREATE_ESSAY_REQUEST:
            return {
                ...state,
                pendingSave: true,
            };
        case CREATE_ESSAY_SUCCESS:
            return {
                ...state,
                pendingSave: false,
                essayId: action.payload.id,
                errorSave: null,
            };
        case CLEAR_CURRENT_ESSAY:
            return {
                ...state,
                essayId: null,
                essay: null,
            };
        case CREATE_ESSAY_FAILURE:
            return {
                ...state,
                pendingSave: false,
                essayId: null,
                errorSave: action.payload.error,
            };
        case UPDATE_ESSAY_REQUEST:
            return {
                ...state,
                pendingSave: true,
            };
        case UPDATE_CHECK_ESSAY_REQUEST:
            return {
                ...state,
                pendingSave: true,
            };
        case UPDATE_ESSAY_SUCCESS:
            return {
                ...state,
                pendingSave: false,
                errorSave: null,
            };
        case UPDATE_ESSAY_FAILURE:
            return {
                ...state,
                pendingSave: false,
                errorSave: action.payload.error,
            };
        default:
            return {
                ...state,
            };
    }
};
