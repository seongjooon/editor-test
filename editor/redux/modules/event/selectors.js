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

export const getEvents = createSelector(
  ormSelector,
  appStateSelectors.getSelectedEventGroupId,
  ormCreateSelector(orm, (session, selectedEventGroupId) => {
    // console.log('### state', selectedEventGroupId)
    if (selectedEventGroupId === null) return [];
    const { EventGroup } = session;
    const eventGroup = EventGroup.withId(selectedEventGroupId);
    if (eventGroup === null) return [];

    return eventGroup.sortedEvents.toModelArray().map(event => {
      return {
        ...event.ref,
        target: event.target.toModelArray().map(target => {
          return target.id;
        })
      };
    });
  })
);

export const selectors = {
  getEvents
};
