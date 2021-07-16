/**
 * Created by neo on 2016. 11. 15..
 */

// flow

/*********
 * LIB
 */
// redux
import { Model, many, attr } from 'redux-orm';
import propTypesMixin from 'redux-orm-proptypes';
import { createAction } from 'redux-actions';
// util
import isNil from 'lodash/isNil';
import 'array.prototype.move';

/*******
 * LOCAL
 */
// type
import type { EventModel } from 'redux/modules/event/actions';

/****************************
 * Type
 */

export type EventGroupModel = {
  id?: number,
  title: string,
  events: Array<EventModel>,
  egSync: Boolean,
  zIndex: number
};

export type EventGroupRef = EventGroupModel & {
  events: Array<number>
};

/*****************
 * Constant
 */

const ADD = 'minischool/eventGroup/ADD';
const DELETE = 'minischool/eventGroup/DELETE';
const SORT = 'minischool/eventGroup/SORT';
const SELECT = 'minischool/eventGroup/SELECT';
const CLONE = 'minischool/eventGroup/CLONE';
const UPDATE_TITLE = 'minischool/eventGroup/UPDATE_TITLE';
const UPDATE_SYNC = 'minischool/eventGroup/UPDATE_SYNC';

/***********************
 *  Action
 */

const _add = createAction(ADD, (payload: { title: string }) => payload);
const _delete = createAction(DELETE, (payload: { id: number }) => payload);
const _sort = createAction(
  SORT,
  (payload: { fromIndex: number, toIndex: number }) => payload
);
const _select = createAction(SELECT, (payload: { id: number }) => payload);
const _clone = createAction(
  CLONE,
  (payload: { id: number, title: string }) => payload
);
const _updateTitle = createAction(
  UPDATE_TITLE,
  (payload: { title: string }) => payload
);
const _updateSync = createAction(
  UPDATE_SYNC,
  (payload: { egSync: boolean }) => payload
);

export const addEventGroup = (title: string) => {
  return dispatch => {
    dispatch(_add({ title }));
  };
};

export const deleteEventGroup = (id: number) => {
  return dispatch => {
    dispatch(_delete({ id }));
  };
};

export const selectEventGroup = (id: number) => {
  return dispatch => {
    dispatch(_select({ id }));
  };
};

export const sortEventGroup = (fromIndex: number, toIndex: number) => {
  return (dispatch: any) => {
    dispatch(_sort({ fromIndex, toIndex }));
  };
};

export const copyEventGroup = (id: number, title: string) => {
  return (dispatch: any) => {
    dispatch(_clone({ id, title }));
  };
};

export const updateEventGroupTitle = title => {
  return (dispatch: any) => {
    dispatch(_updateTitle({ title }));
  };
};

export const updateEventGroupSync = egSync => {
  return (dispatch: any) => {
    dispatch(_updateSync({ egSync }));
  };
};

export const actions = {
  addEventGroup,
  deleteEventGroup,
  selectEventGroup,
  sortEventGroup,
  updateEventGroupTitle,
  copyEventGroup,
  updateEventGroupSync
};

/***************
 * Reducer
 */

const ValidatingModel = propTypesMixin(Model);

export class EventGroup extends ValidatingModel {
  props: EventGroupModel;

  toString() {
    return `EventGroup: ${this.title}`;
  }

  toJSON() {
    return {
      ...this.ref,
      events: this.sortedEvents.toModelArray().map(item => item.toJSON())
    };
  }

  clone() {
    const clonedData = this.toJSON();
    const { EventGroup } = this.getClass().session;
    return EventGroup.import(clonedData);
  }

  delete() {
    this.events.toModelArray().forEach(item => {
      // TODO: reverse로 찾아서 사용하는 곳 지워주기
      item.delete();
    });

    super.delete();
  }

  getLinkedPages(): Array<any> {
    return this.pages_onLoadStart.toModelArray();
  }

  getLinkedComponents() {
    return [
      ...this.components_onMouseClick.toModelArray(),
      ...this.components_onMouseOver.toModelArray()
    ];
  }

  getLinkedScripts() {
    const { Page } = this.getClass().session;

    let result = [];
    const scripts = Page.getSelected().sortedScripts.toModelArray();
    scripts.forEach(script => {
      if (script.hasEventGroup(this.id)) result.push(script);
    });
    return result;
  }

  deleteLinkedScripts() {
    const { Page } = this.getClass().session;

    const scripts = Page.getSelected().sortedScripts.toModelArray();
    scripts.forEach(script => {
      script.deleteEventGroup(this.id);
    });
  }

  updateLinkedScripts(id, title) {
    const { Page } = this.getClass().session;
    const scripts = Page.getSelected().sortedScripts.toModelArray();
    scripts.forEach(script => {
      script.updateEventGroupTitle(this.id, title);
    });
  }

  get sortedEvents() {
    return this.events.orderBy('zIndex');
  }

  static getSelected() {
    const { AppState } = this.session;
    const selectedId = AppState.getSelectedEventGroupId();
    if (selectedId === null) return null;
    else return this.withId(selectedId);
  }

  static select(id) {
    const { AppState } = this.session;
    AppState.selectEventGroup(id);
  }

  static parse(data) {
    const { Event } = this.session;
    const clonedData = { ...data };

    if (!isNil(clonedData.events))
      clonedData.events = clonedData.events.map(event => Event.parse(event));

    return this.upsert(clonedData);
  }

  static import(data) {
    const { Event } = this.session;
    const clonedData = { ...data };

    delete clonedData.id;
    // delete clonedData.zIndex;

    if (!isNil(clonedData.events))
      clonedData.events = clonedData.events.map(event => Event.import(event));

    return this.upsert(clonedData);
  }

  static create(props) {
    const { Page } = this.session;
    const page = Page.getSelected();

    if (page === null || props.hasOwnProperty('zIndex')) {
      return super.create(props);
    }
    // update zindex
    const lastEventGroup = page.sortedEventGroups.last();
    let nextZIndex = 0;
    if (typeof lastEventGroup !== 'undefined')
      nextZIndex = lastEventGroup.zIndex + 1;

    // create
    return super.create({
      ...props,
      zIndex: nextZIndex
    });
  }

  static reducer(action, EventGroup, session): Object {
    const { payload, type } = action;
    const { Page, ImageComponent } = session;

    switch (type) {
      case ADD: {
        const { Page } = session;
        const { title }: { title: string } = payload;
        const newEventGroup = this.create({ title });

        const page = Page.getSelected();
        page.eventGroups.add(newEventGroup);
        this.select(newEventGroup.id);
        break;
      }
      case DELETE: {
        this.select(null);
        const { id }: { id: number } = payload;
        const eventGroup = this.withId(id);
        eventGroup.deleteLinkedScripts();
        eventGroup.delete();
        const eventGroupId = id;

        Page.getSelected()
          .components.toModelArray()
          .forEach(com => {
            if (com.imageComponent !== null) {
              const copied_behaviors = [...com.imageComponent.behaviors];

              copied_behaviors.forEach((b, i) => {
                const copied_behavior = { ...b };

                if (copied_behavior.name === 'Magnetic') {
                  if (copied_behavior.eventId === eventGroupId) {
                    copied_behavior.eventId = null;
                  }
                }
                copied_behaviors[i] = copied_behavior;
              });

              com.imageComponent.behaviors = copied_behaviors;
            }
          });
        break;
      }
      case SORT: {
        const page = Page.getSelected();
        const items = page.sortedEventGroups.toRefArray().map(item => item.id);
        const { fromIndex, toIndex } = payload;
        items.move(fromIndex, toIndex);
        items.forEach((id: number, index: number) => {
          this.withId(id).set('zIndex', index);
        });
        break;
      }
      case SELECT: {
        const { id } = payload;
        this.select(id);
        break;
      }
      case UPDATE_TITLE: {
        const { title } = payload;
        const event_group = this.getSelected();
        event_group.title = title;
        event_group.updateLinkedScripts(event_group.id, title);
        break;
      }
      case UPDATE_SYNC: {
        const { egSync } = payload;
        const event_group = this.getSelected();
        event_group.egSync = egSync;
        break;
      }
      case CLONE: {
        EventGroup.select(null);
        const { id, title } = payload;
        const eventGroup = this.withId(id).clone();
        eventGroup.set('title', title);

        const page = Page.getSelected();
        page.eventGroups.add(eventGroup);
        this.select(eventGroup.id);
        break;
      }
    }
  }
}

EventGroup.modelName = 'EventGroup';

EventGroup.fields = {
  id: attr(),
  title: attr(),
  events: many('Event', 'eventGroups'),
  egSync: attr(),
  zIndex: attr()
};

EventGroup.defaultProps = {
  events: [],
  egSync: true,
  zIndex: 0
};

export default EventGroup;
