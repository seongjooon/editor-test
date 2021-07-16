import * as Type from './actionTypes';
import { FADE_TYPE } from '../../../constants/msConstant';

import { Model, many, fk, attr, ModelType } from 'redux-orm';
import _ from 'lodash';

interface Page {
  eventGroups: any;
  components: any;
  bgImage: any;
  bgSound: any;
  quizzes: any;
  scripts: any;
}


class Page extends Model {
  static reducer(action, Page, session) {
    const { payload, type } = action;
    const { Book, PageGroup, Component, EventGroup, Asset, Script } = session;

    switch (type as Type.PageActionTypes) {
      case Type.PAGE_ADD: {
        Component.select(null);
        EventGroup.select(null);

        const newPage = this.create(payload);
        //this.select(page.id);

        PageGroup.getSelected().pages.add(newPage);
        break;
      }
      case Type.PAGE_DELETE: {
        const { id } = payload;
        if (!this.withId(id)) {
          console.error('ERR: id not exist');
          return;
        }

        Component.select(null);
        EventGroup.select(null);

        const pageGroup = PageGroup.getSelected();
        // @TODO: 페이지그룹의 개수가 1인경우
        if (pageGroup.sortedPages.count() <= 1) return;

        this.withId(id).delete();
        const lastPage = pageGroup.sortedPages.last(); // 마지막 페이지
        this.select(lastPage.id); //마지막 페이지를 선택된 페이지로 설정

        break;
      }
      case Type.PAGE_CLONE: {
        break;
      }
      case Type.PAGE_UPDATE_TITLE: {
        const { title, id } = payload;
        if (!this.withId(id)) {
          console.error('ERR: id not exist');
          return;
        }
        const page = this.getSelected();
        console.log(payload, page);
        page.set('title', title);
        break;
      }
    }
  }

  static create(props: any) {
    //@ts-ignore
    const { PageGroup } = this.session;
    const pageGroup = PageGroup.getSelected();

    if (pageGroup === null || props.hasOwnProperty('zIndex')) {
      return super.create(props);
    }
    // get last zindex
    const lastPage = pageGroup.sortedPages.last();
    let nextZIndex = 0;
    if (typeof lastPage !== 'undefined') nextZIndex = lastPage.zIndex + 1;

    return super.create({
      //@ts-ignore
      ...Page.defaultProps,
      title: props.title,
      zIndex: nextZIndex,
    });
  }

  static getNextzIndex() {
    //@ts-ignore
    const { Book, PageGroup } = this.session;
    let _zIndex = 0;

    //@ts-ignore
    const lastPage = PageGroup.sortedPages.last();
    if (typeof lastPage !== 'undefined') _zIndex = lastPage.zIndex + 1;

    return _zIndex;
  }

  delete() {
    console.log(this.eventGroups.toModelArray());
    //등록된 컴포넌트 삭제
    this.components.toModelArray().forEach((item) => {
      item.delete();
    });

    //등록된 배경이미지 삭제
    if (this.bgImage !== null) this.bgImage.delete();
    //등록된 배경사운드 삭제
    if (this.bgSound !== null) this.bgSound.delete();
    //등록된 이벤트그룹 삭제
    this.deleteAll(this.eventGroups);
    this.deleteAll(this.quizzes);
    this.deleteAll(this.scripts);
    // this.eventGroups.toModelArray().forEach((item) => {
    //   item.delete();
    // });

    // this.quizzes.toModelArray().forEach((item) => {
    //   item.delete();
    // });

    // this.scripts.toModelArray().forEach((item) => {
    //   item.delete();
    // });

    super.delete();
  }

  deleteAll(target: any): void {
    target.toModelArray().forEach((item) => {
      item.delete();
    });
  }

  static parse(data) {
    //@ts-ignore
    const { Component, EventGroup, Asset, Script, Quiz } = this.session;
    const clonedData = { ...data };

    clonedData.components = clonedData.components?.map((component) => Component.parse(component));

    if (clonedData.bgImage) {
      clonedData.bgImage = Asset.parse(clonedData.bgImage);
    }

    if (clonedData.bgSound) {
      clonedData.bgSound = Asset.parse(clonedData.bgSound);
    }

    if (clonedData.eventGroups) {
      clonedData.eventGroups = clonedData.eventGroups?.map((eventGroup) => EventGroup.parse(eventGroup));
    }

    if (clonedData.quizzes) clonedData.quizzes = clonedData.quizzes.map((item) => Quiz.parse(item));

    if (clonedData.scripts) {
      clonedData.scripts = clonedData.scripts.map((item) => Script.parse(item));
    }

    return this.upsert(clonedData);
  }

  static getSelected() {
    //@ts-ignore
    const { Book } = this.session;
    const selectedPageId = Book.getSelectedPageId();
    if (selectedPageId === null) return null;
    else return this.withId(selectedPageId);
  }

  static select(id) {
    //@ts-ignore
    const { Book } = this.session;
    const selectedPageId = Book.getSelectedPageId();
    Book.selectPage(id);
    let selected = this.withId(id);

    if (!selected) {
      Book.selectPage(selectedPageId);
      selected = this.withId(selectedPageId);
    }

    return selected;
  }

  get sortedScripts() {
    return this.scripts.orderBy('zIndex');
  }

}

Page.modelName = 'Page';

Page.fields = {
  id: attr(),
  title: attr(),
  clearGlobalComponent: attr(),
  transparent: attr(),
  ownTexture: attr(),
  fadeType: attr(),
  bgImage: fk('Asset', 'bgImage_ImageComponents'),
  bgSound: fk('Asset', 'bgSound_ImageComponents'),
  bgSoundProperty: attr(),
  components: many('Component'),
  eventGroups: many('EventGroup', 'pages_eventroups'),
  onLoadStart: fk('EventGroup', 'pages_onLoadStart'),
  scripts: many('Script'),
  thumbnail: attr(),
  zIndex: attr(),
  matchings: attr(),
  quizzes: many('Quiz'),
  drawingSize: attr(),
  drawingInit: attr(),
  pageSync: attr(),
};

//@ts-ignore
Page.defaultProps = {
  title: '새 페이지',
  clearGlobalComponent: false,
  transparent: true,
  ownTexture: false,
  fadeType: FADE_TYPE.None,
  bgImage: null,
  bgSound: null,
  bgSoundProperty: {
    stopNextScene: true, // 다음 scene에 넘어갈 때 멈춤
    allowMixed: true, // 다른 사운드와 중복 play를 허용할 것인지 여부 true: 허용 false: 다른 사운드 재생 시 멈춤
    isMusic: true,
    loop: false,
    volume: 4,
  },
  components: [],
  eventGroups: [],
  onLoadStart: null,
  scripts: [],
  thumbnail: '',
  zIndex: 0,
  matchings: [],
  quizzes: [],
  drawingSize: 0, // 0 -> 전체, 1 -> 좌우 10%
  drawingInit: 0, // 0 -> No, 1 -> Yes
  pageSync: 1, // 1 -> Sync, 0 -> No Sync
};

export default Page;
