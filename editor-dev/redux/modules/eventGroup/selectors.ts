import orm from '../orm';
import { createSelector } from 'redux-orm';

export const selectEventGroups = createSelector(orm, session => {
    return session.EventGroup.all().toRefArray();
})