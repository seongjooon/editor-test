/**
 * Created by neo on 2016. 11. 15..
 */
/*********
 * LIB
 */
// redux
import { Model, many, fk, attr } from 'redux-orm';
import propTypesMixin from 'redux-orm-proptypes';
import update from 'immutability-helper';
import { createAction } from 'redux-actions';
// util
import {
  isNil,
  random,
  indexOf,
  find,
  isUndefined,
  maxBy,
  isArray
} from 'lodash';

/*******
 * LOCAL
 */
// type
import type { SoundProperty } from 'constants/msType';
import * as CT from 'constants/msConstant';

import type { ComponentModel } from 'redux/modules/component/actions';
import type { EventGroupModel } from 'redux/modules/eventGroup/actions';
import type { ScriptModel } from '../script/script';
import type { AssetModel } from '../asset/actions';

/**************
 * Type
 */

export type PageRef = {
  id: number,
  title: string,
  clearGlobalComponent: boolean,
  transparent: boolean,
  ownTexture: boolean,
  fadeType: string,
  bgImage: ?number,
  bgSound: ?number,
  bgSoundProperty: SoundProperty,
  components: Array<number>,
  eventGroups: Array<number>,
  onLoadStart: ?number,
  scripts: Array<number>,
  thumbnail: string,
  zIndex: number,
  drawingSize: number,
  drawingInit: Number
};

export type PageModel = Page & {
  bgImage: ?AssetModel,
  bgSound: ?AssetModel,
  components: Array<ComponentModel>,
  eventGroups: Array<EventGroupModel>,
  onLoadStart: ?EventGroupModel,
  scripts: Array<ScriptModel>
};

export type MatchingModel = {
  id?: number,
  name: string,
  initial: number,
  trueEventId: number,
  trueEventTitle: string,
  falseEventId: number,
  falseEventTitle: string
};

export type AnswerModel = {
  id?: number,
  title: string,
  defaultImage: ?AssetModel,
  pushedImage: ?AssetModel,
  pushedSound: ?AssetModel
};

export type QuizModel = {
  id?: number,
  title: string,
  answers: Array<AnswerModel>
};

/*****************
 * Constant
 */

// new action type
const ADD = 'minischool/page/ADD';
const DELETE = 'minischool/page/DELETE';
const CLONE = 'minischool/page/CLONE';
const SELECT = 'minischool/page/SELECT';
const SELECT_PAGE_AND_GROUP = 'minischool/page/SELECT_PAGE_AND_GROUP';
const UPDATE_TITLE = 'minischool/page/UPDATE_TITLE';
const SORT = 'minischool/page/SORT';
const ADD_SCRIPT = 'minischool/page/ADD_SCRIPT';
const DELETE_SCRIPT = 'minischool/page/DELETE_SCRIPT';
const UPDATE_SCRIPT = 'minischool/page/UPDATE_SCRIPT';
const UPDATE_BG_IMAGE = 'minischool/page/UPDATE_BG_IMAGE';
const UPDATE_BG_SOUND = 'minischool/page/UPDATE_BG_SOUND';
const UPDATE_FIELD = 'minischool/page/UPDATE_FIELD';
const SORT_SCRIPT = 'minischool/page/SORT_SCRIPT';
const SELECT_NEXT = 'minischool/page/SELECT_NEXT';
const MOVE_PAGE = 'minischool/page/MOVE_PAGE';
const IMPORT = 'minischool/page/IMPORT';
const UPDATE_THUMBNAIL = 'minischool/page/UPDATE_THUMBNAIL';
const UPDATE_TELESCOPE_MODE = 'minischool/page/UPDATE_TELESCOPE_MODE';
const UPDATE_MATCHINGS = 'minischool/book/UPDATE_MATCHINGS';
const UPDATE_QUIZ = 'minischool/book/UPDATE_QUIZ'; // @TODO: action type
const UPDATE_DRAWING_SIZE = 'minischool/page/DRAWING_SIZE';
const UPDATE_DRAWING_INIT = 'minischool/page/DRAWING_INIT';
const UPDATE_PAGE_SYNC = 'minischool/page/PAGE_SYNC';

/***********************
 *  Action
 */

// orm 2.0
const _add = createAction(ADD, (payload: { title: string }) => payload);
const _delete = createAction(DELETE, (payload: { pageId: number }) => payload);
const _clone = createAction(
  CLONE,
  (payload: { id: number, title: string }) => payload
);
const _select = createAction(SELECT, (payload: { id: number }) => payload);
const _selectPageAndGroup = createAction(
  SELECT_PAGE_AND_GROUP,
  (payload: { id: number }) => payload
);
const _selectNext = createAction(SELECT_NEXT);
const _updateTitle = createAction(
  UPDATE_TITLE,
  (payload: { title: string }) => payload
);
const _sort = createAction(
  SORT,
  (payload: { fromIndex: number, toIndex: number }) => payload
);
const _addScript = createAction(
  ADD_SCRIPT,
  (payload: { script: string }) => payload
);
const _deleteScript = createAction(
  DELETE_SCRIPT,
  (payload: { scriptIndex: number }) => payload
);
const _updateScript = createAction(
  UPDATE_SCRIPT,
  (payload: { script: string, scriptIndex: number }) => payload
);
const _updateBGImage = createAction(
  UPDATE_BG_IMAGE,
  (payload: { asset: AssetModel }) => payload
);
const _updateBGSound = createAction(
  UPDATE_BG_SOUND,
  (payload: { asset: AssetModel }) => payload
);
const _sortScript = createAction(
  SORT_SCRIPT,
  (payload: { fromIndex: number, toIndex: number }) => payload
);
const _updateField = createAction(
  UPDATE_FIELD,
  (payload: { fieldName: string, value: any }) => payload
);
const _movePage = createAction(
  MOVE_PAGE,
  (payload: { pageGroupId: number, pageId: number }) => payload
);
const _import = createAction(
  IMPORT,
  (payload: { pageObjects: Array<any> }) => payload
);
const _updateTelescopeMode = createAction(
  UPDATE_TELESCOPE_MODE,
  (payload: { ownTexture: boolean, transparent: boolean }) => payload
);

const _updateMatchings = createAction(
  UPDATE_MATCHINGS,
  (payload: Array) => payload
);

const _updateQuiz = createAction(UPDATE_QUIZ, (payload: Array) => payload); //@TODO: action create function

const _updateDrawingSize = createAction(
  UPDATE_DRAWING_SIZE,
  (payload: { drawingSize: number }) => payload
);
const _updateDrawingInit = createAction(
  UPDATE_DRAWING_INIT,
  (payload: { drawingInit: number }) => payload
);
const _updatePageSync = createAction(
  UPDATE_PAGE_SYNC,
  (payload: { pageSync: number }) => payload
);

export const addPage = (title: string) => {
  return (dispatch: any) => {
    dispatch(_add({ title }));
  };
};

export const deletePage = (pageId: number) => {
  return (dispatch: any) => {
    dispatch(_delete({ pageId }));
  };
};

export const copyPage = (id: number, title: string) => {
  return (dispatch: any) => {
    dispatch(_clone({ id, title }));
  };
};

export const selectPage = (id: number) => {
  return dispatch => {
    dispatch(_select({ id }));
  };
};

export const selectPageAndGroup = (id: number) => {
  return dispatch => {
    dispatch(_selectPageAndGroup({ id }));
  };
};

export const selectNextPage = () => {
  return dispatch => {
    dispatch(_selectNext());
  };
};

export const updatePageTitle = (title: string) => {
  return (dispatch: any) => {
    dispatch(_updateTitle({ title }));
  };
};

export const sortPage = (fromIndex: number, toIndex: number) => {
  return (dispatch: any) => {
    dispatch(_sort({ fromIndex, toIndex }));
  };
};

// script
export const addScript = (script: string) => {
  return dispatch => {
    dispatch(_addScript({ script }));
  };
};

export const deleteScript = (scriptIndex: number) => {
  return dispatch => {
    dispatch(_deleteScript({ scriptIndex }));
  };
};

export const updateScript = (script: string, scriptIndex: number) => {
  return dispatch => {
    dispatch(_updateScript({ script, scriptIndex }));
  };
};

// 페이지의 BG 사운드 변경
export const updateBGImage = (asset: AssetModel) => {
  return dispatch => {
    dispatch(_updateBGImage({ asset }));
  };
};

// 페이지의 BG 사운드 변경
export const updateBGSound = (asset: AssetModel) => {
  return dispatch => {
    dispatch(_updateBGSound({ asset }));
  };
};

// 페이지의 BG 사운드 변경
export const updateBGSoundProperty = (property: SoundProperty) => {
  return dispatch => {
    dispatch(_updateField({ fieldName: 'bgSoundProperty', value: property }));
  };
};

// 페이지의 onLoadStart 이벤트 변경
export const updateOnLoadStart = (eventGroupId: number) => {
  return dispatch => {
    dispatch(_updateField({ fieldName: 'onLoadStart', value: eventGroupId }));
  };
};

export const updateFadeType = fadeType => {
  return dispatch => {
    dispatch(_updateField({ fieldName: 'fadeType', value: fadeType }));
  };
};

// 페이지의 망원경 모드 변경
export const updateTelescopeMode = (
  ownTexture: boolean,
  transparent: boolean
) => {
  return dispatch => {
    dispatch(_updateTelescopeMode({ ownTexture, transparent }));
  };
};

export const updateDrawingSize = (drawingSize: number) => {
  return dispatch => {
    dispatch(_updateDrawingSize({ drawingSize }));
  };
};

export const updateDrawingInit = (drawingInit: number) => {
  return dispatch => {
    dispatch(_updateDrawingInit({ drawingInit }));
  };
};

export const updatePageSync = (pageSync: number) => {
  return dispatch => {
    dispatch(_updatePageSync({ pageSync }));
  };
};

export const addEventGroupToScript = () => {
  return dispatch => {
    // 페이지에 이벤트 그룹 추가
  };
};

export const sortScript = (fromIndex: number, toIndex: number) => {
  return (dispatch: any) => {
    dispatch(_sortScript({ fromIndex, toIndex }));
  };
};

export const movePage = (pageGroupId: number, pageId: number) => {
  return (dispatch: any) => {
    dispatch(_movePage({ pageGroupId, pageId }));
  };
};

export const importPages = (pageObjects: Array<any>) => {
  return (dispatch: any) => {
    dispatch(_import({ pageObjects }));
  };
};

export const updateMatchings = (matchings: Array<MatchingModel>) => {
  return (dispatch: any) => {
    dispatch(_updateMatchings(matchings));
  };
};
//@TODO: liam: action dispatch function
export const updateQuiz = (quizzes: Array<QuizModel>) => {
  return (dispatch: any) => {
    dispatch(_updateQuiz(quizzes));
  };
};

export const actions = {
  addPage,
  deletePage,
  copyPage,
  selectPage,
  selectPageAndGroup,
  selectNextPage,
  updatePageTitle,
  sortPage,
  addScript,
  deleteScript,
  updateScript,
  updateBGImage,
  updateBGSound,
  updateBGSoundProperty,
  updateTelescopeMode,
  updateDrawingSize,
  updateOnLoadStart,
  updateFadeType,
  sortScript,
  movePage,
  importPages,
  updateMatchings
};

/***************
 * Reducer
 */

const ValidatingModel = propTypesMixin(Model);

class Page extends ValidatingModel {
  props: PageModel;

  toString() {
    return `Page: ${this.name}`;
  }

  toJSON() {
    return {
      ...this.ref,
      components: this.components.toModelArray().map(item => item.toJSON()),
      bgImage: isNil(this.bgImage) ? null : this.bgImage.toJSON(),
      bgSound: isNil(this.bgSound) ? null : this.bgSound.toJSON(),
      eventGroups: this.eventGroups.toModelArray().map(item => item.toJSON()),
      quizzes: this.quizzes.toModelArray().map(item => item.toJSON()),
      //onLoadStart: this.onLoadStart,//isNil(this.onLoadStart)?null:this.onLoadStart.toJSON(),
      scripts: this.scripts.toModelArray().map(item => item.toJSON())
    };
  }

  clone(pages: any) {
    const clonedData = this.toJSON();
    const { Page } = this.getClass().session;
    return Page.import(clonedData);
  }

  delete() {
    this.components.toModelArray().forEach(item => {
      item.delete();
    });

    if (this.bgImage !== null) this.bgImage.delete();

    if (this.bgSound !== null) this.bgSound.delete();

    this.eventGroups.toModelArray().forEach(item => {
      item.delete();
    });

    this.quizzes.toModelArray().forEach(item => {
      item.delete();
    });

    this.scripts.toModelArray().forEach(item => {
      item.delete();
    });

    super.delete();
  }

  get sortedEventGroups() {
    return this.eventGroups.orderBy('zIndex');
  }

  get sortedComponents() {
    return this.components.orderBy('zIndex');
  }

  get reverseSortedComponents() {
    return this.components.orderBy('zIndex', ['desc']);
  }

  get sortedScripts() {
    return this.scripts.orderBy('zIndex');
  }

  static create(props) {
    const { PageGroup } = this.session;
    const pageGroup = PageGroup.getSelected();

    if (pageGroup === null || props.hasOwnProperty('zIndex')) {
      return super.create(props);
    }
    // update zindex
    const lastPage = pageGroup.sortedPages.last();
    let nextZIndex = 0;
    if (typeof lastPage !== 'undefined') nextZIndex = lastPage.zIndex + 1;

    return super.create({
      ...props,
      zIndex: nextZIndex
    });
  }

  static getSelected() {
    const { Book } = this.session;
    const selectedPageId = Book.getSelectedPageId();
    if (selectedPageId === null) return null;
    else return this.withId(selectedPageId);
  }

  static select(id) {
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

  static getNext() {
    const { PageGroup } = this.session;
    const pageGroup = PageGroup.getSelected();
    if (pageGroup === null) return null;

    const selectedPage = this.getSelected();
    const pages = pageGroup.sortedPages.toModelArray();
    const currentIndex = pages.findIndex(page => page.id === selectedPage.id);
    const nextIndex = currentIndex + 1;
    if (nextIndex >= pages.length) return null;
    return pages[nextIndex];
  }

  static parse(data) {
    const { Component, EventGroup, Asset, Script, Quiz } = this.session;
    const clonedData = { ...data };

    if (!isNil(clonedData.components))
      clonedData.components = clonedData.components.map(item =>
        Component.parse(item)
      );

    if (!isNil(clonedData.bgImage))
      clonedData.bgImage = Asset.parse(clonedData.bgImage);

    if (!isNil(clonedData.bgSound))
      clonedData.bgSound = Asset.parse(clonedData.bgSound);

    if (!isNil(clonedData.eventGroups))
      clonedData.eventGroups = clonedData.eventGroups.map(item =>
        EventGroup.parse(item)
      );

    if (!isNil(clonedData.quizzes))
      clonedData.quizzes = clonedData.quizzes.map(item => Quiz.parse(item));

    if (!isNil(clonedData.scripts))
      clonedData.scripts = clonedData.scripts.map(item => Script.parse(item));

    return this.upsert(clonedData);
  }

  static updateEventGroupTargetId(eventGroups, item, component) {
    eventGroups.forEach(eventGroup => {
      eventGroup.events.forEach(event => {
        if (typeof event.target === 'undefined' || event.target === null) {
          event.target = [];
        } else if (typeof event.target === 'number') {
          event.target = [event.target];
        } else {
          event.target.forEach((target, index) => {
            if (target === item.id) {
              event.target[index] = component.id;
            }
          });
        }
      });
    });
  }

  static updateQuizAnswerDefaultImageId(quizzes, item, component) {
    quizzes.forEach(quiz => {
      quiz.answers.forEach(answer => {
        if (answer.defaultImage === item.id) answer.defaultImage = component.id;
      });
    });
  }

  static import(data) {
    const {
      Component,
      ImageComponent,
      EventGroup,
      Asset,
      Script,
      Quiz
    } = this.session;
    const clonedData = { ...data };
    console.log('NEO PAGE ', data);

    delete clonedData.id;
    delete clonedData.zIndex;

    if (!isNil(clonedData.components)) {
      clonedData.components = clonedData.components.map(item => {
        const component = Component.import(item);
        console.log('#### cloneData quizzes', clonedData);
        this.updateEventGroupTargetId(clonedData.eventGroups, item, component);

        if (!clonedData.quizzes) {
          clonedData.quizzes = [];
        } else {
          //@TODO 교재 복사시 에러
          this.updateQuizAnswerDefaultImageId(
            clonedData.quizzes,
            item,
            component
          );
        }

        return component;
      });
    }

    if (!isNil(clonedData.bgImage))
      clonedData.bgImage = Asset.import(clonedData.bgImage);

    if (!isNil(clonedData.bgSound))
      clonedData.bgSound = Asset.import(clonedData.bgSound);

    const oldEventGroupId = clonedData.eventGroups.map(eg => eg.id);

    if (!isNil(clonedData.quizzes)) {
      clonedData.quizzes = clonedData.quizzes.map(item => Quiz.import(item));
    }

    if (!isNil(clonedData.eventGroups)) {
      clonedData.eventGroups = clonedData.eventGroups.map(item =>
        EventGroup.import(item)
      );
    }
    const newEventGroupId = clonedData.eventGroups.map(eg => eg.id);

    // pair old & new event group id
    const old_new_pairs = {};
    oldEventGroupId.forEach((key, i) => {
      old_new_pairs[key] = newEventGroupId[i];
    });

    // 페이지 복사 시에, 매칭에 걸려있는 이벤트를 복제된 페이지의 이벤트로 교체한다.
    if (!isNil(clonedData.matchings)) {
      clonedData.matchings = clonedData.matchings.reduce((acc, curr) => {
        let currentItem = { ...curr };
        if (curr.trueEventId > -1) {
          currentItem.trueEventId = old_new_pairs[curr.trueEventId];
        }
        if (curr.falseEventId > -1) {
          currentItem.falseEventId = old_new_pairs[curr.falseEventId];
        }
        acc.push(currentItem);
        return acc;
      }, []);
    }

    // set mouse event to component and behaviors magnetic event
    clonedData.components.forEach((com, index) => {
      if (com.ref.onMouseClick !== null) {
        com.onMouseClick = old_new_pairs[com.ref.onMouseClick];
      }

      if (com.ref.onMouseOver !== null) {
        com.onMouseOver = old_new_pairs[com.ref.onMouseOver];
      }

      if (com.imageComponent !== null) {
        const copied_behaviors = [...com.imageComponent.behaviors];

        copied_behaviors.forEach((b, i) => {
          const copied_behavior = { ...b };

          if (copied_behavior.name === 'Magnetic') {
            if (copied_behavior.eventId !== undefined) {
              copied_behavior.eventId = old_new_pairs[copied_behavior.eventId];
            } else {
              copied_behavior.eventId = null;
            }
          }

          copied_behaviors[i] = copied_behavior;
        });

        com.imageComponent.behaviors = copied_behaviors;
      }
    });

    // set onloadstart event
    if (clonedData.onLoadStart !== null) {
      clonedData.onLoadStart = old_new_pairs[clonedData.onLoadStart];
    }

    if (!isNil(clonedData.scripts)) {
      clonedData.scripts = clonedData.scripts.map(item => Script.import(item));
      clonedData.scripts.forEach(script => {
        if (script.ref.onEndEventGroup !== null) {
          script.onEndEventGroup = old_new_pairs[script.ref.onEndEventGroup];
        }

        const raw = JSON.parse(script.script);
        Object.keys(raw.entityMap).forEach(key => {
          if (raw.entityMap[key].data.mention) {
            const id = oldEventGroupId.find(
              id => id === raw.entityMap[key].data.mention.id
            );
            if (id !== undefined) {
              raw.entityMap[key].data.mention.id = old_new_pairs[id];
            }
          }
        });

        script.script = JSON.stringify(raw);
      });
    }

    return this.upsert(clonedData);
  }

  static reducer(action, Page, session) {
    const { payload, type } = action;
    const { Book, PageGroup, Component, EventGroup, Asset, Script } = session;

    switch (type) {
      case ADD: {
        Component.select(null);
        EventGroup.select(null);
        // create
        const page = this.create(payload);
        // update selected
        this.select(page.id);
        // add to page
        PageGroup.getSelected().pages.add(page);
        break;
      }
      case DELETE: {
        Component.select(null);
        EventGroup.select(null);
        // delete
        const { pageId } = payload;

        const pageGroup = PageGroup.getSelected();
        if (pageGroup.sortedPages.count() <= 1) return;

        this.withId(pageId).delete();

        // select page
        const lastPage = pageGroup.sortedPages.last();
        this.select(lastPage.id);

        break;
      }
      case CLONE: {
        Component.select(null);
        EventGroup.select(null);
        const { id, title } = payload;
        const page = this.withId(id).clone(PageGroup.pages);
        page.set('title', title);
        PageGroup.getSelected().pages.add(page);
        this.select(page.id);
        break;
      }
      case SELECT: {
        Component.select(null);
        EventGroup.select(null);
        const { id } = payload;
        this.select(id);
        break;
      }
      case SELECT_PAGE_AND_GROUP: {
        Component.select(null);
        EventGroup.select(null);
        const { id } = payload;
        const page = this.select(id);
        PageGroup.select(page.pageGroups.first().id);
        break;
      }
      case SELECT_NEXT: {
        Component.select(null);
        EventGroup.select(null);

        let nextPage = this.getNext();
        const nextPageGroup = PageGroup.getNext();

        if (nextPage === null && nextPageGroup !== null) {
          PageGroup.select(nextPageGroup.id);
          nextPage = nextPageGroup.sortedPages.first();
        }
        if (nextPage) {
          this.select(nextPage.id);
        }

        break;
      }
      case UPDATE_TITLE: {
        const page = this.getSelected();
        const { title } = payload;
        page.set('title', title);
        break;
      }
      case SORT: {
        const pageGroup = PageGroup.getSelected();
        const items = pageGroup.sortedPages.toRefArray().map(page => page.id);
        const { fromIndex, toIndex } = payload;
        items.move(fromIndex, toIndex);
        items.forEach((id: number, index: number) => {
          this.withId(id).set('zIndex', index);
        });

        break;
      }
      case ADD_SCRIPT: {
        const { script }: { script: string } = payload;
        const page = this.getSelected();
        const scripts = [...page.scripts, script];
        page.set('scripts', scripts);
        break;
      }
      case DELETE_SCRIPT: {
        const { scriptIndex }: { scriptIndex: number } = payload;
        const page = this.getSelected();
        const scripts = update(page.scripts, {
          $splice: [[scriptIndex, 1]]
        });
        page.set('scripts', scripts);
        break;
      }
      case UPDATE_SCRIPT: {
        const {
          script,
          scriptIndex
        }: { script: string, scriptIndex: number } = payload;
        const page = this.getSelected();
        const scripts = update(page.scripts, {
          [scriptIndex]: { $set: script }
        });
        page.set('scripts', scripts);
        break;
      }
      case UPDATE_BG_IMAGE: {
        const { asset } = payload;
        const selected = this.getSelected();

        if (selected.bgImage !== null) {
          selected.bgImage.delete();
        }
        if (asset !== null) {
          const newAsset = Asset.create(asset);
          selected.bgImage = newAsset;
        }
        break;
      }
      case UPDATE_BG_SOUND: {
        const { asset } = payload;
        const selected = this.getSelected();
        if (selected.bgSound !== null) {
          selected.bgSound.delete();
        }
        if (asset !== null) {
          const newAsset = Asset.create(asset);
          selected.bgSound = newAsset;
        }
        break;
      }
      case SORT_SCRIPT: {
        const page = Page.getSelected();
        const { fromIndex, toIndex } = payload;
        const scripts = [...page.scripts];
        scripts.move(fromIndex, toIndex);
        page.scripts = scripts;
        break;
      }
      case UPDATE_FIELD: {
        const { fieldName, value } = payload;
        const selected = this.getSelected();
        selected.set(fieldName, value);
        break;
      }

      case MOVE_PAGE: {
        const { pageGroupId, pageId } = payload;
        const { PageGroup } = this.session;
        const target_page_group = PageGroup.withId(pageGroupId);
        const selected_page_group = PageGroup.getSelected();

        const page = this.withId(pageId);

        selected_page_group.pages.remove(pageId);
        const last = target_page_group.pages.orderBy('zIndex').last();
        page.zIndex = last.zIndex + 1;

        target_page_group.pages.add(page);
        break;
      }
      case IMPORT: {
        const { pageObjects } = payload;
        pageObjects.forEach(pageObject => {
          const page = this.import(pageObject);
          PageGroup.getSelected().pages.add(page);
        });
        break;
      }

      case UPDATE_THUMBNAIL: {
        const { pageId, thumbnail } = payload;
        const page = this.withId(pageId);
        page.set('thumbnail', thumbnail);
        break;
      }

      case UPDATE_TELESCOPE_MODE: {
        const { ownTexture, transparent } = payload;
        const page = this.getSelected();

        page.set('ownTexture', ownTexture);
        page.set('transparent', transparent);
        break;
      }

      case UPDATE_DRAWING_SIZE: {
        const { drawingSize } = payload;
        const page = this.getSelected();

        page.set('drawingSize', drawingSize);
        break;
      }

      case UPDATE_DRAWING_INIT: {
        const { drawingInit } = payload;
        const page = this.getSelected();

        page.set('drawingInit', drawingInit);
        break;
      }

      case UPDATE_PAGE_SYNC: {
        const { pageSync } = payload;
        const page = this.getSelected();
        page.set('pageSync', pageSync);
        break;
      }

      case UPDATE_MATCHINGS: {
        const page = this.getSelected();
        page.set('matchings', payload);
        break;
      }
      //@TODO: reducer
      case UPDATE_QUIZ: {
        const page = this.getSelected();
        page.set('quiz', payload);
        break;
      }
    }
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
  eventGroups: many('EventGroup', 'pages'),
  onLoadStart: fk('EventGroup', 'pages_onLoadStart'),
  scripts: many('Script'),
  thumbnail: attr(),
  zIndex: attr(),
  matchings: attr(),
  quizzes: many('Quiz'),
  drawingSize: attr(),
  drawingInit: attr(),
  pageSync: attr()
};

Page.defaultProps = {
  title: '새 페이지',
  clearGlobalComponent: false,
  transparent: true,
  ownTexture: false,
  fadeType: CT.FADE_TYPE.None,
  bgImage: null,
  bgSound: null,
  bgSoundProperty: {
    stopNextScene: true, // 다음 scene에 넘어갈 때 멈춤
    allowMixed: true, // 다른 사운드와 중복 play를 허용할 것인지 여부 true: 허용 false: 다른 사운드 재생 시 멈춤
    isMusic: true,
    loop: false,
    volume: 4
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
  pageSync: 1 // 1 -> Sync, 0 -> No Sync
};

export default Page;
