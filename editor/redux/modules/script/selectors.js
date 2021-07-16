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
import type { ScriptModel, ScriptRef } from './actions';

const ormSelector = state => state.orm;

export const getScripts: () => Array<ScriptRef> = createSelector(
  ormSelector,
  pageSelectors.getSelectedPage,
  ormCreateSelector(orm, (session, selectedPage) => {
    const { Page } = session;
    if (selectedPage === null) return [];
    const page = Page.withId(selectedPage.id);
    if (page === null) return [];

    return page.sortedScripts.toRefArray();
  })
);

export const getSelectedScript: () => ScriptRef = createSelector(
  ormSelector,
  appStateSelectors.getSelectedScriptId,
  ormCreateSelector(orm, (session, selectedScriptId) => {
    if (selectedScriptId === null) return null;

    const { Script } = session;
    return Script.withId(selectedScriptId).ref;
  })
);

export const selectors = {
  getScripts,
  getSelectedScript
};
