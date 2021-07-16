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

const ormSelector = state => state.orm;

const getC2Datas = createSelector(
  ormSelector,
  ormCreateSelector(orm, session => {
    return session.C2Data.all().toRefArray();
  })
);

export const selectors = {
  getC2Datas
};
