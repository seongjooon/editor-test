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
import { appStateSelectors } from '../appState';
import { pageSelectors } from '../page';
// type
import type { EventGroupModel, EventGroupRef } from './actions';

const ormSelector = state => state.orm;

export const getEventGroups: () => Array<EventGroupRef> = createSelector(
  ormSelector,
  pageSelectors.getSelectedPage,
  ormCreateSelector(orm, (session, selectedPage) => {
    const { Page } = session;
    if (selectedPage === null) return [];
    const page = Page.withId(selectedPage.id);
    if (page === null) return [];

    //return page.sortedEventGroups.toRefArray();
    return page.sortedEventGroups.toModelArray().map(eventGroup => {
      return {
        ...eventGroup.ref,
        hasLinkdedPage: eventGroup.getLinkedPages().length > 0,
        hasLinkdedComponent: eventGroup.getLinkedComponents().length > 0,
        hasLinkdedScript: eventGroup.getLinkedScripts().length > 0
      };
    });
  })
);

export const getEventItems: () => Array<string> = createSelector(
  ormSelector,
  pageSelectors.getSelectedPage,
  ormCreateSelector(orm, (session, selectedPage) => {
    const retAr = [];
    const { Page, EventGroup } = session;
    if (selectedPage === null) return [];
    const page = Page.withId(selectedPage.id);
    if (page === null) return [];

    //return page.sortedEventGroups.toRefArray();
    const _list = page.sortedEventGroups.toModelArray().map(eventGroup => {
      return eventGroup.ref;
    });

    for (const item of _list) {
      const eventGroup = EventGroup.withId(item.id);

      for (const event of eventGroup.sortedEvents.toModelArray()) {
        if (!event.ref.property) continue;

        const _name = event.ref.property.quizName;
        if (_name) {
          retAr.push(_name);
        }
      }
    }

    return retAr;
  })
);

export const getEventGroupsList: () => Array<EventGroupRef> = createSelector(
  ormSelector,
  pageSelectors.getSelectedPage,
  ormCreateSelector(orm, (session, selectedPage) => {
    const { Page } = session;
    if (selectedPage === null) return [];
    const page = Page.withId(selectedPage.id);
    if (page === null) return [];

    return page.sortedEventGroups.toModelArray();
  })
);

export const getSelectedEventGroup: () => EventGroupRef = createSelector(
  ormSelector,
  appStateSelectors.getSelectedEventGroupId,
  ormCreateSelector(orm, (session, selectedEventGroupId) => {
    if (selectedEventGroupId === null) return null;

    const { EventGroup } = session;
    return EventGroup.withId(selectedEventGroupId).ref;
  })
);

export const selectors = {
  getEventGroups,
  getSelectedEventGroup,
  getEventItems
};
