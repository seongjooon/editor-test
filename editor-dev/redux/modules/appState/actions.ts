import { createAction } from 'redux-actions';

import * as Type from './actionTypes';

export const appStateInit = createAction(Type.APPSTATE_INIT, payload => payload);
export const appStateUpdate = createAction(Type.APPSTATE_UPDATE, payload => payload);
