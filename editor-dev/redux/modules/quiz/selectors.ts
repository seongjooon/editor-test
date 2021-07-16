import orm from '../orm';
import { createSelector } from 'redux-orm';

export const selectQuiz = createSelector(orm, session => {
    console.log(session)
    return session.Quiz.all().toRefArray();
})