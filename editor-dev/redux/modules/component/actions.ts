import { createAction } from 'redux-actions';

import * as Type from './actionTypes';

export const componentAdd = createAction(Type.COMPONENT_ADD, payload => payload);

export const componentAddImage = createAction(Type.COMPONENT_ADD_IMAGE, payload => payload);
export const componentAddVideo = createAction(Type.COMPONENT_ADD_VIDEO, payload => payload);
export const componentAddCharacter = createAction(Type.COMPONENT_ADD_CHARACTER, payload => payload);
export const componentAddTeacherView = createAction(Type.COMPONENT_ADD_TEACHER_VIEW, payload => payload);
export const componentAddStudentView = createAction(Type.COMPONENT_ADD_STUDENT_VIEW, payload => payload);

export const componentUpdateImage = createAction(Type.COMPONENT_UPDATE_IMAGE, payload => payload);
export const componentUpdateVideo = createAction(Type.COMPONENT_UPDATE_VIDEO, payload => payload);

export const componentDelete = createAction(Type.COMPONENT_DELETE, payload => payload);
export const componentSort = createAction(Type.COMPONENT_SORT, payload => payload);
export const componentSelect = createAction(Type.COMPONENT_SELECT, payload => payload);
export const componentClone = createAction(Type.COMPONENT_CLONE, payload => payload);
export const componentUpdatePosition = createAction(Type.COMPONENT_UPDATE_POSITION, payload => payload);
export const componentUpdateScale = createAction(Type.COMPONENT_UPDATE_SCALE, payload => payload);
export const componentUpdateAngle = createAction(Type.COMPONENT_UPDATE_ANGLE, payload => payload);
export const componentUpdateField = createAction(Type.COMPONENT_UPDATE_FIELD, payload => payload);
export const componentUpdateBehavior = createAction(Type.COMPONENT_UPDATE_BEHAVIOR, payload => payload);

export const componentDoneCanvasUpdate = createAction(Type.COMPONENT_DONE_CANVAS_UPDATE, payload => payload);
export const componentCopyComponent = createAction(Type.COMPONENT_COPY_COMPONET, payload => payload);
