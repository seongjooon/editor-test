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
import { selectors as bookSelector } from '../book/selectors';
// type
import type { PageGroupModel, PageGroupRef } from './actions';
import type { PageRef } from '../page';

const ormSelector = state => state.orm;

export const getPageGroups: () => Array<PageGroupRef> = createSelector(
  ormSelector,
  ormCreateSelector(orm, session => {
    const { Book } = session;
    const book = Book.getSelected();
    if (book === null) return [];

    return book.sortedPageGroups.toRefArray();
  })
);

export const getPageGroupModels: () => Array<PageGroupModel> = createSelector(
  ormSelector,
  ormCreateSelector(orm, session => {
    const { Book } = session;
    const book = Book.getSelected();
    if (book === null) return [];

    return book.sortedPageGroups.toModelArray();
  })
);

export const getPageGroupsWithPages: () => Array<
  PageGroupModel
> = createSelector(
  ormSelector,
  ormCreateSelector(orm, session => {
    const { Book } = session;
    const book = Book.getSelected();
    if (book === null) return [];

    return book.sortedPageGroups.toModelArray().map((g: PageGroupRef) => {
      const pages = g.sortedPages.toModelArray().map((page: PageRef) => {
        return {
          id: page.id,
          title: page.title
        };
      });

      return {
        id: g.id,
        title: g.title,
        pages: pages
      };
    });
  })
);

export const getSelectedPageGroup: () => PageGroupRef = createSelector(
  ormSelector,
  bookSelector.getSelectedPageGroupId,
  ormCreateSelector(orm, (session, selectedPageGroupId) => {
    if (selectedPageGroupId === null) return null;
    const { PageGroup } = session;
    return PageGroup.withId(selectedPageGroupId).ref;
  })
);

const getSelectedPageGroupId: () => number = createSelector(
  ormSelector,
  bookSelector.getSelectedPageGroupId,
  ormCreateSelector(orm, (session, selectedPageGroupId) => {
    return selectedPageGroupId;
  })
);

export const getFirstPageGroupAndPageId: (
  firstPageGroupId: number,
  firstPageId: number
) => {} = createSelector(
  ormSelector,
  ormCreateSelector(orm, session => {
    const { Book } = session;
    const book = Book.getSelected();
    if (book === null) return [];

    const firstPageGroup = book.sortedPageGroups.first();
    const firstPage = firstPageGroup.sortedPages.first();

    return {
      firstPageGroupId: firstPageGroup.id,
      firstPageId: firstPage.id
    };
  })
);

export const getNextPageGroupId: () => number = createSelector(
  ormSelector,
  bookSelector.getSelectedPageGroupId,
  getPageGroups,
  ormCreateSelector(orm, (session, selectedPageGroupId, pageGroups) => {
    if (selectedPageGroupId === null) return null;

    const currentIndex = pageGroups.findIndex(
      pageGroup => pageGroup.id === selectedPageGroupId
    );
    const nextIndex = currentIndex + 1;

    if (nextIndex >= pageGroups.length) return null;

    return pageGroups[nextIndex].id;
  })
);

export const selectors = {
  getPageGroups,
  getSelectedPageGroup,
  getSelectedPageGroupId,
  getFirstPageGroupAndPageId,
  getNextPageGroupId
};
