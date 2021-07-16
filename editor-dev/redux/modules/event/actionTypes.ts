export const EVENT_ADD = 'minischool/event/EVENT_ADD';
export const EVENT_DELETE = 'minischool/event/EVENT_DELETE';
export const EVENT_SORT = 'minischool/event/EVENT_SORT';
export const EVENT_UPDATE = 'minischool/event/EVENT_UPDATE';

//prettier-ignore
export type EventActionTypes = 
  | typeof EVENT_ADD 
  | typeof EVENT_DELETE 
  | typeof EVENT_SORT
  | typeof EVENT_UPDATE;
