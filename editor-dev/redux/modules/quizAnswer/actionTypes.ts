export const QUIZ_ANSWER_ADD = 'minischool/answer/QUIZ_ANSWER_ADD';
export const QUIZ_ANSWER_DELETE = 'minischool/answer/QUIZ_ANSWER_DELETE';
export const QUIZ_ANSWER_UPDATE = 'minischool/answer/QUIZ_ANSWER_UPDATE';
export const QUIZ_ANSWER_LAST = 'minischool/answer/QUIZ_ANSWER_LAST';

export type QuizAnswerActionTypes = 
  | typeof QUIZ_ANSWER_ADD 
  | typeof QUIZ_ANSWER_DELETE
  | typeof QUIZ_ANSWER_UPDATE
  | typeof QUIZ_ANSWER_LAST;