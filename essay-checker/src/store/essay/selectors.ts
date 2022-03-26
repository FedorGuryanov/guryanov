import {createSelector} from 'reselect';
import {AppState} from '../rootReducer';
import {Essay} from './types';

const getEssayId = (state: AppState) => state.essay.essayId;

const getEssayPendingSave = (state: AppState) => state.essay.pendingSave;

const getEssay = (state: AppState) => state.essay.essay;

const getEssayPendingFetch = (state: AppState) => state.essay.pendingFetch;

export const getEssayIdSelector = createSelector(getEssayId, (id: string | null) => id);

export const getEssayPendingSaveSelector = createSelector(getEssayPendingSave, (pending: boolean) => pending);

export const getEssaySelector = createSelector(getEssay, (essay: Essay | null) => essay);

export const getEssayPendingFetchSelector = createSelector(getEssayPendingFetch, (pending: boolean) => pending);


