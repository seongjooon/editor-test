// @flow

/*********
 * LIB
 */
// redux
import {
  Model,
  createSelector as ormCreateSelector,
  many,
  fk,
  attr
} from 'redux-orm';
import { createSelector } from 'reselect';
import { createAction } from 'redux-actions';
// util
import { isNil, random, find } from 'lodash';
import propTypesMixin from 'redux-orm-proptypes';

/*******
 * LOCAL
 */
import {
  MOVEMENT,
  BEHAVIOR_TYPE,
  ANIMATION_RUN_TYPE,
  DIRECTION
} from 'constants/msConstant';
import type { AssetModel } from '../asset';
import type { C2DataModel } from '../c2Data';
// redux
/*********
 * Type
 */

export type ImageRef = {
  id: number,
  width: number,
  height: number,
  asset: number | AssetModel,
  c2Data: ?number | ?C2DataModel,
  imageList: Array<number | AssetModel>
};

export type ImageModel = ImageComponent;

/*****************
 * Constant
 */
const DEFAULT_BEHAVIORS = [
  {
    type: BEHAVIOR_TYPE.Sine,
    name: 'Sine',
    activeOnStart: false, // NO: 0, YES: 1
    movement: MOVEMENT.Horizontal, // 0=Horizontal|1=Vertical|2=Size|3=Width|4=Height|5=Angle|6=Opacity|7=Value only
    period: 1,
    magnitude: 100,
    wave: 0, // 0=Sine|1=Triangle|2=Sawtooth|3=Reverse sawtooth|4=Square
    periodRandom: 0,
    periodOffset: 0,
    periodOffsetRandom: 0,
    magnitudeRandom: 0
  },
  {
    type: BEHAVIOR_TYPE.Rotate,
    name: 'Rotate',
    activeOnStart: false, //
    direction: DIRECTION.Right,
    speed: 1,
    acceleration: 0
  },
  {
    type: BEHAVIOR_TYPE.Animation,
    name: 'Animation',
    activeOnStart: false, // NO: 0, YES: 1
    duration: 1, // se
    loop: false,
    run: ANIMATION_RUN_TYPE.Auto
  },
  {
    type: BEHAVIOR_TYPE.Magnetic,
    name: 'Magnetic',
    activeOnStart: false, // NO: 0, YES: 1
    duration: 1, // se
    targetX: 100,
    targetY: 100,
    range: 100, // px
    eventId: null,
    escape: false,
    return: true
  }
];

export const CREATE = 'minischool/imageComponent/CREATE';
export const CLONE = 'minischool/imageComponent/CLONE';
const ADD_IMAGE = 'minischool/imageComponent/ADD_IMAGE';
const DELETE_IMAGE = 'minischool/imageComponent/DELETE_IMAGE';

/***********************
 *  Action
 */
const _create = createAction(CREATE, (payload: ImageComponent) => payload);
const _clone = createAction(CLONE, (payload: { id: number }) => payload);
const _addImage = createAction(
  ADD_IMAGE,
  (payload: { assetList: any }) => payload
);
const _deleteImage = createAction(
  DELETE_IMAGE,
  (payload: { id: number }) => payload
);

export const cloneImageComponent = (id: number) => {
  return (dispatch: any) => {
    dispatch(_clone({ id }));
  };
};

export const updateMouseClick = () => {
  return (dispatch: any) => {
    //
  };
};

export const updateMouseOver = () => {
  return (dispatch: any) => {
    //
  };
};

export const addImage = (assetList: any) => {
  return (dispatch: any) => {
    dispatch(_addImage({ assetList }));
  };
};

export const deleteImage = (id: number) => {
  return (dispatch: any) => {
    dispatch(_deleteImage({ id }));
  };
};

/***************
 * Reducer
 */

const ValidatingModel = propTypesMixin(Model);

export class ImageComponent extends ValidatingModel {
  props: ImageRef;

  static create(props: any) {
    const { behaviors } = props;

    if (behaviors) {
      // 하위 호환성
      if (!find(behaviors, ['type', BEHAVIOR_TYPE.Magnetic])) {
        props.behaviors = [...behaviors, DEFAULT_BEHAVIORS[3]];
      }

      if (!behaviors[3].return) {
        behaviors[3].return = true;
      }
      if (!behaviors[3].escape) {
        behaviors[3].escape = false;
      }
    }

    // create
    return super.create(props);
  }

  toJSON() {
    return {
      ...this.ref,
      asset: this.asset.toJSON(),
      c2Data: isNil(this.c2Data) ? null : this.c2Data.toJSON(),
      imageList: this.imageList.toModelArray().map(item => item.toJSON())
    };
  }

  clone() {
    const clonedData = { ...this.ref };
    delete clonedData.id;

    clonedData.asset = this.asset.clone();
    clonedData.c2Data = isNil(this.c2Data) ? null : this.c2Data.clone();
    clonedData.imageList = this.imageList
      .toModelArray()
      .map(item => item.clone());

    const { ImageComponent } = this.getClass().session;
    return ImageComponent.create(clonedData);
  }

  delete() {
    if (this.asset !== null) this.asset.delete();

    if (this.c2Data !== null) this.c2Data.delete();

    this.imageList.toModelArray().forEach(item => {
      item.delete();
    });

    super.delete();
  }

  static parse(data) {
    const { Asset, C2Data } = this.session;
    const clonedData = { ...data };

    //clonedData.behaviors = DEFAULT_BEHAVIORS;

    if (!isNil(clonedData.asset))
      clonedData.asset = Asset.parse(clonedData.asset);

    if (!isNil(clonedData.c2Data))
      clonedData.c2Data = C2Data.parse(clonedData.c2Data);

    if (!isNil(clonedData.imageList))
      clonedData.imageList = clonedData.imageList.map(item =>
        Asset.parse(item)
      );

    return this.upsert(clonedData);
  }

  static import(data) {
    const { Asset, C2Data } = this.session;
    const clonedData = { ...data };

    delete clonedData.id;
    // delete clonedData.zIndex;
    console.log('NEO TTT ', clonedData)

    if (!isNil(clonedData.asset))
      clonedData.asset = Asset.import(clonedData.asset);

    if (!isNil(clonedData.c2Data))
      clonedData.c2Data = C2Data.import(clonedData.c2Data);

    if (!isNil(clonedData.imageList))
      clonedData.imageList = clonedData.imageList.map(item =>
        Asset.import(item)
      );

    return this.upsert(clonedData);
  }

  static reducer(action, ImageComponent, session) {
    const { payload, type } = action;
    const { Component, Asset } = session;

    switch (type) {
      case CLONE: {
        const { id } = payload;
        this.withId(id).clone();
        break;
      }

      case ADD_IMAGE: {
        const { assetList } = payload;
        const component = Component.getSelected();
        const { imageComponent } = component;

        assetList.forEach(asset => {
          const newAsset = Asset.create(asset);
          imageComponent.imageList.add(newAsset);
        });
        break;
      }

      case DELETE_IMAGE: {
        const { id } = payload;
        Asset.withId(id).delete();
        break;
      }
    }
  }
}

ImageComponent.modelName = 'ImageComponent';

ImageComponent.fields = {
  id: attr(),
  width: attr(),
  height: attr(),
  asset: fk('Asset', 'imageComponents'),
  c2Data: fk('C2Data'),
  imageList: many('Asset', 'imageList_ImageComponents'),
  behaviors: attr()
};

ImageComponent.defaultProps = {
  c2Data: null,
  imageList: [],
  behaviors: DEFAULT_BEHAVIORS
};

export default ImageComponent;
