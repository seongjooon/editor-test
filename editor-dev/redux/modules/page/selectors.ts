import orm from '../orm';
import { createSelector } from 'redux-orm';

export const selectPages = createSelector(orm, session => {
    return session.Page.all().toRefArray();
})