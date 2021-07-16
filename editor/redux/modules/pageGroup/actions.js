/**
 * Created by neo on 2016. 11. 15..
 */
/*********
 * LIB
 */
// redux
import { Model, many, fk, attr } from 'redux-orm';
import propTypesMixin from 'redux-orm-proptypes';
import { createAction } from 'redux-actions';
import { isNil, maxBy, isUndefined } from 'lodash';
import 'array.prototype.move';

/*******
 * LOCAL
 */
// redux
import { selectComponent } from 'redux/modules/component/actions';
// type
import type { PageModel } from 'redux/modules/page/actions';

/**************
 * Type
 */
export type PageGroupModel = {
  id: number,
  title: string,
  pages: Array<PageModel>,
  zIndex: number
};

export type PageGroupRef = PageGroupModel & {
  pages: Array<number>
};

/*****************
 * Constant
 */

// new action type
const ADD = 'minischool/pageGroup/ADD';
const DELETE = 'minischool/pageGroup/DELETE';
const SELECT = 'minischool/pageGroup/SELECT';
const CLONE = 'minischool/pageGroup/CLONE';
const UPDATE_TITLE = 'minischool/pageGroup/UPDATE_TITLE';
const SORT = 'minischool/pageGroup/SORT';
const MOVE = 'minischool/pageGroup/MOVE';
//

/***********************
 *  Action
 */
const _add = createAction(
  ADD,
  (payload: { pageGroupTitle: string, pageTitle: string }) => payload
);
const _delete = createAction(
  DELETE,
  (payload: { pageGroupId: number }) => payload
);
const _clone = createAction(
  CLONE,
  (payload: { id: number, title: string }) => payload
);
const _select = createAction(SELECT, (payload: { id: number }) => payload);
const _updateTitle = createAction(
  UPDATE_TITLE,
  (payload: { title: string }) => payload
);
const _sort = createAction(
  SORT,
  (payload: { fromIndex: number, toIndex: number }) => payload
);

export const addPageGroup = (pageGroupTitle: string, pageTitle: string) => {
  return (dispatch: any) => {
    dispatch(_add({ pageGroupTitle, pageTitle }));
  };
};

export const deletePageGroup = (pageGroupId: number) => {
  return (dispatch: any) => {
    dispatch(_delete({ pageGroupId }));
  };
};

export const updatePageGroupTitle = (title: string) => {
  return (dispatch: any) => {
    dispatch(_updateTitle({ title }));
  };
};

export const sortPageGroup = (fromIndex: number, toIndex: number) => {
  return (dispatch: any) => {
    dispatch(_sort({ fromIndex, toIndex }));
  };
};

export const copyPageGroup = (id: number, title: string) => {
  return (dispatch: any) => {
    dispatch(_clone({ id, title }));
  };
};

export const selectPageGroup = (id: number) => {
  return (dispatch, getState, orm) => {
    dispatch(selectComponent(null));
    dispatch(_select({ id }));
  };
};

export const actions = {
  addPageGroup,
  deletePageGroup,
  updatePageGroupTitle,
  sortPageGroup,
  copyPageGroup,
  selectPageGroup
};

/***************
 * Reducer
 */

const ValidatingModel = propTypesMixin(Model);

class PageGroup extends ValidatingModel {
  props: PageGroupModel;

  toJSON() {
    return {
      ...this.ref,
      pages: this.pages.toModelArray().map(item => item.toJSON())
    };
  }

  clone(pageGroups: any) {
    const clonedData = { ...this.ref };
    delete clonedData.id;

    if (pageGroups) {
      pageGroups.toModelArray().forEach(group => {
        if (clonedData.zIndex < group.zIndex) {
          group.set('zIndex', group.zIndex + 1);
        }
      });

      clonedData.zIndex += 1;
    }

    clonedData.pages = this.pages.toModelArray().map(page => page.clone());

    const { PageGroup } = this.getClass().session;
    const newPageGroup = PageGroup.create(clonedData);
    return newPageGroup;
  }

  delete() {
    this.pages.toModelArray().forEach(item => {
      item.delete();
    });

    super.delete();
  }

  get sortedPages() {
    return this.pages.orderBy('zIndex');
  }

  static parse(data) {
    const { Page } = this.session;
    const clonedData = { ...data };

    if (!isNil(clonedData.pages))
      clonedData.pages = clonedData.pages.map(item => Page.parse(item));

    return this.upsert(clonedData);
  }

  static create(props) {
    const { Book } = this.session;
    const book = Book.getSelected();

    if (book === null || props.hasOwnProperty('zIndex')) {
      return super.create(props);
    }
    // update zindex
    const lastPageGroup = book.sortedPageGroups.last();
    let nextZIndex = 0;
    if (typeof lastPageGroup !== 'undefined')
      nextZIndex = lastPageGroup.zIndex + 1;

    return super.create({
      ...props,
      zIndex: nextZIndex
    });
  }

  static reducer(action, PageGroup, session) {
    const { payload, type } = action;
    const { Book, Page, Component, EventGroup } = session;

    switch (type) {
      case ADD: {
        Component.select(null);
        EventGroup.select(null);
        const { pageGroupTitle, pageTitle } = payload;

        // create page group
        const pageGroup = this.create({ title: pageGroupTitle });
        this.select(pageGroup.id);

        // create page
        const page = Page.create({ title: pageTitle });
        Page.select(page.id);

        pageGroup.pages.add(page);

        const book = Book.getSelected();
        book.pageGroups.add(pageGroup);
        break;
      }
      case DELETE: {
        Component.select(null);
        EventGroup.select(null);
        // delete
        const { pageGroupId } = payload;

        const book = Book.getSelected();
        if (book.sortedPageGroups.count() <= 1) return;

        this.withId(pageGroupId).delete();

        // select page group
        const lastPageGroup = book.sortedPageGroups.first();
        this.select(lastPageGroup.id);
        const firstPage = lastPageGroup.sortedPages.first();
        Page.select(firstPage.id);
        break;
      }
      case CLONE: {
        Component.select(null);
        EventGroup.select(null);
        const book = Book.getSelected();

        const { id, title } = payload;
        const pageGroup = this.withId(id).clone(book.sortedPageGroups);
        pageGroup.set('title', title);

        this.select(pageGroup.id);
        const firstPage = pageGroup.sortedPages.first();
        Page.select(firstPage.id);
        book.pageGroups.add(pageGroup);
        break;
      }
      case SELECT: {
        //Component.select(null);
        EventGroup.select(null);
        const { id } = payload;
        const firstPage = this.select(id)
          .pages.orderBy('zIndex')
          .first();
        if (typeof firstPage !== 'undefined') Page.select(firstPage.id);
        break;
      }

      case UPDATE_TITLE: {
        const page_group = this.getSelected();
        const { title } = payload;
        page_group.set('title', title);
        break;
      }
      case SORT: {
        const book = Book.getSelected();
        const items = book.sortedPageGroups
          .toRefArray()
          .map(pageGroup => pageGroup.id);
        const { fromIndex, toIndex } = payload;
        items.move(fromIndex, toIndex);
        items.forEach((id: number, index: number) => {
          this.withId(id).set('zIndex', index);
        });

        break;
      }
    }
  }

  static getSelected() {
    const { Book } = this.session;
    const selectedPageGroupId = Book.getSelectedPageGroupId();
    if (selectedPageGroupId === null) return null;
    else return this.withId(selectedPageGroupId);
  }

  static select(id) {
    const { Book } = this.session;
    Book.selectPageGroup(id);
    return this.withId(id);
  }

  static getNext() {
    const { Book } = this.session;
    const book = Book.getSelected();
    if (book === null) return null;

    const selectedPageGroup = this.getSelected();
    const pageGroups = book.sortedPageGroups.toModelArray();
    const currentIndex = pageGroups.findIndex(
      pageGroup => pageGroup.id === selectedPageGroup.id
    );
    const nextIndex = currentIndex + 1;
    if (nextIndex >= pageGroups.length) return null;
    return pageGroups[nextIndex];
  }
}

PageGroup.modelName = 'PageGroup';

PageGroup.fields = {
  id: attr(),
  title: attr(),
  pages: many('Page', 'pageGroups'),
  zIndex: attr()
};

PageGroup.defaultProps = {
  title: '새 페이지 그룹',
  pages: [],
  zIndex: 0
};

export default PageGroup;
