import orm from '../orm';
import { createSelector } from 'redux-orm';

export const selectPageGroups = createSelector(orm, session => {
    return session.PageGroup.all().toRefArray();
})