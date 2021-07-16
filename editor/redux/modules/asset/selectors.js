// @flow

/*********
 * LIB
 */
// redux
import { createSelector as ormCreateSelector } from 'redux-orm';
import { createSelector } from 'reselect';

/*******
 * Local
 */
import { orm } from 'redux/modules/model';
// type
import type { AssetModel } from './actions';

const ormSelector = state => state.orm;

export const getAllAssets = createSelector(
  ormSelector,
  ormCreateSelector(orm, session => {
    const { Asset }: { Asset: AssetModel } = session;
    return Asset.all().toRefArray();
  })
);

export const selectors = {
  getAllAssets
};
