import { createAction } from 'redux-actions';

import * as Type from './actionTypes';

export const quizAdd = createAction(Type.QUIZ_ADD, (payload) => payload);
export const quizUpdate = createAction(Type.QUIZ_UPDATE, (payload) => payload);
export const quizDelete = createAction(Type.QUIZ_DELETE, (payload) => payload);
