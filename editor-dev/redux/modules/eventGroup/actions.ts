import { createAction } from 'redux-actions';

import * as Type from './actionTypes';

export const eventGroupAdd = createAction(Type.EVENTGROUP_ADD, payload => payload);
export const eventGroupDelete = createAction(Type.EVENTGROUP_DELETE, payload => payload);
export const eventGroupSort = createAction(Type.EVENTGROUP_SORT, payload => payload);
export const eventGroupSelect = createAction(Type.EVENTGROUP_SELECT, payload => payload);
export const eventGroupClone = createAction(Type.EVENTGROUP_CLONE, payload => payload);
export const eventGroupUpdateTitle = createAction(Type.EVENTGROUP_UPDATE_TITLE, payload => payload);
export const eventGroupUpdateSync = createAction(Type.EVENTGROUP_UPDATE_SYNC, payload => payload);