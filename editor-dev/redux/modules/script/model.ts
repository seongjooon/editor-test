import * as Type from './actionTypes';
import { FADE_TYPE } from '../../../constants/msConstant';

import { Model, many, fk, attr } from 'redux-orm';
import _ from 'lodash';


class Script extends Model {
  static reducer(action, Script, session) {
    const { payload, type } = action;

    switch (type as Type.ScriptActionTypes) {
      case Type.SCRIPT_ADD: {
        const newData = { ...payload };
        this.create(newData);
        break;
      }
      case Type.SCRIPT_UPDATE: {
        const { id } = payload;
        if (!this.idExists(id)) return;

        this.upsert({ ...payload });
        break;
      }
      case Type.SCRIPT_DELETE: {
        const { id } = payload;
        if (!this.idExists(id)) return;

        this.withId(id).delete();
        break;
      }
      default:
        break;
    }
  }

  static parse(data) {
    const clonedData = { ...data };
    return this.upsert(clonedData);
  }

  // static create(data) {
    
  // }
}

Script.modelName = 'Script';

Script.fields = {
  id: attr(),
  script: attr(),
  onEndEventGroup: fk('EventGroup', 'scripts_onEndEventGroup'),
  zIndex: attr(),
};

//@ts-ignore
Script.defaultProps = {
  script: '',
  onEndEventGroup: null,
  zIndex: 0,
};

export default Script;
