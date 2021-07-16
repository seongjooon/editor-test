import orm from '../orm';
import { createSelector } from 'redux-orm';

export const selectScript = createSelector(orm, session => {
    return session.Script.all().toRefArray();
})