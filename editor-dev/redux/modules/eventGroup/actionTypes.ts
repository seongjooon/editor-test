export const EVENTGROUP_ADD = 'minischool/eventGroup/EVENTGROUP_ADD';
export const EVENTGROUP_DELETE = 'minischool/eventGroup/EVENTGROUP_DELETE';
export const EVENTGROUP_SORT = 'minischool/eventGroup/EVENTGROUP_SORT';
export const EVENTGROUP_SELECT = 'minischool/eventGroup/EVENTGROUP_SELECT';
export const EVENTGROUP_CLONE = 'minischool/eventGroup/EVENTGROUP_CLONE';
export const EVENTGROUP_UPDATE_TITLE = 'minischool/eventGroup/EVENTGROUP_UPDATE_TITLE';
export const EVENTGROUP_UPDATE_SYNC = 'minischool/eventGroup/EVENTGROUP_UPDATE_SYNC';

export type EventGroupActionTypes =
  | typeof EVENTGROUP_ADD
  | typeof EVENTGROUP_DELETE
  | typeof EVENTGROUP_SORT
  | typeof EVENTGROUP_SELECT
  | typeof EVENTGROUP_CLONE
  | typeof EVENTGROUP_UPDATE_TITLE
  | typeof EVENTGROUP_UPDATE_SYNC;
