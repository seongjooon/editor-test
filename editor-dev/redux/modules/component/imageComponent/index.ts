import { Model, createSelector as ormCreateSelector, many, fk, attr } from 'redux-orm';
import { createAction } from 'redux-actions';
import { MOVEMENT, BEHAVIOR_TYPE, ANIMATION_RUN_TYPE, DIRECTION } from '../../../../constants/msConstant';
import _ from 'lodash';

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
    magnitudeRandom: 0,
  },
  {
    type: BEHAVIOR_TYPE.Rotate,
    name: 'Rotate',
    activeOnStart: false, //
    direction: DIRECTION.Right,
    speed: 1,
    acceleration: 0,
  },
  {
    type: BEHAVIOR_TYPE.Animation,
    name: 'Animation',
    activeOnStart: false, // NO: 0, YES: 1
    duration: 1, // se
    loop: false,
    run: ANIMATION_RUN_TYPE.Auto,
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
    return: true,
  },
];

const IMGCOMP_CREATE = 'minischool/imageComponent/IMGCOMP_CREATE';
const IMGCOMP_CLONE = 'minischool/imageComponent/IMGCOMP_CLONE';
const IMGCOMP_ADD_IMAGE = 'minischool/imageComponent/IMGCOMP_ADD_IMAGE';
const IMGCOMP_DELETE_IMAGE = 'minischool/imageComponent/IMGCOMP_DELETE_IMAGE';

export const imgCompCreate = createAction(IMGCOMP_CREATE, (payload) => payload);
export const imgCompClone = createAction(IMGCOMP_CLONE, (payload) => payload);
export const imgCompAddImage = createAction(IMGCOMP_ADD_IMAGE, (payload) => payload);
export const imgCompDeleteImage = createAction(IMGCOMP_DELETE_IMAGE, (payload) => payload);

class ImageComponent extends Model {
  static parse(data) {
    //@ts-ignore
    const { Asset, C2Data } = this.session;
    const clonedData = { ...data };

    // console.log('@@@', this.session.Asset)
    if (clonedData.asset) clonedData.asset = Asset.parse(clonedData.asset);

    // if (clonedData.c2Data)
    //     clonedData.c2Data = C2Data.parse(clonedData.c2Data);

    if (clonedData.imageList) clonedData.imageList = clonedData.imageList.map((item) => Asset.parse(item));

    return this.upsert(clonedData);
  }

  static reducer(action, ImageComponent, session) {
    const { payload, type } = action;
    const { Component, Asset } = session;

    switch (type) {
      case IMGCOMP_CLONE: {
        const { id } = payload;
        break;
      }
      case IMGCOMP_ADD_IMAGE: {
        break;
      }
      case IMGCOMP_DELETE_IMAGE: {
        break;
      }
    }
  }

  static create(props: any) {
    const { behaviors } = props;

    if (behaviors) {
      // 하위 호환성
      if (!_.find(behaviors, ['type', BEHAVIOR_TYPE.Magnetic])) {
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
    return super.create({
      //@ts-ignore
      ...ImageComponent.defaultProps,
      props,
    });
  }
}

ImageComponent.modelName = 'ImageComponent';

ImageComponent.fields = {
  id: attr(),
  width: attr(),
  height: attr(),
  asset: fk('Asset', 'imageComponents'),
  // c2Data: fk('C2Data'),
  imageList: many('Asset', 'imageList_ImageComponents'),
  behaviors: attr(),
};
//@ts-ignore
ImageComponent.defaultProps = {
  c2Data: null,
  imageList: [],
  behaviors: 0, //default_behaviors
};

export default ImageComponent;
