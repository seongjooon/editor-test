/**
 * Created by neo on 2016. 11. 15..
 */

/*********
 * LIB
 */
// redux
import { Model, attr, createSelector as ormCreateSelector } from 'redux-orm';
import propTypesMixin from 'redux-orm-proptypes';
import { createSelector } from 'reselect';
import { createAction } from 'redux-actions';

/*******
 * LOCAL
 */
// import type {BookInfo} from '../../constants/msType';
// import { API } from '../middleware/api';
// import { actions as notify } from './notification';

import * as CT from 'constants/msConstant';
import { isNil } from 'lodash';

/********
 * Type
 */
export type VPropertyModel = {
  id: number,
  scale: any,
  position: any,
  angle: number,
  opacity: number,
  visible: boolean,
  lock: boolean,
  dragable: boolean,
  global: boolean,
  blendMode: number,
  scene: number,
  zIndex?: number
};

/*****************
 * Constant
 */
const VPROPERTY_CLEAR = 'VPROPERTY_CLEAR';
const VPROPERTY_RECEIVE = 'VPROPERTY_RECEIVE';
const VPROPERTY_ADD = 'VPROPERTY_ADD';
const VPROPERTY_DUPLICATE = 'VPROPERTY_DUPLICATE';

/***********************
 *  Action
 */

const _clear = createAction(VPROPERTY_CLEAR, payload => payload);
const _receive = createAction(VPROPERTY_RECEIVE, payload => payload);
const _add = createAction(VPROPERTY_ADD, payload => payload);
const _duplicate = createAction(VPROPERTY_DUPLICATE, payload => payload);

const clear = () => {
  return dispatch => {
    dispatch(_clear());
  };
};

const receive = items => {
  return dispatch => {
    dispatch(_receive(items));
  };
};

const duplicate = (sourceId: number) => {
  return dispatch => {
    dispatch(_duplicate(sourceId));
  };
};

const changeVProperty = (props: Object) => {
  return {
    type: CT.ActionType.CHANGE_VISIBLE_PROPERTY,
    payload: props
  };
};

const add = (payload: VPropertyModel) => {
  return dispatch => {
    dispatch(_add(payload));
  };
};

export const actions = {
  changeVProperty,
  add,
  clear,
  receive,
  duplicate
};

/***************
 * Reducer
 */

const ValidatingModel = propTypesMixin(Model);

class VisibleProperty extends ValidatingModel {
  props: VPropertyModel;

  toJSON() {
    return {
      ...this.ref
    };
  }

  clone() {
    const clonedData = { ...this.ref };
    delete clonedData.id;

    const { VisibleProperty } = this.getClass().session;
    return VisibleProperty.create(clonedData);
  }

  static parse(data) {
    const clonedData = { ...data };
    return this.upsert(clonedData);
  }

  static reducer(action, VisibleProperty, session) {
    const { payload, type } = action;

    switch (type) {
      //case CT.ActionType.DELETE_PAGE:
      // case CT.ActionType.DELETE_SCENE:
      // {
      //   // VisibleProperty.filter({scene: payload}).map(visibleProperty => {
      //   //   visibleProperty.delete();
      //   //
      //   // });
      //   break;
      // }

      // case CT.ActionType.DELETE_IMAGE_COMPONENT:
      // {
      //
      //   // delete vproperty
      //   VisibleProperty.withId(payload.vId).delete();
      //
      //   break;
      // }
      case CT.ActionType.CHANGE_VISIBLE_PROPERTY: {
        const { vId, property } = payload;
        VisibleProperty.withId(vId).update(property);

        break;
      }
      case VPROPERTY_CLEAR:
        {
          VisibleProperty.all()
            .toModelArray()
            .map(item => {
              item.delete();
            });
        }
        break;
      case VPROPERTY_ADD:
        {
          VisibleProperty.create(payload);
        }
        break;
      case VPROPERTY_RECEIVE:
        {
          payload.items.map(item => {
            VisibleProperty.create(item);
          });
        }
        break;
      case VPROPERTY_DUPLICATE:
        {
          if (!VisibleProperty.idExists(payload)) break;

          const clone = VisibleProperty.withId(payload).ref;
          const cloneProps = Object.assign({}, clone);
          delete cloneProps.id;
          VisibleProperty.create(cloneProps);
        }
        break;
    }
  }
}

VisibleProperty.modelName = 'VisibleProperty';

VisibleProperty.fields = {
  id: attr(),
  scale: attr(),
  position: attr(),
  angle: attr(),
  opacity: attr(),
  visible: attr(),
  lock: attr(),
  dragable: attr(),
  global: attr(),
  blendMode: attr(),
  scene: attr(),
  zIndex: attr()
};

VisibleProperty.defaultProps = {
  scale: {
    width: 300,
    height: 300
  },
  position: {
    x: 200,
    y: 200
  },
  angle: 0,
  opacity: 1,
  visible: true,
  global: false,
  blendMode: 0,
  lock: false,
  dragable: false,
  zIndex: 0
};

export default VisibleProperty;
