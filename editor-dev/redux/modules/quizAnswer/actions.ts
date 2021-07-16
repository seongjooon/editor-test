import { createAction } from 'redux-actions';

import * as Type from './actionTypes';

export const quizAnswerAdd = createAction(Type.QUIZ_ANSWER_ADD, payload => payload);
export const quizAnswerDelete = createAction(Type.QUIZ_ANSWER_DELETE, payload => payload);
export const quizAnswerUpdate = createAction(Type.QUIZ_ANSWER_UPDATE, payload => payload);
export const quizAnswerLast = createAction(Type.QUIZ_ANSWER_LAST, payload => payload);
