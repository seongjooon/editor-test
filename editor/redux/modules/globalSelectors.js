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

export const getSelectedPageId = createSelector(
  ormSelector,
  ormCreateSelector(orm, session => {
    return session.Book.selectedPageId();
  })
);

export const getSelectedPageGroupId = createSelector(
  ormSelector,
  ormCreateSelector(orm, session => {
    console.log('>>>>>>>>>>>>>>> ', orm, session);
    return session.Book.selectedPageGroupId();
  })
);

// export const getSelectedPageGroupId = ormCreateSelector(orm, ormSelector, session => {
//         console.log(">>>>>>>>>>>>>>> ", orm, session);
//         return session.Book.selectedPageGroupId();
//     })

export const getSelectedEventGroupId = createSelector(
  ormSelector,
  ormCreateSelector(orm, session => {
    return session.Book.selectedEventGroupId();
  })
);
