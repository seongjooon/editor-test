import { createAction } from 'redux-actions';

import {
    BOOK_LOAD,
    BOOK_CREATE,
    BOOK_UPDATE
// } from './actionTypes';
} from '@/redux/modules/book/actionTypes';

export const bookLoad = createAction(BOOK_LOAD, (payload) => payload);
export const bookCreate = createAction(BOOK_CREATE, (payload) => payload);
export const bookUpdate = createAction(BOOK_UPDATE, (payload) => payload);
