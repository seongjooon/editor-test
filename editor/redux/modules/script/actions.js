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
import {
  isNil,
  random,
  indexOf,
  find,
  isUndefined,
  maxBy,
  cloneDeep
} from 'lodash';
// import { EditorState, convertToRaw } from 'draft-js';

/*******
 * LOCAL
 */
// type
import type { EventGroupModel } from 'redux/modules/eventGroup/index';

/**************
 * Type
 */

export type ScriptRef = {
  id: number,
  script: string,
  onEndEventGroup: ?number,
  zIndex: number
};

export type ScriptModel = Script & {
  onEndEventGroup: ?EventGroupModel
};

/*****************
 * Constant
 */
const ADD = 'minischool/script/ADD';
const DELETE = 'minischool/script/DELETE';
const SORT = 'minischool/script/SORT';
const SELECT = 'minischool/script/SELECT';
const UPDATE = 'minischool/script/UPDATE';
const UPDATE_WITH_ID = 'minischool/script/UPDATE_WITH_ID';

/***********************
 *  Action
 */
const _add = createAction(
  ADD,
  (payload: { script: string, onEndEventGroupId: number }) => payload
);
const _delete = createAction(DELETE, (payload: { id: number }) => payload);
const _sort = createAction(
  SORT,
  (payload: { fromIndex: number, toIndex: number }) => payload
);
const _select = createAction(SELECT, (payload: { id: number }) => payload);
const _update = createAction(
  UPDATE,
  (payload: { script: string, scriptId: number, eventGroupId: number }) =>
    payload
);
const _updateWithId = createAction(
  UPDATE_WITH_ID,
  (payload: { script: string, scriptId: number, eventGroupId: number }) =>
    payload
);

export const addScript = (script: string, onEndEventGroupId: number) => {
  return (dispatch: any) => {
    dispatch(_add({ script, onEndEventGroupId }));
  };
};

export const deleteScript = (id: number) => {
  return (dispatch: any) => {
    dispatch(_delete({ id }));
  };
};

export const sortScript = (fromIndex: number, toIndex: number) => {
  return (dispatch: any) => {
    dispatch(_sort({ fromIndex, toIndex }));
  };
};

export const selectScript = (id: number) => {
  return (dispatch: any) => {
    dispatch(_select({ id }));
  };
};

export const updateScript = (script: string, eventGroupId: number) => {
  return (dispatch: any) => {
    dispatch(_update({ script, eventGroupId }));
  };
};

export const updateScriptWithId = (
  script: string,
  scriptId: number,
  eventGroupId: number
) => {
  return (dispatch: any) => {
    dispatch(_updateWithId({ script, scriptId, eventGroupId }));
  };
};

export const actions = {
  addScript,
  deleteScript,
  sortScript,
  selectScript,
  updateScript,
  updateScriptWithId
};

/***************
 * Reducer
 */

const ValidatingModel = propTypesMixin(Model);

class Script extends ValidatingModel {
  props: ScriptModel;

  toString() {
    return `Script: ${this.name}`;
  }

  toJSON() {
    return {
      ...this.ref
      //onEndEventGroup: isNil(this.onEndEventGroup)?null:this.onEndEventGroup.toJSON(),
    };
  }

  clone() {
    const clonedData = { ...this.ref };
    delete clonedData.id;

    // // TODO
    // clonedData.onEndEventGroup = null;

    const { Script } = this.getClass().session;
    const newScript = Script.create(clonedData);
    return newScript;
  }

  hasEventGroup(eventGroupId: number): boolean {
    const parsed = JSON.parse(this.script);
    const { entityMap } = parsed;
    const entityKeys = Object.keys(entityMap);
    let status = false;

    if (eventGroupId === this.onEndEventGroup) {
      status = true;
    }

    if (!status) {
      entityKeys.forEach(key => {
        if (
          entityMap[key].data.mention &&
          eventGroupId === entityMap[key].data.mention.id
        ) {
          status = true;
        }
      });
    }
    return status;
  }

  deleteEventGroup(eventGroupId: number): void {
    const raw = JSON.parse(this.script);

    const removeEvent = (raw, id) => {
      const refineString = (text, range) => {
        const start = range.offset;
        const end = range.offset + range.length;

        const filtered = text
          .split('')
          .filter((char, i) => {
            if (i < start || i >= end) {
              return char;
            }
          })
          .join('');

        return filtered === ' ' ? filtered.trim() : filtered;
      };

      const entity_keys = [];

      // delete property in entityMap
      Object.keys(raw.entityMap).forEach(key => {
        if (
          raw.entityMap[key].data.mention &&
          raw.entityMap[key].data.mention.id === id
        ) {
          entity_keys.push(Number(key));
          delete raw.entityMap[key];
        }
      });

      raw.blocks.forEach(block => {
        let remove_key = [];

        block.entityRanges.forEach((range, index) => {
          if (entity_keys.indexOf(range.key) !== -1) {
            const text = block.text;
            const { offset, length } = range;
            block.text = refineString(text, range);
            remove_key.push(range.key);

            block.entityRanges.forEach(left_range => {
              if (left_range.offset > offset) {
                left_range.offset = left_range.offset - length;
              }
            });
          }
        });

        remove_key.forEach(key => {
          block.entityRanges.forEach((range, index) => {
            if (range.key === key) {
              block.entityRanges.splice(index, 1);
            }
          });
        });
      });
    };

    if (this.hasEventGroup(eventGroupId)) {
      removeEvent(raw, eventGroupId);
      this.script = JSON.stringify(raw);
    }
  }

  updateEventGroupTitle(eventGroupId: number, title: string): void {
    const raw = JSON.parse(this.script);

    const renameEvent = (raw, id, title) => {
      const title_length = title.length;

      const refineString = (text, range) => {
        const text_arr = text.split('');
        text_arr.splice(range.offset, range.length);
        text_arr.splice(range.offset, 0, title);

        return text_arr.join('');
      };

      const entity_keys = [];

      // find property in entityMap
      Object.keys(raw.entityMap).forEach(key => {
        if (
          raw.entityMap[key].data.mention &&
          raw.entityMap[key].data.mention.id === id
        ) {
          raw.entityMap[key].data.mention.name = title;
          entity_keys.push(Number(key));
        }
      });

      raw.blocks.forEach(block => {
        let remove_key = [];

        block.entityRanges.forEach((range, index) => {
          if (entity_keys.indexOf(range.key) !== -1) {
            const text = block.text;
            const { offset, length } = range;
            block.text = refineString(text, range);
            const diff = title_length - length;
            range.length = title_length;

            block.entityRanges.forEach(left_range => {
              if (left_range.offset > offset) {
                left_range.offset = left_range.offset + diff;
              }
            });
          }
        });
      });
    };

    renameEvent(raw, eventGroupId, title);
    this.script = JSON.stringify(raw);
  }

  static create(props) {
    const { Page } = this.session;
    const page = Page.getSelected();

    if (page === null || props.hasOwnProperty('zIndex')) {
      return super.create(props);
    }

    // update zindex
    const last = page.sortedScripts.last();
    let nextZIndex = 0;
    if (typeof last !== 'undefined') nextZIndex = last.zIndex + 1;

    // create
    return super.create({
      ...props,
      zIndex: nextZIndex
    });
  }

  static getSelected() {
    const { AppState } = this.session;
    const selectedId = AppState.getSelectedScriptId();
    if (selectedId === null) return null;
    else return this.withId(selectedId);
  }

  static select(id: ?number) {
    const { AppState } = this.session;
    AppState.selectScript(id);
  }

  static parse(data) {
    //const {EventGroup} = this.session;
    const clonedData = { ...data };

    // if(!isNil(clonedData.onEndEventGroup))
    //     clonedData.onEndEventGroup = EventGroup.parse(clonedData.onEndEventGroup);

    return this.upsert(clonedData);
  }

  static import(data) {
    const clonedData = { ...data };

    delete clonedData.id;
    // delete clonedData.zIndex;

    return this.upsert(clonedData);
  }

  static reducer(action, Script, session) {
    const { payload, type } = action;
    const { Page, EventGroup } = session;

    switch (type) {
      case ADD: {
        const { Page } = session;
        const {
          script,
          onEndEventGroupId
        }: { script: string, onEndEventGroupId: number } = payload;
        const newScript = this.create({
          script,
          onEndEventGroup: onEndEventGroupId
        });

        const page = Page.getSelected();
        page.scripts.add(newScript);
        this.select(newScript.id);
        break;
      }
      case DELETE: {
        this.select(null);

        const { id }: { id: number } = payload;
        this.withId(id).delete();
        break;
      }
      case SORT: {
        const page = Page.getSelected();
        const items = page.sortedScripts.toRefArray().map(item => item.id);
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
      case UPDATE: {
        const {
          script,
          eventGroupId
        }: { script: string, eventGroupId: number } = payload;
        const selected = this.getSelected();
        if (selected !== null)
          selected.update({
            script: script,
            onEndEventGroup: eventGroupId
          });
        break;
      }

      case UPDATE_WITH_ID: {
        const {
          script,
          scriptId,
          eventGroupId
        }: {
          script: string,
          scriptId: number,
          eventGroupId: number
        } = payload;
        const selected = this.withId(scriptId);
        selected.update({
          script: script,
          onEndEventGroup: eventGroupId
        });
        break;
      }
    }
  }
}

Script.modelName = 'Script';

Script.fields = {
  id: attr(),
  script: attr(),
  onEndEventGroup: fk('EventGroup', 'scripts_onEndEventGroup'),
  zIndex: attr()
};

Script.defaultProps = {
  script: '',
  onEndEventGroup: null,
  zIndex: 0
};

export default Script;
