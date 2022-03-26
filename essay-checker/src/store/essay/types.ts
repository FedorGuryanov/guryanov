import {
    CLEAR_CURRENT_ESSAY,
    CREATE_ESSAY_FAILURE,
    CREATE_ESSAY_REQUEST,
    CREATE_ESSAY_SUCCESS,
    FETCH_ESSAY_FAILURE,
    FETCH_ESSAY_REQUEST,
    FETCH_ESSAY_SUCCESS, UPDATE_CHECK_ESSAY_REQUEST, UPDATE_ESSAY_FAILURE, UPDATE_ESSAY_REQUEST, UPDATE_ESSAY_SUCCESS,
} from './actionTypes';

export type EssayStatus = 'open' | 'ready' | 'checked' | 'closed';

export interface Essay {
    _id?: string;
    text: string;
    themeId: string | null;
    status?: EssayStatus;
    errors?: string[];
    annotations?: any[]
    results?: number[];
}

export interface EssayState {
    pendingFetch: boolean;
    pendingSave: boolean;
    savedAt: string | null;
    essayId: string | null;
    essay: Essay | null;
    errorFetch: string | null;
    errorSave: string | null;
}

export interface FetchEssaySuccessPayload {
    essay: Essay;
}

export interface FetchEssayFailurePayload {
    error: string;
}

export interface CreateEssaySuccessPayload {
    id: string;
}

export interface CreateEssayFailurePayload {
    error: string;
}

export interface EssayFailurePayload {
    error: string;
}

export interface FetchEssayRequest {
    type: typeof FETCH_ESSAY_REQUEST;
    payload: { id: string };
}

export type FetchEssaySuccess = {
    type: typeof FETCH_ESSAY_SUCCESS;
    payload: FetchEssaySuccessPayload;
};

export type FetchEssayFailure = {
    type: typeof FETCH_ESSAY_FAILURE;
    payload: FetchEssayFailurePayload;
};

export interface CreateEssayRequest {
    type: typeof CREATE_ESSAY_REQUEST;
    payload: Essay
}

export type CreateEssaySuccess = {
    type: typeof CREATE_ESSAY_SUCCESS;
    payload: CreateEssaySuccessPayload;
};

export type CreateEssayFailure = {
    type: typeof CREATE_ESSAY_FAILURE;
    payload: CreateEssayFailurePayload;
};

export interface UpdateEssayRequest {
    type: typeof UPDATE_ESSAY_REQUEST;
    payload: Essay
}

export interface UpdateCheckEssayRequest {
    type: typeof UPDATE_CHECK_ESSAY_REQUEST;
    payload: Essay
}

export type UpdateEssaySuccess = {
    type: typeof UPDATE_ESSAY_SUCCESS;
};

export type ClearCurrentEssay = {
    type: typeof CLEAR_CURRENT_ESSAY;
};

export type UpdateEssayFailure = {
    type: typeof UPDATE_ESSAY_FAILURE;
    payload: EssayFailurePayload;
};

export type EssayActions =
    | FetchEssayRequest
    | FetchEssaySuccess
    | FetchEssayFailure
    | ClearCurrentEssay
    | UpdateEssayRequest
    | UpdateEssaySuccess
    | UpdateEssayFailure
    | UpdateCheckEssayRequest
    | CreateEssayRequest
    | CreateEssaySuccess
    | CreateEssayFailure;
