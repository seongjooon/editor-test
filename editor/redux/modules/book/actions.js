/*********
 * LIB
 */
// redux
import { Model, attr, many } from 'redux-orm';
import propTypesMixin from 'redux-orm-proptypes';
import { createAction } from 'redux-actions';
import { isUndefined, isEmpty } from 'lodash';
import Language from 'constants/Language';
import { EVENT_ACTION } from 'redux/modules/event/actions';
import { FLY_TYPE, ANIMATION_EFFECT } from 'constants/msConstant';

/*******
 * LOCAL
 */
//redux
import FetchPost from 'utils/FetchPost';
import {
  initAppState,
  startRequest,
  doneRequest,
  showLoadingScreen,
  updateLoadProgress
} from 'redux/modules/appState/actions';

import Loader from 'redux/middleware/Loader';

// Log
import MSLog from 'utils/MSLog';

// util
import MSError from 'utils/MSError';
import { getPkgVersion } from 'utils/getAppInfo';
import MSConfig from 'constants/msConfig';
import queryString from 'query-string';

// type
import type { BookInfo, CanvasProperty } from 'constants/msType';
import type { PageGroupModel } from '../pageGroup/actions';
// constants
import { END_REASON } from 'constants/Log';
import { API_HOST, API_PATH } from 'constants/msConstant';

/********
 * Constants
 */
const LOAD = 'minischool/book/LOAD';
const CREATE = 'minischool/book/CREATE';
const UPDATE = 'minischool/book/UPDATE';

/***********************
 *  Action
 */
const _load = createAction(LOAD, (payload: Object) => payload);
const _create = createAction(CREATE, (payload: Object) => payload);
const _update = createAction(UPDATE, (payload: Object) => payload);

export const loadBook = () => {
  return (dispatch, getState) => {
    /// request
    const { token, bookId } = getState().auth;
    dispatch(request(token, bookId));
  };
};

export const request = (token, bookId) => {
  return (dispatch, getState) => {
    MSError.info(`requestBook bookId: ${bookId}`, 'book', null);

    const { classKey } = getState().auth;
    const paramObj = {
      book_id: bookId,
      token: token,
      class_key: classKey
    };

    return FetchPost(API_HOST + API_PATH + '/book/findBookInfo', {
      body: JSON.stringify(paramObj)
    })
      .then(res => {
        MSError.info(`requestBook result: ${res.resultCode}`, 'book', null);

        //dispatch(clear());
        const book = res.result;
        let editorVersion = 1.0;
        if (!isUndefined(book.editor_version)) {
          editorVersion = parseInt(book.editor_version);
        }

        if (editorVersion < 2.0) {
          MSLog({
            code: END_REASON.BOOK_DATA_INVALID,
            error: new Error('editor version error')
          });
        } else {
          MSConfig.isReadOnly = res.result.is_readonly;
          MSConfig.useTeacherCamera = res.result.is_teacher_camera;
          MSConfig.character = res.result.teacher_character;

          let lang =
            navigator.language || navigator.userLanguage
              ? (navigator.language || navigator.userLanguage)
                  .toLowerCase()
                  .slice(0, 2)
              : 'en';
          const headers = new Headers();
          headers.append('pragma', 'no-cache');
          headers.append('cache-control', 'no-cache');

          lang = lang !== 'ko' ? 'en' : lang;
          const url_params = queryString.parse(location.search);
          url_params.lang && (lang = url_params.lang);

          fetch(`${Language.uri}/messages_${lang}.js`, {
            method: 'get',
            headers: headers,
            cache: 'no-cache'
          })
            .then(res => {
              return res.json();
            })
            .then(json => {
              Language.setLanguage(json);
              //@TODO: 이벤트 추가 제목
              EVENT_ACTION.forEach(actions => {
                actions.forEach(a => {
                  const { action } = a;

                  switch (action) {
                    case 'component/fadeIn': {
                      a.name = Language.json['lang.code.30041'];
                      a.customName = Language.json['lang.code.30057'];
                      break;
                    }
                    case 'component/fadeOut': {
                      a.name = Language.json['lang.code.30042'];
                      a.customName = Language.json['lang.code.30057'];
                      break;
                    }
                    case 'component/flyIn': {
                      a.name = Language.json['lang.code.30043'];
                      a.customName = Language.json['lang.code.30057'];
                      break;
                    }
                    case 'component/flyOut': {
                      a.name = Language.json['lang.code.30044'];
                      a.customName = Language.json['lang.code.30057'];
                      break;
                    }
                    case 'component/moveTo': {
                      a.name = Language.json['lang.code.30045'];
                      a.customName = Language.json['lang.code.30057'];
                      break;
                    }
                    case 'component/moveToWithSize': {
                      a.name = Language.json['lang.code.30266'];
                      a.customName = Language.json['lang.code.30057'];
                      break;
                    }
                    case 'component/scale': {
                      a.name = Language.json['lang.code.30046'];
                      a.customName = Language.json['lang.code.30057'];
                      break;
                    }
                    case 'component/rotate': {
                      a.name = Language.json['lang.code.30047'];
                      a.customName = Language.json['lang.code.30057'];
                      break;
                    }
                    case 'component/changeImage': {
                      a.name = Language.json['lang.code.30048'];
                      a.customName = Language.json['lang.code.30057'];
                      break;
                    }
                    case 'component/runBehavior': {
                      a.name = Language.json['lang.code.30049'];
                      a.customName = Language.json['lang.code.30057'];
                      break;
                    }
                    case 'component/stopBehavior': {
                      a.name = Language.json['lang.code.30050'];
                      a.customName = Language.json['lang.code.30057'];
                      break;
                    }
                    case 'voiceHelper/show': {
                      a.name = Language.json['lang.code.30288'];
                      a.customName = Language.json['lang.code.30057'];
                      break;
                    }
                    case 'voiceHelper/speak': {
                      a.name = Language.json['lang.code.30289'];
                      a.customName = Language.json['lang.code.30057'];
                      break;
                    }
                    case 'voiceHelper/disappear': {
                      a.name = Language.json['lang.code.30290'];
                      a.customName = Language.json['lang.code.30057'];
                      break;
                    }
                    case 'character/invisible': {
                      a.name = Language.json['lang.code.30054'];
                      a.customName = Language.json['lang.code.30057'];
                      break;
                    }
                    case 'sound/play': {
                      a.name = Language.json['lang.code.30051'];
                      a.customName = Language.json['lang.code.30057'];
                      break;
                    }
                    case 'sound/stop': {
                      a.name = Language.json['lang.code.30233'];
                      a.customName = Language.json['lang.code.30057'];
                      break;
                    }
                    case 'page/goto': {
                      a.name = Language.json['lang.code.30052'];
                      a.customName = Language.json['lang.code.30057'];
                      break;
                    }
                    case 'uri/redirect': {
                      a.name = Language.json['lang.code.30053'];
                      a.customName = Language.json['lang.code.30057'];
                      break;
                    }
                    case 'student/invisible': {
                      a.name = Language.json['lang.code.30055'];
                      a.customName = Language.json['lang.code.30057'];
                      break;
                    }
                    case 'teacher/invisible': {
                      a.name = Language.json['lang.code.30056'];
                      a.customName = Language.json['lang.code.30057'];
                      break;
                    }
                    case 'component/matching': {
                      a.name = Language.json['lang.code.30021'];
                      a.customName = Language.getString(30057);
                      break;
                    }
                    case 'drawing/controller': {
                      a.name = Language.getString(30209);
                      a.customName = Language.getString(30057);
                      break;
                    }
                    case 'drawing/clear': {
                      a.name = Language.getString(30210);
                      a.customName = Language.getString(30057);
                      break;
                    }

                    default: {
                      break;
                    }
                  }
                });
              });

              FLY_TYPE.getTitles = function() {
                return [
                  {
                    id: this.Down,
                    title: Language.json['lang.code.30068']
                  },
                  {
                    id: this.DownLeft,
                    title: Language.json['lang.code.30069']
                  },
                  {
                    id: this.DownRight,
                    title: Language.json['lang.code.30070']
                  },
                  {
                    id: this.Up,
                    title: Language.json['lang.code.30071']
                  },
                  {
                    id: this.UpLeft,
                    title: Language.json['lang.code.30072']
                  },
                  {
                    id: this.UpRight,
                    title: Language.json['lang.code.30073']
                  },
                  {
                    id: this.Left,
                    title: Language.json['lang.code.30074']
                  },
                  {
                    id: this.Right,
                    title: Language.json['lang.code.30075']
                  }
                ];
              };

              ANIMATION_EFFECT.getTitles = function() {
                return [
                  {
                    id: this.Linear,
                    title: Language.json['lang.code.30077']
                  },
                  {
                    id: this.EaseInBack,
                    title: Language.json['lang.code.30078']
                  },
                  {
                    id: this.EaseOutBack,
                    title: Language.json['lang.code.30079']
                  },
                  {
                    id: this.EaseInOutBack,
                    title: Language.json['lang.code.30080']
                  },
                  {
                    id: this.EaseInBounce,
                    title: Language.json['lang.code.30081']
                  },
                  {
                    id: this.EaseOutBounce,
                    title: Language.json['lang.code.30082']
                  },
                  {
                    id: this.EaseInOutBounce,
                    title: Language.json['lang.code.30083']
                  }
                ];
              };

              dispatch(parseOrm(book, bookId));
              return Promise.resolve();
            })
            .catch(error => {
              if (error.status == 400) {
                MSLog({
                  errorType: 'error',
                  code: END_REASON.LANGUAGE_DOWNLOAD_FAILED,
                  error: new Error('request language set error'),
                  extraInfo: { token }
                });
              } else if (error.status == 404) {
                MSLog({
                  errorType: 'error',
                  code: END_REASON.LANGUAGE_DOWNLOAD_FAILED,
                  error: new Error('request language set error'),
                  extraInfo: { token }
                });
              }
            });
        }
      })
      .catch(error => {
        if (error.status == 400) {
          return MSLog({
            errorType: 'fatal',
            code: END_REASON.INVALID_TOKEN,
            error: new Error('request book error'),
            extraInfo: { token }
          });
        } else if (error.status == 404) {
          return MSLog({
            errorType: 'fatal',
            code: END_REASON.BOOK_NOT_FOUND,
            error: new Error('request book error'),
            extraInfo: { ck: classKey }
          });
        }
      });
  };
};

export const saveBook = (thumbnails, tag) => {
  return (dispatch, getState, orm) => {
    const state = getState();
    const session = orm.session(state.orm);
    const { Book, Asset } = session;

    const ormObject = Book.withId(0).toJSON();
    console.log('>> ', ormObject);
    const token = state.auth.token;
    //dispatch(_saveBook());
    dispatch(startRequest({}));

    const info: BookInfo = Book.info(); //getBookInfo(state);
    const totalFileSize = Asset.totalFileSize();

    return new Promise((resolve, reject) => {
      const paramObj = {
        book_id: info.bookId,
        title: info.title,
        book_desc: info.description,
        book_type: info.type,
        category_type: info.category,
        cover_image_url: '',
        platform_version: __RELEASE,
        editor_version: getPkgVersion(),
        file_size: totalFileSize,
        raw_data: JSON.stringify(ormObject),
        token: token,
        thumbnails: JSON.stringify(thumbnails),
        tag: tag
      };

      FetchPost(API_HOST + API_PATH + '/book/modifyBook', {
        body: JSON.stringify(paramObj)
      })
        .then(() => {
          dispatch(doneRequest({}));
          resolve();
        })
        .catch(() => {
          dispatch(doneRequest({}));

          MSLog({ code: END_REASON.BOOK_SAVE_FAILED });
        });
    });
  };
};

export const saveBookBindFunc = (thumbnails, callback) => {
  return (dispatch, getState, orm) => {
    const state = getState();
    const session = orm.session(state.orm);
    const { Book, Asset } = session;

    const ormObject = Book.withId(0).toJSON();
    const token = state.auth.token;

    dispatch(startRequest({}));

    const info: BookInfo = Book.info(); //getBookInfo(state);
    const totalFileSize = Asset.totalFileSize();
    const paramObj = {
      book_id: info.bookId,
      title: info.title,
      book_desc: info.description,
      book_type: info.type,
      category_type: info.category,
      cover_image_url: '',
      platform_version: __RELEASE,
      editor_version: getPkgVersion(),
      file_size: totalFileSize,
      raw_data: JSON.stringify(ormObject),
      token: token,
      thumbnails: JSON.stringify(thumbnails),
      tag: ''
    };

    FetchPost(API_HOST + API_PATH + '/book/modifyBook', {
      body: JSON.stringify(paramObj)
    })
      .then(() => {
        dispatch(doneRequest({}));
        callback();
      })
      .catch(() => {
        dispatch(doneRequest({}));

        MSLog({ code: END_REASON.BOOK_SAVE_FAILED });
      });
  };
};

const parseOrm = (book: any, bookId: any) => {
  return (dispatch, getState) => {
    let endMovieUrl = null;

    if (!isUndefined(book.end_movie_url)) endMovieUrl = book.end_movie_url;

    /////////////////////////////
    // book.target_device = 'mobile';
    // book.resolution = {width: 640, height: 360};
    ////////////////////////////
    let targetDevice = 'pc';
    if (!isUndefined(book.target_device)) targetDevice = book.target_device;

    let resolution = { width: 1920, height: 1080 };
    if (!isUndefined(book.resolution)) {
      resolution.width = parseInt(book.resolution.width);
      resolution.height = parseInt(book.resolution.height);
    }

    const info: BookInfo = {
      bookId: bookId,
      title: book.title,
      description: book.book_desc,
      type: book.book_type,
      category: book.category_type,
      coverImageUrl: book.cover_image_url,
      endMovieUrl: endMovieUrl,
      targetDevice: targetDevice
    };

    const screenOrientation = book.screen_orientation;

    const canvasProperty: CanvasProperty = {
      backgroundColor: 'rgb(255,255,255)',
      width: resolution.width,
      height: resolution.height,
      selectionColor: 'blue',
      selectionLineWidth: 2,
      screenOrientation: book.screen_orientation,

      baseRatio: {
        width: screenOrientation === 'landscape' ? 1920 : 1080,
        height: screenOrientation === 'landscape' ? 1080 : 1920
      },
      marginLength: 1360,
      initialSize: {
        width: screenOrientation === 'landscape' ? 889 : 315,
        height: screenOrientation === 'landscape' ? 500 : 560
      }
    };

    const ormData = JSON.parse(book.raw_data);
    console.log('>> LOAD ', ormData);

    Loader.init(ormData.assetCount);
    Loader.progressHandler = (progress, totalCount) => {
      if (progress >= totalCount) {
        dispatch(showLoadingScreen(false));
        Loader.progressHandler = null;
      }
    };

    if (isEmpty(ormData)) {
      dispatch(_create({ info, canvasProperty }));
      dispatch(showLoadingScreen(false));
    } else {
      ormData.info = info;
      ormData.canvasProperty = canvasProperty;
      dispatch(_load(ormData));
    }

    if (ormData.assetCount === 0) {
      dispatch(showLoadingScreen(false));
    }
  };
};

export const actions = {
  loadBook,
  request,
  saveBook
};

/***************
 * Reducer
 */

const ValidatingModel = propTypesMixin(Model);

class Book extends ValidatingModel {
  props: {
    id: number,
    canvasProperty: CanvasProperty,
    info: BookInfo,
    lastUpdate: number,
    selectedPageGroupId: number,
    selectedPageId: number,
    selectedEventGroupId: number,
    pageGroups: Array<PageGroupModel>
  };

  toJSON() {
    const { Page, Component, Asset } = this.getClass().session;
    return {
      ...this.ref,
      pageCount: Page.count(),
      componentCount: Component.count(),
      assetCount: Asset.count(),
      pageGroups: this.pageGroups.toModelArray().map(item => item.toJSON())
    };
  }

  get sortedPageGroups() {
    return this.pageGroups.orderBy('zIndex');
  }

  static parse(data) {
    const { PageGroup } = this.session;
    const clonedData = { ...data };

    clonedData.pageGroups = clonedData.pageGroups.map(pageGroup =>
      PageGroup.parse(pageGroup)
    );
    return this.upsert(clonedData);
  }

  static reducer(action, Book, session) {
    const { payload, type } = action;

    switch (type) {
      case LOAD: {
        this.parse(payload);
        const book = this.getSelected();
        const firstPageGroup = book.sortedPageGroups.first();
        const firstPage = firstPageGroup.sortedPages.first();
        this.selectPageGroup(firstPageGroup.id);
        this.selectPage(firstPage.id);

        break;
      }
      case CREATE: {
        const { PageGroup, Page } = this.session;
        const page = Page.create({});
        const pageGroup = PageGroup.create({});
        pageGroup.pages.add(page);

        const book = this.create({
          info: payload.info,
          canvasProperty: payload.canvasProperty,
          selectedPageGroupId: pageGroup.id,
          selectedPageId: page.id
        });
        book.pageGroups.add(pageGroup);
        break;
      }
      case UPDATE: {
        const book = this.getSelected();
        book.update({
          info: payload.info,
          canvasProperty: payload.canvasProperty
        });
        break;
      }
    }
  }

  static getSelected() {
    if (!this.idExists(0)) return null;

    return this.withId(0);
  }

  static getSelectedPageGroupId() {
    if (!this.idExists(0)) return null;

    return this.withId(0).selectedPageGroupId;
  }

  static selectPageGroup(id) {
    if (!this.idExists(0)) return;

    const book = this.withId(0);
    book.set('selectedPageGroupId', id);
  }

  static getSelectedPageId() {
    if (!this.idExists(0)) return null;

    return this.withId(0).selectedPageId;
  }

  static selectPage(id) {
    if (!this.idExists(0)) return;

    const book = this.withId(0);
    book.set('selectedPageId', id);
  }

  static getSelectedEventGroupId() {
    if (!this.idExists(0)) return null;

    return this.withId(0).selectedEventGroupId;
  }

  static selectEventGroup(id) {
    if (!this.idExists(0)) return;

    const book = this.withId(0);
    book.set('selectedEventGroupId', id);
  }

  static info() {
    return this.getSelected().info;
  }
}

Book.modelName = 'Book';

Book.fields = {
  id: attr(),
  canvasProperty: attr(),
  info: attr(),
  lastUpdate: attr(),
  selectedPageGroupId: attr(),
  selectedPageId: attr(),
  selectedEventGroupId: attr(),
  pageGroups: many('PageGroup')
};

Book.defaultProps = {
  selectedPageGroupId: 0,
  selectedPageId: 0,
  selectedEventGroupId: null,
  pageGroups: []
};

export default Book;
