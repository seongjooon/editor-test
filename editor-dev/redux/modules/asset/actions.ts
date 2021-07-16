import { createAction } from 'redux-actions';

import * as Type from './actionTypes';

export const assetCreate = createAction(Type.ASSET_CREATE, payload => payload);
export const assetUpdate = createAction(Type.ASSET_UPDATE, payload => payload);
