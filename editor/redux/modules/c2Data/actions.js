/**
 * Created by neo on 2016. 11. 15..
 */

// flow

/*********
 * LIB
 */
// redux
import { Model, attr } from 'redux-orm';
import propTypesMixin from 'redux-orm-proptypes';
import { createAction } from 'redux-actions';

/*******
 * LOCAL
 */

/****************************
 * Type
 */

export type C2DataModel = {
  id: ?number,
  typeName: string,
  animations: string,
  plugins: Array<string>,
  dataUrl: string,
  data: Object
};

/*****************
 * Constant
 */
export const CREATE = 'minischool/c2Data/CREATE';
export const CLEAR = 'minischool/c2Data/CLEAR';

export const VIDEO_LOCAL = 'video_local';
export const VIDEO_REMOTE = 'video_remote';
export const VIDEO_GUEST = 'video_guest';

/***********************
 *  Action
 */
const _create = createAction(CREATE, (payload: C2DataModel) => payload);

const create = payload => {
  return dispatch => {
    dispatch(_create(payload));
  };
};

export const actions = {};

/***************
 * Reducer
 */

const ValidatingModel = propTypesMixin(Model);

export class C2Data extends ValidatingModel {
  props: C2DataModel;

  toJSON() {
    return { ...this.ref };
  }

  clone() {
    const clonedData = { ...this.ref };
    delete clonedData.id;

    const { C2Data } = this.getClass().session;
    return C2Data.create(clonedData);
  }

  static parse(data) {
    const clonedData = { ...data };
    return this.upsert(clonedData);
  }

  static import(data) {
    const clonedData = { ...data };

    delete clonedData.id;
    delete clonedData.zIndex;

    return this.upsert(clonedData);
  }

  static reducer(action, C2Data, session): Object {
    const { payload, type } = action;

    switch (type) {
      case CREATE: {
        C2Data.create(payload);
        break;
      }
    }
  }
}

C2Data.modelName = 'C2Data';

C2Data.fields = {
  id: attr(),
  typeName: attr(),
  animations: attr(),
  plugins: attr(),
  dataUrl: attr(),
  data: attr()
};

C2Data.defaultProps = {
  plugins: []
};

export default C2Data;
