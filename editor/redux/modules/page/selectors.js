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
import { getSelectedPageId as getAppStateSelectedPageId } from '../book/selectors';
// type
import type { PageModel, PageRef } from './actions';
import type { AssetRef } from '../asset';

/*************************
 * Selector
 */

const ormSelector = (state) => state.orm;

export const getPages: () => Array<PageRef> = createSelector(
  ormSelector,
  ormCreateSelector(orm, (session) => {
    const { PageGroup } = session;
    const pageGroup = PageGroup.getSelected();
    if (pageGroup === null) return [];

    return pageGroup.sortedPages.toRefArray();
  })
);

export const getPageModels: () => Array<PageModel> = createSelector(
  ormSelector,
  ormCreateSelector(orm, (session) => {
    const { PageGroup } = session;
    const pageGroup = PageGroup.getSelected();
    if (pageGroup === null) return [];

    return pageGroup.sortedPages.toModelArray();
  })
);

export const getSelectedPage: () => PageRef = createSelector(
  ormSelector,
  getAppStateSelectedPageId,
  ormCreateSelector(orm, (session, selectedPageId) => {
    if (selectedPageId === null) return null;
    const { Page } = session;

    const page = Page.withId(selectedPageId);

    return {
      ...page.ref,
      bgImage: page.bgImage === null ? null : page.bgImage.ref,
      bgSound: page.bgSound === null ? null : page.bgSound.ref,
    };
  })
);

export const getSelectedPageId: () => ?number = createSelector(
  ormSelector,
  getAppStateSelectedPageId,
  ormCreateSelector(orm, (session, selectedPageId) => {
    return selectedPageId;
  })
);

export const getSelectedPageBGImage: () => ?AssetRef = createSelector(
  ormSelector,
  getAppStateSelectedPageId,
  ormCreateSelector(orm, (session, selectedPageId) => {
    if (selectedPageId === null) return null;
    const { Page } = session;
    const page = Page.withId(selectedPageId);
    return page.bgImage ? page.bgImage.ref : null;
  })
);

export const getNextPageId: () => number = createSelector(
  ormSelector,
  getAppStateSelectedPageId,
  getPages,
  ormCreateSelector(orm, (session, selectedPageId, pages) => {
    if (selectedPageId === null) return null;

    const currentIndex = pages.findIndex((page) => page.id === selectedPageId);
    const nextIndex = currentIndex + 1;

    if (nextIndex >= pages.length) return null;

    return pages[nextIndex].id;
  })
);

export const getAllPages: () => Array<PageRef> = createSelector(
  ormSelector,
  ormCreateSelector(orm, (session) => {
    const { Page } = session;

    return Page.all()
      .toModelArray()
      .map((page) => {
        return page.toJSON();
      });
  })
);

export const getMatchings: () => Array<any> = createSelector(
  ormSelector,
  ormCreateSelector(orm, (session) => {
    // if (selectedPageId === null) return null;
    const { Page } = session;
    const page = Page.withId(selectedPageId);
    return page.matchings ? page.matchings : [];
  })
);
 // @TODO: selector 추가
export const getQuizzes: () => Array<any> = createSelector(
  ormSelector,
  getAppStateSelectedPageId,
  ormCreateSelector(orm, (session, selectedPageId) => {
    // if (selectedPageId === null) return null;
    const { Page } = session;
    const page = Page.withId(selectedPageId);
    console.log('@@@@ page', page.quiz, selectedPageId)
    return page.quiz ? page.quiz : [];
  })
);

export const selectors = {
  getPages,
  getSelectedPage,
  getSelectedPageId,
  getSelectedPageBGImage,
  getNextPageId,
  getAllPages,
  getMatchings,
  getQuizzes, // @TODO: export selector
};
