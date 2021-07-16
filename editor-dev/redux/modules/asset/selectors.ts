import orm from '../orm';
import { createSelector } from 'redux-orm';

export const selectAssets = createSelector(orm, session => {
    return session.Asset.all().toRefArray();
})