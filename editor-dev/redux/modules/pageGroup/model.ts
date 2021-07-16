import * as Type from './actionTypes';
import { FADE_TYPE } from '../../../constants/msConstant';

import { Model, many, fk, attr, QuerySet } from 'redux-orm';
import { ReducerModel, ReducerAction, ModelParse } from '@/ormtype/model';
import _ from 'lodash';
import { AnyModel } from 'redux-orm/Model';
import Component from '../component/model';

class PageGroup extends Model {
  static reducer(action: ReducerAction, PageGroup: ReducerModel<PageGroup>, session: any) {
    const { payload, type } = action;
    const { Book, Page, Component, EventGroup } = session;

    switch (type as Type.PageGroupActionTypes) {
      case Type.PAGEGROUP_ADD: {
        Component.select(null);
        EventGroup.select(null);
        const { pageGroupTitle, pageTitle, zIndex } = payload;

        // pageGroup model 추가 후 se
        const pageGroup = PageGroup.create({
          zIndex,
          title: pageGroupTitle,
        });
        this.select(pageGroup.id);

        // page model 추가
        const page = Page.create({ title: pageTitle });
        Page.select(page.id);

        //새 pageGroup에 page 추가
        pageGroup.pages.add(page);

        //Book에 새로 만든 pageGroup 추가함
        const book = Book.getSelected();
        book.pageGroups.add(pageGroup);
        break;
      }
      case Type.PAGEGROUP_DELETE: {
        const { id } = payload;
        if (!this.withId(id)) {
          console.error('ERR: id not exist');
          return;
        }
        Component.select(null); // AppState-selectComponent 변경
        EventGroup.select(null); // AppState-selectedEventGroup 변경
        // delete
        const book = Book.getSelected();

        //현재 페이지그룹이 1개밖에 없으면 return
        if (book.sortedPageGroups.count() <= 1) return;
        this.withId(id).delete();

        // select page group
        const lastPageGroup = book.sortedPageGroups.first();
        this.select(lastPageGroup.id);
        const firstPage = lastPageGroup.sortedPages.first();
        Page.select(firstPage.id);
        break;
      }
      case Type.PAGEGROUP_SELECT: {
        break;
      }
      case Type.PAGEGROUP_CLONE: {
        break;
      }
      case Type.PAGEGROUP_UPDATE_TITLE: {
        const { id, title } = payload;
        if (!this.withId(id)) {
          console.error('ERR: id not exist');
          return;
        }

        const page_group = this.getSelected();
        page_group.set('title', title);
        break;
      }
      case Type.PAGEGROUP_SORT: {
        break;
      }
      case Type.PAGEGROUP_MOVE: {
        break;
      }
    }
  }

  static delete() {
    //@ts-ignore
    this.pages.toModelArray().forEach((item) => {
      item.delete();
    });

    super.delete();
  }

  static parse(data): ModelParse<PageGroup> {
    //@ts-ignore
    const { Page } = this.session;
    const clonedData = { ...data };

    console.log('####### pages', clonedData.pages);
    if (clonedData.pages) {
      clonedData.pages = clonedData.pages.map((page) => Page.parse(page));
    }

    return this.upsert(clonedData);
  }

  // create overriding
  static create(props: any) {
    //@ts-ignore
    const { Book } = this.session;
    const book = Book.getSelected();

    if (book === null || props.hasOwnProperty('zIndex')) {
      return super.create(props);
    }
    // get last zindex
    const lastPageGroup = book.sortedPageGroups.last();
    let nextZIndex = 0;
    if (typeof lastPageGroup !== 'undefined') nextZIndex = lastPageGroup.zIndex + 1;

    return super.create({
      ...props,
      zIndex: nextZIndex,
    });
  }

  static getNextzIndex() {
    //@ts-ignore
    const { Book, PageGroup } = this.session;
    let _zIndex = 0;

    //@ts-ignore
    const lastPageGroup = Book.sortedPageGroups.last();
    if (typeof lastPageGroup !== 'undefined') _zIndex = lastPageGroup.zIndex + 1;

    return _zIndex;
  }

  //@TODO: zIndex 기준으로 오름차순으로 정렬해 리턴
  get sortedPages() {
    //@ts-ignore
    const pages = this.getClass().session.Page.all();
    return pages.orderBy('zIndex');
  }

  static getSelected() {
    //@ts-ignore
    const { Book } = this.session;
    const selectedPageGroupId = Book.getSelectedPageGroupId();
    if (selectedPageGroupId === null) return null;
    else return this.withId(selectedPageGroupId);
  }

  static select(id) {
    //@ts-ignore
    const { Book } = this.session;
    Book.selectPageGroup(id);
    return this.withId(id);
  }
}

PageGroup.modelName = 'PageGroup';

PageGroup.fields = {
  id: attr(),
  title: attr(),
  pages: many('Page', 'pagegroup_pages'),
  zIndex: attr(),
};
//@ts-ignore
PageGroup.defaultProps = {
  title: '새 페이지 그룹',
  pages: [],
  zIndex: 0,
};

export default PageGroup;
