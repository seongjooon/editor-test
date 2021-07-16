/**
 * Created by neo on 2016. 11. 15..
 */

// @flow

/*********
 * LIB
 */
// redux
import {
  Model,
  fk,
  attr,
  createSelector as ormCreateSelector
} from 'redux-orm';
import propTypesMixin from 'redux-orm-proptypes';
import { createSelector } from 'reselect';
import { createAction } from 'redux-actions';
// util
import random from 'lodash/random';

/*******
 * LOCAL
 */
// import type {ComponentKey, VPropertyModel, AssetModel} from '../../../index';
// import {getSelectedSceneId} from '../globalSelectors';
import type { AssetModel } from '../asset';
import { isNil } from 'lodash';

/******
 * Type
 */
export type VideoRef = {
  id: number,
  width: number,
  height: number,
  loop: boolean,
  asset: number | AssetModel
};

export type VideoModel = VideoComponent;

/*****************
 * Constant
 */
// const VIDEO_COMPONENT_CLEAR = 'VIDEO_COMPONENT_CLEAR';
// const VIDEO_COMPONENT_RECEIVE = 'VIDEO_COMPONENT_RECEIVE';
// const VIDEO_COMPONENT_UPDATE_TITLE = 'VIDEO_COMPONENT_UPDATE_TITLE';
// const VIDEO_COMPONENT_UPDATE_LOOP = 'VIDEO_COMPONENT_UPDATE_LOOP';

/***********************
 *  Action
 */

// const _clear = createAction(VIDEO_COMPONENT_CLEAR, (payload) => payload);
// const _receive = createAction(VIDEO_COMPONENT_RECEIVE, (payload) => payload);
// const _updateTitle = createAction(VIDEO_COMPONENT_UPDATE_TITLE, (payload: ComponentKey) => payload);
// const _updateLoop = createAction(VIDEO_COMPONENT_UPDATE_LOOP, (payload: {id: number, loop: boolean}) => payload);

/***************
 * Reducer
 */

const ValidatingModel = propTypesMixin(Model);

export class VideoComponent extends ValidatingModel {
  props: VideoRef;

  toJSON() {
    return {
      ...this.ref,
      asset: this.asset.toJSON()
    };
  }

  delete() {
    if (this.asset !== null) this.asset.delete();

    super.delete();
  }

  clone() {
    const clonedData = { ...this.ref };
    delete clonedData.id;
    clonedData.asset = this.asset.clone();

    const { VideoComponent } = this.getClass().session;
    return VideoComponent.create(clonedData);
  }

  static parse(data) {
    const { Asset } = this.session;
    const clonedData = { ...data };

    if (!isNil(clonedData.asset))
      clonedData.asset = Asset.parse(clonedData.asset);

    return this.upsert(clonedData);
  }

  static import(data) {
    const { Asset } = this.session;
    const clonedData = { ...data };

    delete clonedData.id;
    // delete clonedData.zIndex;

    if (!isNil(clonedData.asset))
      clonedData.asset = Asset.import(clonedData.asset);

    return this.upsert(clonedData);
  }

  static reducer(action, VideoComponent, session) {
    const { payload, type } = action;

    switch (type) {
    }
  }
}

VideoComponent.modelName = 'VideoComponent';

VideoComponent.fields = {
  id: attr(),
  width: attr(),
  height: attr(),
  loop: attr(),
  asset: fk('Asset', 'videoComponents')
};

VideoComponent.defaultProps = {
  loop: false
};

export default VideoComponent;
