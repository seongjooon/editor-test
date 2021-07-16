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

/***********
 * Selector
 */

const ormSelector = state => state.orm;

export const getCanvasInfo = createSelector(
  ormSelector,
  ormCreateSelector(orm, session => {
    if (!session.Book.idExists(0)) return null;
    return session.Book.withId(0).canvasProperty;
  })
);

export const getBookInfo = createSelector(
  ormSelector,
  ormCreateSelector(orm, session => {
    if (!session.Book.idExists(0)) return null;

    return session.Book.withId(0).info;
  })
);

export const getLastBookUpdateDate = createSelector(
  ormSelector,
  ormCreateSelector(orm, session => {
    if (!session.Book.idExists(0)) return null;

    return session.Book.withId(0).lastUpdate;
  })
);

export const getBookVersion = createSelector(
  ormSelector,
  ormCreateSelector(orm, session => {
    if (!session.Book.idExists(0)) return null;

    return session.Book.withId(0).version;
  })
);

export const getSelectedPageGroupId = createSelector(
  ormSelector,
  ormCreateSelector(orm, session => {
    return session.Book.getSelectedPageGroupId();
  })
);

export const getSelectedPageId = createSelector(
  ormSelector,
  ormCreateSelector(orm, session => {
    return session.Book.getSelectedPageId();
  })
);

export const getMatchingConditions = createSelector(
  ormSelector,
  ormCreateSelector(orm, session => {
    if (!session.Book.idExists(0)) return null;

    return session.Book.withId(0).matchingConditions;
  })
);

export const selectors = {
  getCanvasInfo,
  getBookVersion,
  getBookInfo,
  getLastBookUpdateDate,
  getSelectedPageId,
  getSelectedPageGroupId,
  getMatchingConditions
};
