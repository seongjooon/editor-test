/**
 * Created by neo on 2016. 11. 15..
 */
/*********
 * LIB
 */
// redux
import { Model, attr } from 'redux-orm';
import { createAction } from 'redux-actions';
import propTypesMixin from 'redux-orm-proptypes';

/*******

/********
 * Type
 */
type UploadFileSizeObjModel = {
  image_max_size: number,
  sound_max_size: number,
  video_max_size: number
};

export type AppStateModel = {
  id?: number,
  selectedComponentId: ?number,
  selectedEventGroupId: ?number,
  isFetching: boolean,
  selectedScript: number,
  showLoadingScreen: boolean,
  loadProgress: number,
  loadedAssets: Array<any>,
  selectedAssets: Array<any>,
  isActivatedCharacter: boolean,
  // 컴포넌트 상체 체크
  addedComponentId: ?number,
  deletedComponentId: ?number,
  isComponentSorted: boolean,
  isComponentUpdated: boolean,
  isCanvasSelected: boolean,
  // config
  bookStaticConfig: UploadFileSizeObjModel,
  deletableComponentIndex: number,
  canvasRatio: number,
  lastAnswer: number
};

/*****************
 * Constant
 */
const INIT = 'minischool/appState/INIT';
const UPDATE = 'minischool/appState/UPDATE';

/***********************
 *  Action
 */
const _init = createAction(INIT);
const _update = createAction(
  UPDATE,
  (payload: { fieldName: string, value: any }) => payload
);

const initAppState = () => {
  return dispatch => {
    dispatch(_init());
  };
};

export const selectComponent = (componentId: number) => {
  return dispatch => {
    dispatch(_update({ fieldName: 'selectedComponentId', value: componentId }));
  };
};

export const lastAnswer = (id: number) => {
  return dispatch => {
    console.log('AAAAAAAAAAAA ', id);
    dispatch(_update({ fieldName: 'lastAnswer', value: id }));
  };
};

export const selectEventGroup = (id: number) => {
  return dispatch => {
    dispatch(_update({ fieldName: 'selectedEventGroupId', value: id }));
  };
};

export const showLoadingScreen = show => {
  return dispatch => {
    dispatch(_update({ fieldName: 'showLoadingScreen', value: show }));
  };
};

export const selectScript = (selectedScript: number) => {
  return dispatch => {
    dispatch(_update({ fieldName: 'selectedScript', value: selectedScript }));
  };
};

export const startRequest = () => {
  return dispatch => {
    dispatch(_update({ fieldName: 'isFetching', value: true }));
  };
};

export const doneRequest = () => {
  return dispatch => {
    dispatch(_update({ fieldName: 'isFetching', value: false }));
  };
};

export const updateLoadProgress = (props: number) => {
  return dispatch => {
    dispatch(_update({ fieldName: 'loadProgress', value: props }));
  };
};

export const loadAssets = (loadedAssets: Array<any>) => {
  return dispatch => {
    dispatch(_update({ fieldName: 'loadedAssets', value: loadedAssets }));
  };
};

export const selectAssets = (selectedAssets: Array<number>) => {
  return dispatch => {
    dispatch(_update({ fieldName: 'selectedAssets', value: selectedAssets }));
  };
};

export const checkZIndexChanged = (props: boolean) => {
  return dispatch => {
    // dispatch(_checkZIndexChanged(props));
  };
};

export const getLoadedAssets = state => {
  // return state.appState.loadedAssets;
  return [];
};

const activeCharacter = (active: boolean) => {
  return dispatch => {
    dispatch(_update({ fieldName: 'isActivatedCharacter', value: active }));
  };
};

export const selectCanvas = (isCanvasSelected: boolean) => {
  return dispatch => {
    dispatch(
      _update({ fieldName: 'isCanvasSelected', value: isCanvasSelected })
    );
  };
};

const setBookStaticConfig = (uploadFileSizeObj: UploadFileSizeObjModel) => {
  return (dispatch: any) => {
    dispatch(
      _update({ fieldName: 'bookStaticConfig', value: uploadFileSizeObj })
    );
  };
};

export const setDeletableComponentIndex = (deletableComponentIndex: number) => {
  return dispatch => {
    dispatch(
      _update({
        fieldName: 'deletableComponentIndex',
        value: deletableComponentIndex
      })
    );
  };
};

export const setCanvasRatio = (ratio: number) => {
  return dispatch => {
    dispatch(_update({ fieldName: 'canvasRatio', value: ratio }));
  };
};

export const actions = {
  selectComponent,
  selectEventGroup,
  showLoadingScreen,
  selectScript,
  startRequest,
  doneRequest,
  updateLoadProgress,
  loadAssets,
  selectAssets,
  activeCharacter,
  selectCanvas,
  setBookStaticConfig,
  setDeletableComponentIndex,
  setCanvasRatio
};

/***************
 * Reducer
 */

const ValidatingModel = propTypesMixin(Model);

class AppState extends ValidatingModel {
  props: AppStateModel;

  static selectComponent(id: number) {
    if (!this.idExists(0)) return;

    const appState = this.withId(0);
    appState.set('selectedComponentId', id);
  }

  static getSelectedComponentId() {
    if (!this.idExists(0)) return null;

    return this.withId(0).selectedComponentId;
  }

  static lastAnswer(id: number) {
    if (!this.idExists(0)) return;

    const appState = this.withId(0);
    appState.set('lastAnswer', id);
  }

  static getLastAnswer() {
    console.log('BBBBBB ', this.withId(0));
    if (!this.idExists(0)) return null;
    console.log('CCCCC ', this.withId(0).lastAnswer);
    return this.withId(0).lastAnswer;
  }

  static selectEventGroup(id: number) {
    if (!this.idExists(0)) return;

    const appState = this.withId(0);
    appState.set('selectedEventGroupId', id);
  }

  static getSelectedEventGroupId() {
    if (!this.idExists(0)) return null;

    return this.withId(0).selectedEventGroupId;
  }

  static selectScript(id: ?number) {
    if (!this.idExists(0)) return;

    const appState = this.withId(0);
    appState.set('selectedScript', id);
  }

  static getSelectedScriptId() {
    if (!this.idExists(0)) return null;

    return this.withId(0).selectedScript;
  }

  static reducer(action, AppState, session) {
    const { payload, type } = action;

    switch (type) {
      case INIT: {
        // this.create({
        //     selectedComponentId: null,
        //     selectedEventGroupId: null,
        //     isFetching: false,
        //     selectedScript: -1,
        //     settingPageId: null,
        //     settingSceneId: null,
        //     showLoadingScreen: true,
        //     loadProgress: 0,
        //     updatedCanvasAsset: null,
        //     zIndexChanged: false,
        //     loadedAssets: [],
        //     selectedAssets: [],
        // });
        break;
      }
      case UPDATE: {
        const { fieldName, value } = payload;
        const appState = this.withId(0);
        appState.set(fieldName, value);
        break;
      }
    }
  }
}

AppState.modelName = 'AppState';

AppState.fields = {
  id: attr(),
  selectedComponentId: attr(),
  lastAnswer: attr(),
  addedComponentId: attr(),
  deletedComponentId: attr(),
  isComponentSorted: attr(),
  isComponentUpdated: attr(),
  selectedEventGroupId: attr(),
  isFetching: attr(),
  selectedScript: attr(),
  settingPageId: attr(),
  settingSceneId: attr(),
  showLoadingScreen: attr(),
  loadProgress: attr(),
  updatedCanvasAsset: attr(),
  zIndexChanged: attr(),
  loadedAssets: attr(),
  selectedAssets: attr(),
  isActivatedCharacter: attr(),
  isCanvasSelected: attr(),
  bookStaticConfig: attr(),
  deletableComponentIndex: attr(),
  canvasRatio: attr()
};

AppState.defaultProps = {
  selectedComponentId: null,
  selectedEventGroupId: null,
  isFetching: false,
  selectedScript: null,
  settingPageId: null,
  settingSceneId: null,
  showLoadingScreen: true,
  loadProgress: 0,
  updatedCanvasAsset: null,
  zIndexChanged: false,
  loadedAssets: [],
  selectedAssets: [],
  addedComponentId: null,
  deletedComponentId: null,
  isComponentSorted: false,
  isComponentUpdated: false,
  isActivatedCharacter: false,
  isCanvasSelected: false,
  bookStaticConfig: {
    /*
    리소스 사이즈 제한 정책 적용하려고 하드코딩했던 부분 다시 주석처리.
    image_max_size: 1,
    sound_max_size: 2,
    video_max_size: 10
    */
  },
  deletableComponentIndex: -1,
  canvasRatio: 1,
  lastAnswer: null
};

export default AppState;
