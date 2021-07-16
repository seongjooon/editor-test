import orm from '../orm';
import { createSelector } from 'redux-orm';

export const selectBooks = createSelector(orm, session => {
    return session.Book.all().toRefArray();
})