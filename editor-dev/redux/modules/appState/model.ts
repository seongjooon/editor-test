import * as Type from './actionTypes';
import { FADE_TYPE } from '../../../constants/msConstant';

import { Model, many, fk, attr } from 'redux-orm';
import _ from 'lodash';

const tempState = {
  electedComponentId: null,
  selectedEventGroupId: null,
  isFetching: false,
  selectedScript: 64,
  settingPageId: null,
  settingSceneId: null,
  showLoadingScreen: false,
  loadProgress: 0,
  updatedCanvasAsset: null,
  zIndexChanged: false,
  loadedAssets: null,
  selectedAssets: null,
  addedComponentId: null,
  deletedComponentId: null,
  isComponentSorted: false,
  isComponentUpdated: false,
  isActivatedCharacter: false,
  isCanvasSelected: false,
  bookStaticConfig: null,
  deletableComponentIndex: -1,
  canvasRatio: 1,
  lastAnswer: null,
};

class AppState extends Model {
  //component 선택
  static selectComponent(id: number) {
    if (!this.idExists(0)) return;

    const appState = this.withId(0);
    appState.set('selectedComponentId', id);
  }

  //lastAnswer 설정
  static lastAnswer(id: number) {
    if (!this.idExists(0)) return;

    const appState = this.withId(0);
    appState.set('lastAnswer', id);
  }
  //selectedComponentId 획득
  static getSelectedComponentId() {
    if (!this.idExists(0)) return null;
    return this.withId(0).selectedComponentId;
  }
  //lastAnswer 획득
  static getLastAnswer() {
    if (!this.idExists(0)) return null;
    return this.withId(0).lastAnswer;
  }

  //현재 selectedEventGroupId 갱신
  static selectEventGroup(id: number) {
    if (!this.idExists(0)) return;

    const appState = this.withId(0);
    appState.set('selectedEventGroupId', id);
  }

  // //현재 selectedEventGroupId 획득
  // static getSelectedEventGroupId() {
  //   if (!this.idExists(0)) return null;

  //   return this.withId(0).selectedEventGroupId;
  // }

  //현재 selectedScript 갱신
  static selectScript(id?: number) {
    if (!this.idExists(0)) return;

    const appState = this.withId(0);
    appState.set('selectedScript', id);
  }

  //현재 selectedScript 획득
  static getSelectedScriptId() {
    if (!this.idExists(0)) return null;

    return this.withId(0).selectedScript;
  }

  static reducer(action, AppState, session) {
    const { payload, type } = action;

    switch (type) {
      case Type.APPSTATE_INIT: {
        this.create(tempState);
        break;
      }
      case Type.APPSTATE_UPDATE: {
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
  selectedComponentId: attr(), // selected component
  lastAnswer: attr(),
  addedComponentId: attr(),
  deletedComponentId: attr(),
  isComponentSorted: attr(),
  isComponentUpdated: attr(),
  isFetching: attr(),
  selectedScript: attr(), // selected script
  settingPageId: attr(),
  settingSceneId: attr(),
  showLoadingScreen: attr(),
  loadProgress: attr(),
  updatedCanvasAsset: attr(),
  zIndexChanged: attr(),
  loadedAssets: attr(),
  selectedAssets: attr(), // selected assets
  isActivatedCharacter: attr(),
  isCanvasSelected: attr(),
  bookStaticConfig: attr(),
  deletableComponentIndex: attr(),
  canvasRatio: attr(),
};

//@ts-ignore
AppState.defaultProps = {
  selectedComponentId: null,
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
  lastAnswer: null,
};

export default AppState;
