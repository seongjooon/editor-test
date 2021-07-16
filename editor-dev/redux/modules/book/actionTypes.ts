export const BOOK_LOAD = 'minischool/book/BOOK_LOAD';
export const BOOK_CREATE = 'minischool/book/BOOK_CREATE';
export const BOOK_UPDATE = 'minischool/book/BOOK_UPDATE';

//prettier-ignore
export type BookActionTypes = 
  | typeof BOOK_LOAD
  | typeof BOOK_CREATE
  | typeof BOOK_UPDATE