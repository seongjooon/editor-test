/**
 * Created by neo on 2016. 11. 15..
 */
// @flow

/*********
 * LIB
 */
// redux
import { Model, many, fk, attr } from 'redux-orm';
import propTypesMixin from 'redux-orm-proptypes';
import { createAction } from 'redux-actions';
// util
import { isNil, maxBy } from 'lodash';

// constants
import Language from 'constants/Language';

/*******
 * LOCAL
 */
// type, constant
import {
  MS_STRING,
  ANIMATION_EFFECT,
  FLY_TYPE,
  ActionType,
  DIRECTION
} from 'constants/msConstant';
import type { AssetModel } from 'redux/modules/asset//actions';
import type { ComponentModel } from 'redux/modules/component//actions';

/****************************
 * Type
 */

export type EventRef = {
  id?: number,
  name: string,
  action: string,
  property: Object,
  target?: ?number | ?ComponentModel,
  asset?: ?number | ?AssetModel,
  zIndex: number
};

export type EventModel = Event;

/*****************
 * Constant
 */

export const ACTION = {
  FADE_IN_COMPONENT: 'component/fadeIn',
  FADE_OUT_COMPONENT: 'component/fadeOut',
  FLY_IN_COMPONENT: 'component/flyIn',
  FLY_OUT_COMPONENT: 'component/flyOut',
  MOVE_COMPONENT: 'component/moveTo',
  MOVE_SIZE_COMPONENT: 'component/moveToWithSize',
  SCALE_COMPONENT: 'component/scale',
  ROTATE_COMPONENT: 'component/rotate',
  CHANGE_IMAGE: 'component/changeImage',
  RUN_BEHAVIOR: 'component/runBehavior',
  STOP_BEHAVIOR: 'component/stopBehavior',
  USER_INTERACTION: 'component/userInteraction',
  CHANGE_INVISIBLE_CHARACTER: 'character/invisible',
  PLAY_SOUND: 'sound/play',
  STOP_SOUND: 'sound/stop',
  GOTO_PAGE: 'page/goto',
  URI_REDIRECT: 'uri/redirect',
  CHANGE_INVISIBLE_STUDENT: 'student/invisible',
  CHANGE_INVISIBLE_TEACHER: 'teacher/invisible',
  MATCHING: 'component/matching',
  DRAWING_CONTROLLER: 'drawing/controller',
  DRAWING_CLEAR: 'drawing/clear',
  VOICE_HELPER_SHOW: 'voiceHelper/show',
  VOICE_HELPER_SPEAK: 'voiceHelper/speak',
  VOICE_HELPER_DISAPPEAR: 'voiceHelper/disappear'
};
//@TODO: 이벤트추가 액션
export const EVENT_ACTION = [
  [
    {
      action: ACTION.FADE_IN_COMPONENT,
      name: '',
      target: [],
      property: {
        duration: 1,
        delay: 0
      }
    },
    {
      action: ACTION.FADE_OUT_COMPONENT,
      name: '',
      target: [],
      property: {
        duration: 1,
        delay: 0
      }
    }
  ],
  [
    {
      action: ACTION.FLY_IN_COMPONENT,
      name: '',
      target: [],
      property: {
        flyType: null, // 0: 아래에서 1:왼쪽 아래에서 2:왼쪽에서 3:왼쪽 위에서 4: 위에서 5: 오른쪽 위에서 6: 오른쪽에서 7:오른쪽 아래에서
        effect: 0,
        duration: 1,
        delay: 0
      }
    },
    {
      action: ACTION.FLY_OUT_COMPONENT,
      name: '',
      target: [],
      property: {
        flyType: null, // 0: 아래에서 1:왼쪽 아래에서 2:왼쪽에서 3:왼쪽 위에서 4: 위에서 5: 오른쪽 위에서 6: 오른쪽에서 7:오른쪽 아래에서
        effect: 0,
        duration: 1,
        delay: 0
      }
    }
  ],
  [
    {
      action: ACTION.MOVE_COMPONENT,
      name: '',
      target: [],
      property: {
        x: 100,
        y: 100,
        effect: 0,
        duration: 1,
        delay: 0
      }
    },
    {
      action: ACTION.MOVE_SIZE_COMPONENT,
      name: '',
      target: [],
      property: {
        x: 100,
        y: 100,
        width: 100,
        height: 100,
        effect: 0,
        duration: 1,
        delay: 0
      }
    }
  ],
  [
    {
      action: ACTION.SCALE_COMPONENT,
      name: '',
      target: [],
      property: {
        scale: 1,
        effect: 0,
        duration: 1,
        delay: 0
      }
    }
  ],
  [
    {
      action: ACTION.ROTATE_COMPONENT,
      name: '',
      target: [],
      property: {
        angle: 90,
        direction: DIRECTION.Right,
        effect: 0,
        duration: 1,
        delay: 0
      }
    }
  ],
  [
    {
      action: ACTION.CHANGE_IMAGE,
      name: '',
      target: [],
      property: {
        delay: 0
      },
      asset: null
    }
  ],
  [
    {
      action: ACTION.RUN_BEHAVIOR,
      name: '',
      target: [],
      property: {
        behaviors: [0],
        delay: 0
      }
    },
    {
      action: ACTION.STOP_BEHAVIOR,
      name: '',
      target: [],
      property: {
        behaviors: [0],
        delay: 0
      }
    }
  ],
  [
    {
      action: ACTION.PLAY_SOUND,
      name: '',
      asset: null,
      target: [],
      property: {
        active: true,
        loop: false,
        delay: 0,
        volume: 4
      }
    },
    {
      action: ACTION.STOP_SOUND,
      name: '',
      asset: null,
      target: [],
      property: {
        type: 0, // 0: all, 1: bgSound, 2: selected sound
        assets: []
      }
    },
    {
      action: ACTION.GOTO_PAGE,
      name: '',
      property: {
        pageGroupId: null,
        pageId: null,
        pageTarget: 0
      }
    }
  ],
  [
    {
      action: ACTION.URI_REDIRECT,
      name: '',
      property: {
        uri: '',
        back: false
      }
    }
  ],
  [
    {
      action: ACTION.CHANGE_INVISIBLE_CHARACTER,
      name: '',
      property: {
        visible: false
      }
    },
    {
      action: ACTION.CHANGE_INVISIBLE_STUDENT,
      name: '',
      property: {
        visible: false
      }
    },
    {
      action: ACTION.CHANGE_INVISIBLE_TEACHER,
      name: '',
      property: {
        visible: false
      }
    }
  ],
  [
    {
      action: ACTION.DRAWING_CONTROLLER,
      name: '',
      property: {
        color: '#000000',
        opacity: 0.7,
        size: 'medium' // big, medium, small
      }
    },
    {
      action: ACTION.DRAWING_CLEAR,
      name: ''
    }
  ],
  [
    {
      action: ACTION.MATCHING,
      name: '',
      property: {
        name: '', // 정답 이름
        assignOperator: '', // 할당 연산자
        compareOperator: '', // 비교 연산자
        value: 0, // 변경되는 값
        initial: 0, // 초기값
        compareValue: 0 // 비교값
      }
    }
  ],
  [
    {
      action: ACTION.VOICE_HELPER_SHOW,
      name: '',
      property: {
        delay: 0,
        position: null
      }
    },
    {
      action: ACTION.VOICE_HELPER_SPEAK,
      name: '',
      property: {
        character: null,
        disappearAfterSpeak: false,
        category: null,
        script: null,
        delay: 0,
        volume: 4
      }
    },
    {
      action: ACTION.VOICE_HELPER_DISAPPEAR,
      name: '',
      property: {
        delay: 0
      }
    }
  ]
];

const ADD = 'minischool/event/ADD';
const DELETE = 'minischool/event/DELETE';
const SORT = 'minischool/event/SORT';
const UPDATE = 'minischool/event/UPDATE';

/***********************
 *  Action
 */
const _add = createAction(ADD, (payload: EventModel) => payload);
const _delete = createAction(DELETE, (payload: { id: number }) => payload);
const _sort = createAction(
  SORT,
  (payload: { fromIndex: number, toIndex: number }) => payload
);
const _update = createAction(UPDATE, (payload: EventModel) => payload);

export const addEvent = (event: EventModel) => {
  return (dispatch: any) => {
    dispatch(_add(event));
  };
};

export const deleteEvent = (id: number) => {
  return (dispatch: any) => {
    dispatch(_delete({ id }));
  };
};

export const sortEvent = (fromIndex: number, toIndex: number) => {
  return (dispatch: any) => {
    dispatch(_sort({ fromIndex, toIndex }));
  };
};

export const updateEvent = (event: EventModel) => {
  return (dispatch: any) => {
    dispatch(_update(event));
  };
};

export const actions = {
  addEvent,
  deleteEvent,
  sortEvent,
  updateEvent
};

/***************
 * Reducer
 */

const ValidatingModel = propTypesMixin(Model);

class Event extends ValidatingModel {
  props: EventRef;

  toJSON() {
    return {
      ...this.ref,
      target: this.target.toModelArray().map(item => item.id),
      asset: isNil(this.asset) ? null : this.asset.toJSON()
    };
  }

  clone() {
    const clonedData = {
      ...this.ref,
      target: this.target.toModelArray().map(target => {
        return target.id;
      })
    };
    delete clonedData['id'];

    const { Event, Asset } = this.getClass().session;

    let newAsset = null;
    if (clonedData.asset !== null) {
      const asset = Asset.withId(clonedData.asset);
      newAsset = asset.clone();
    }

    const newEvent = Event.create({
      ...clonedData,
      asset: newAsset
    });

    return newEvent;
  }

  delete() {
    if (this.asset !== null) this.asset.delete();

    super.delete();
  }

  getLinkedEventGroups(): Array<any> {
    return this.eventGroups.toModelArray();
  }

  static parse(data) {
    const { Asset } = this.session;
    const clonedData = { ...data };

    // if(!isNil(clonedData.target))
    //     clonedData.target = Component.parse(clonedData.target);

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

  static create(props) {
    const { EventGroup } = this.session;
    const eventGroup = EventGroup.getSelected();

    if (props.target === null || typeof props.target === 'undefined')
      props.target = [];

    if (typeof props.target === 'number') {
      props.target = [props.target];
    }

    if (eventGroup === null || props.hasOwnProperty('zIndex')) {
      return super.create(props);
    }

    let nextZIndex = 0;
    const lastEvent = eventGroup.sortedEvents.last();
    if (typeof lastEvent !== 'undefined') nextZIndex = lastEvent.zIndex + 1;

    return super.create({
      ...props,
      zIndex: nextZIndex
    });
  }

  static reducer(action, Event, session) {
    const { payload, type } = action;
    const { EventGroup } = session;

    switch (type) {
      case ADD: {
        const { Asset, EventGroup } = session;

        let newAsset = null;

        if (payload.hasOwnProperty('asset') && payload.asset !== null) {
          if (payload.asset.id === undefined) {
            newAsset = Asset.create(payload.asset);
          } else {
            newAsset = payload.asset.id;
          }
        }

        const event = this.create({
          ...payload,
          asset: newAsset
        });
        // add to eventGroup
        const eventGroup = EventGroup.getSelected();
        if (eventGroup !== null) eventGroup.events.add(event);

        break;
      }
      case SORT: {
        const eventGroup = EventGroup.getSelected();
        const items = eventGroup.sortedEventGroups
          .toRefArray()
          .map(item => item.id);
        const { fromIndex, toIndex } = payload;
        items.move(fromIndex, toIndex);
        items.forEach((id: number, index: number) => {
          this.withId(id).set('zIndex', index);
        });
        break;
      }
      case DELETE: {
        const { id }: { id: number } = payload;
        this.withId(id).delete();
        break;
      }
      case UPDATE: {
        const { id } = payload;
        if (!this.idExists(id)) return;
        console.log('### id', payload);
        const { Asset } = session;

        const event = this.withId(id);

        let newAsset = null;
        if (event.asset !== null) {
          newAsset = Asset.upsert({
            ...payload.asset,
            id: event.asset.id
          });
        }
        this.upsert({
          ...payload,
          asset: newAsset
        });
        break;
      }
    }
  }
}

Event.modelName = 'Event';

Event.fields = {
  id: attr(),
  name: attr(),
  action: attr(),
  property: attr(),
  target: many('Component', 'eventTargets'),
  asset: fk('Asset'),
  zIndex: attr(),
  components: many('Component')
};

Event.defaultProps = {
  target: null,
  asset: null,
  zIndex: 0
};

export default Event;
