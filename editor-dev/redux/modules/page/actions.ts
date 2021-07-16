import { createAction } from 'redux-actions';

import * as Type from './actionTypes';

export const pageAdd = createAction(Type.PAGE_ADD, payload => payload);
export const pageDelete = createAction(Type.PAGE_DELETE, payload => payload);
export const pageClone = createAction(Type.PAGE_CLONE, payload => payload);
export const pageSelect = createAction(Type.PAGE_SELECT, payload => payload);
export const pageSelectWithGroup = createAction(Type.PAGE_SELECT_WITH_GROUP, payload => payload);
export const pageUpdateTitle = createAction(Type.PAGE_UPDATE_TITLE, payload => payload);
export const pageSort = createAction(Type.PAGE_SORT, payload => payload);
export const pageAddScript = createAction(Type.PAGE_ADD_SCRIPT, payload => payload);
export const pageDeleteScript = createAction(Type.PAGE_DELETE_SCRIPT, payload => payload);
export const pageUpdateScript = createAction(Type.PAGE_UPDATE_SCRIPT, payload => payload);
export const pageUpdateBgImage = createAction(Type.PAGE_UPDATE_BG_IMAGE, payload => payload);
export const pageUpdateBgSound = createAction(Type.PAGE_UPDATE_BG_SOUND, payload => payload);
export const pageUpdateField = createAction(Type.PAGE_UPDATE_FIELD, payload => payload);
export const pageSortScript = createAction(Type.PAGE_SORT_SCRIPT, payload => payload);
export const pageSelectNext = createAction(Type.PAGE_SELECT_NEXT, payload => payload);
export const pageMovePage = createAction(Type.PAGE_MOVE_PAGE, payload => payload);
export const pageImport = createAction(Type.PAGE_IMPORT, payload => payload);
export const pageUpdateThumbnail = createAction(Type.PAGE_UPDATE_THUMBNAIL, payload => payload);
export const pageUpdateTelescopeMode = createAction(Type.PAGE_UPDATE_TELESCOPE_MODE, payload => payload);
export const pageUpdateMatchings = createAction(Type.PAGE_UPDATE_MATCHINGS, payload => payload);
export const pageUpdateQuiz = createAction(Type.PAGE_UPDATE_QUIZ, payload => payload);
export const pageUpdateDrawingSize = createAction(Type.PAGE_UPDATE_DRAWING_SIZE, payload => payload);
export const paegUpdateDrawingInit = createAction(Type.PAGE_UPDATE_DRAWING_INIT, payload => payload);
export const pageUpdatePageSync = createAction(Type.PAGE_UPDATE_PAGE_SYNC, payload => payload);