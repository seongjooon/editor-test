import orm from '../orm';
import { createSelector } from 'redux-orm';

export const selectAnswer = createSelector(orm, session => {
    return session.QuizAnswer.all().toRefArray();
})