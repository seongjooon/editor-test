export const PAGE_ADD = 'minischool/page/PAGE_ADD';
export const PAGE_DELETE = 'minischool/page/PAGE_DELETE';
export const PAGE_CLONE = 'minischool/page/PAGE_CLONE';
export const PAGE_SELECT = 'minischool/page/PAGE_SELECT';
export const PAGE_SELECT_WITH_GROUP = 'minischool/page/SELECT_WITH_GROUP'; // 구에디터 SELECT_PAGE_AND_GROUP
export const PAGE_UPDATE_TITLE = 'minischool/page/PAGE_UPDATE_TITLE';
export const PAGE_SORT = 'minischool/page/PAGE_SORT';

export const PAGE_ADD_SCRIPT = 'minischool/page/PAGE_ADD_SCRIPT';
export const PAGE_DELETE_SCRIPT = 'minischool/page/PAGE_DELETE_SCRIPT';
export const PAGE_UPDATE_SCRIPT = 'minischool/page/PAGE_UPDATE_SCRIPT';

export const PAGE_UPDATE_BG_IMAGE = 'minischool/page/PAGE_UPDATE_BG_IMAGE';
export const PAGE_UPDATE_BG_SOUND = 'minischool/page/PAGE_UPDATE_BG_SOUND';

export const PAGE_UPDATE_FIELD = 'minischool/page/PAGE_UPDATE_FIELD';

export const PAGE_SORT_SCRIPT = 'minischool/page/PAGE_SORT_SCRIPT';

export const PAGE_SELECT_NEXT = 'minischool/page/PAGE_SELECT_NEXT';

export const PAGE_MOVE_PAGE = 'minischool/page/PAGE_MOVE_PAGE';

export const PAGE_IMPORT = 'minischool/page/PAGE_IMPORT';

export const PAGE_UPDATE_THUMBNAIL = 'minischool/page/PAGE_UPDATE_THUMBNAIL';

export const PAGE_UPDATE_TELESCOPE_MODE = 'minischool/page/PAGE_UPDATE_TELESCOPE_MODE';

export const PAGE_UPDATE_MATCHINGS = 'minischool/page/PAGE_UPDATE_MATCHINGS';

export const PAGE_UPDATE_QUIZ = 'minischool/page/PAGE_UPDATE_QUIZ';

export const PAGE_UPDATE_DRAWING_SIZE = 'minischool/page/PAGE_DRAWING_SIZE';

export const PAGE_UPDATE_DRAWING_INIT = 'minischool/page/PAGE_DRAWING_INIT';

export const PAGE_UPDATE_PAGE_SYNC = 'minischool/page/PAGE_PAGE_SYNC';

export type PageActionTypes =
  | typeof PAGE_ADD
  | typeof PAGE_DELETE
  | typeof PAGE_CLONE
  | typeof PAGE_SELECT
  | typeof PAGE_SELECT_WITH_GROUP
  | typeof PAGE_UPDATE_TITLE
  | typeof PAGE_SORT
  | typeof PAGE_ADD_SCRIPT
  | typeof PAGE_DELETE_SCRIPT
  | typeof PAGE_UPDATE_SCRIPT
  | typeof PAGE_UPDATE_BG_IMAGE
  | typeof PAGE_UPDATE_BG_SOUND
  | typeof PAGE_UPDATE_FIELD
  | typeof PAGE_SORT_SCRIPT
  | typeof PAGE_SELECT_NEXT
  | typeof PAGE_MOVE_PAGE
  | typeof PAGE_IMPORT
  | typeof PAGE_UPDATE_THUMBNAIL
  | typeof PAGE_UPDATE_TELESCOPE_MODE
  | typeof PAGE_UPDATE_MATCHINGS
  | typeof PAGE_UPDATE_QUIZ
  | typeof PAGE_UPDATE_DRAWING_SIZE
  | typeof PAGE_UPDATE_DRAWING_INIT
  | typeof PAGE_UPDATE_PAGE_SYNC;
