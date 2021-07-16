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
import { appStateSelectors } from '../appState';

const ormSelector = state => state.orm;

export const getLastAnswer = createSelector(
  ormSelector,
  ormCreateSelector(orm, session => {
    const { Answer } = session;
    return Answer.all().last();
  })
);


export const getAnswers = createSelector(
  ormSelector,
  ormCreateSelector(orm, session => {
    const { Answer } = session;
    return Answer.all().toRefArray();
  })
);

// export const getAnswers = createSelector(
//   ormSelector,
//   appStateSelectors.getSelectedEventGroupId,
//   ormCreateSelector(orm, (session, selectedEventGroupId) => {
//     if (selectedEventGroupId === null) return [];

//     const { EventGroup } = session;
//     const eventGroup = EventGroup.withId(selectedEventGroupId);
//     if (eventGroup === null) return [];

//     return eventGroup.sortedEvents.toModelArray().map((event) => {
//       return {
//         ...event.ref,
//         target: event.target.toModelArray().map((target) => {
//           return target.id;
//         }),
//       };
//     });
//   })
// );

export const selectors = {
  getLastAnswer,
  getAnswers
};
