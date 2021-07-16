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

const ormSelector = state => state.orm;

export const getSelectedComponentId = createSelector(
  ormSelector,
  ormCreateSelector(orm, session => {
    const { AppState } = session;
    return AppState.getSelectedComponentId();
  })
);

export const getLastAnswer = createSelector(
  ormSelector,
  ormCreateSelector(orm, session => {
    const { AppState } = session;
    // return AppState.getLastAnswer();
    return AppState.withId(0).lastAnswer;
  })
);

export const getSelectedEventGroupId = createSelector(
  ormSelector,
  ormCreateSelector(orm, session => {
    const { AppState } = session;
    return AppState.getSelectedEventGroupId();
  })
);

export const getSelectedScriptId = createSelector(
  ormSelector,
  ormCreateSelector(orm, session => {
    const { AppState } = session;
    return AppState.getSelectedScriptId();
  })
);

export const getCanvasUpdatedAsset = createSelector(
  ormSelector,
  ormCreateSelector(orm, session => {
    const { AppState } = session;
    return AppState.withId(0).updatedCanvasAsset;
  })
);

export const getShowLoadingScreen = createSelector(
  ormSelector,
  ormCreateSelector(orm, session => {
    const { AppState } = session;
    return AppState.withId(0).showLoadingScreen;
  })
);

export const getLoadingProgress = createSelector(
  ormSelector,
  ormCreateSelector(orm, session => {
    const { AppState } = session;
    const appState = AppState.withId(0);
    return appState.loadProgress;
  })
);

export const getLoadedAssets = createSelector(
  ormSelector,
  ormCreateSelector(orm, session => {
    const { AppState } = session;
    return AppState.withId(0).loadedAssets;
  })
);

export const getSelectedAssetIds = createSelector(
  ormSelector,
  ormCreateSelector(orm, session => {
    const { AppState } = session;
    return AppState.withId(0).selectedAssets;
  })
);

export const getCanvasSelectionState = createSelector(
  ormSelector,
  ormCreateSelector(orm, session => {
    const { AppState } = session;
    return AppState.withId(0).isCanvasSelected;
  })
);

const getAddedComponentId: () => number = createSelector(
  ormSelector,
  ormCreateSelector(orm, session => {
    const { AppState } = session;
    return AppState.withId(0).addedComponentId;
  })
);

const getDeletedComponentId: () => number = createSelector(
  ormSelector,
  ormCreateSelector(orm, session => {
    const { AppState } = session;
    return AppState.withId(0).deletedComponentId;
  })
);

const getIsComponentSorted: () => number = createSelector(
  ormSelector,
  ormCreateSelector(orm, session => {
    const { AppState } = session;
    return AppState.withId(0).isComponentSorted;
  })
);

const getIsComponentUpdated: () => number = createSelector(
  ormSelector,
  ormCreateSelector(orm, session => {
    const { AppState } = session;
    return AppState.withId(0).isComponentUpdated;
  })
);

const getIsActivatedCharacter: () => number = createSelector(
  ormSelector,
  ormCreateSelector(orm, session => {
    const { AppState } = session;
    return AppState.withId(0).isActivatedCharacter;
  })
);

export const getBookStaticConfig = createSelector(
  ormSelector,
  ormCreateSelector(orm, session => {
    const { AppState } = session;
    return AppState.withId(0).bookStaticConfig;
  })
);

export const getDeletableComponentIndex = createSelector(
  ormSelector,
  ormCreateSelector(orm, session => {
    const { AppState } = session;
    return AppState.withId(0).deletableComponentIndex;
  })
);

export const getCanvasRatio = createSelector(
  ormSelector,
  ormCreateSelector(orm, session => {
    const { AppState } = session;
    return AppState.withId(0).canvasRatio;
  })
);

export const selectors = {
  getSelectedComponentId,
  getLastAnswer,
  getSelectedEventGroupId,
  getSelectedScriptId,
  getCanvasUpdatedAsset,
  getShowLoadingScreen,
  getLoadingProgress,
  getLoadedAssets,
  getSelectedAssetIds,
  getAddedComponentId,
  getDeletedComponentId,
  getIsComponentSorted,
  getIsComponentUpdated,
  getIsActivatedCharacter,
  getCanvasSelectionState,
  getBookStaticConfig,
  getDeletableComponentIndex
};
