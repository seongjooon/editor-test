import { createAction } from 'redux-actions';

import * as Type from './actionTypes';

export const pageGroupAdd = createAction(Type.PAGEGROUP_ADD, payload => payload);
export const pageGroupDelete = createAction(Type.PAGEGROUP_DELETE, payload => payload);
export const pageGroupSelect = createAction(Type.PAGEGROUP_SELECT, payload => payload);
export const pageGroupClone = createAction(Type.PAGEGROUP_CLONE, payload => payload);
export const pageGroupUpdateTitle = createAction(Type.PAGEGROUP_UPDATE_TITLE, payload => payload);
export const pageGroupSort = createAction(Type.PAGEGROUP_SORT, payload => payload);
export const pageGroupMove = createAction(Type.PAGEGROUP_MOVE, payload => payload);