import { createAction } from 'redux-actions';

import * as Type from './actionTypes';

export const eventAdd = createAction(Type.EVENT_ADD, (payload) => payload);
export const eventDelete = createAction(Type.EVENT_DELETE, (payload) => payload);
export const eventSort = createAction(Type.EVENT_SORT, (payload) => payload);
export const eventUpdate = createAction(Type.EVENT_UPDATE, (payload) => payload);

//prettier-ignore
export type Actions = 
  | ReturnType<typeof eventAdd>
  | ReturnType<typeof eventDelete>
  | ReturnType<typeof eventSort>
  | ReturnType<typeof eventUpdate>
