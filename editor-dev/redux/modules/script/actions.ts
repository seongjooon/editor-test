import { createAction } from 'redux-actions';

import * as Type from './actionTypes';

export const scriptAdd = createAction(Type.SCRIPT_ADD, payload => payload);
export const scriptDelete = createAction(Type.SCRIPT_DELETE, payload => payload);
export const scriptSelect = createAction(Type.SCRIPT_SELECT, payload => payload);
export const scriptSort = createAction(Type.SCRIPT_SORT, payload => payload);
export const scriptUpdate = createAction(Type.SCRIPT_UPDATE, payload => payload);
export const scriptUpdateWithId = createAction(Type.SCRIPT_UPDATE_WITH_ID, payload => payload);
