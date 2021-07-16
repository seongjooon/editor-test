/**
 * Created by neo on 2016. 11. 11..
 */

/********
 * LIB
 */
import { createAction, handleActions } from 'redux-actions';
import { push } from 'react-router-redux';
// util
import mapKeys from 'lodash/mapKeys';
import queryString from 'query-string';

/*******
 * LOCAL
 */
import type { BookInfo } from 'constants/msType';
import FetchPost from 'utils/FetchPost';
//import { startRequest, doneRequest } from 'redux/modules/appState/actions';
// Log
import MSLog from 'utils/MSLog';
// constants
import { END_REASON } from 'constants/Log';
import { API_HOST, API_PATH } from 'constants/msConstant';

// ------------------------------------
// Constants
// ------------------------------------

export const BOOK_LIST_RECEIVE = 'BOOK_LIST_RECEIVE';
export const BOOK_LIST_CLEAR = 'BOOK_LIST_CLEAR';
//export const BOOK_DELETE = 'BOOK_DELETE';
//export const BOOK_EDIT = 'BOOK_EDIT';
export const BOOK_CREATE = 'BOOK_CREATE';

const initialState = {
  bookList: []
};

// ------------------------------------
// Actions
// ------------------------------------
const _receiveBookList = createAction(BOOK_LIST_RECEIVE, payload => payload);
const _clearBookList = createAction(BOOK_LIST_CLEAR, payload => payload);

const fetchBookList = () => {
  return dispatch => {
    //const {user, token} = getState().auth;

    const parsed = queryString.parse(location.search);

    //dispatch(startRequest({}));

    FetchPost(API_HOST + API_PATH + '/book/bookList', {
      body: JSON.stringify({
        login_id: parsed.loginId,
        token: parsed.token
      })
    }).then(res => {
      console.log('book list', res);
      const bookList = _convertBookInfoListKey(res.result);

      //dispatch(doneRequest({}));
      dispatch(_receiveBookList({ bookList }));
    });
  };
};

const clearBookList = () => {
  return dispatch => {
    dispatch(_clearBookList({}));
  };
};

const createBook = (bookInfo: BookInfo) => {
  return dispatch => {
    //dispatch(startRequest({}));

    const parsed = queryString.parse(location.search);

    FetchPost(API_HOST + API_PATH + '/book/addBook', {
      body: JSON.stringify({
        login_id: parsed.loginId,
        token: parsed.token,
        title: bookInfo.title,
        book_desc: bookInfo.description,
        book_type: bookInfo.type,
        category_type: bookInfo.category,
        cover_image_url: bookInfo.coverImageUrl
      })
    }).then(() => {
      dispatch(fetchBookList());
    });
  };
};

const deleteBook = (bookId: number) => {
  return (dispatch, getState) => {
    //dispatch(startRequest({}));

    const { token } = getState().auth;

    FetchPost(API_HOST + API_PATH + '/book/removeBook', {
      body: JSON.stringify({
        token: token,
        book_id: bookId
      })
    }).then(res => {
      console.log('delete book', res);
      //dispatch(doneRequest({}));
      dispatch(fetchBookList());
    });
  };
};

const editBook = bookId => {
  return dispatch => {
    //dispatch(bookActions.requestBook(bookId));

    dispatch(push(`/editor?id=${bookId}`));
  };
};

const _convertBookInfoListKey = serverResponse => {
  let serverKeyMap = {
    book_id: 'id',
    title: 'title',
    book_type: 'type',
    cover_image_url: 'coverImageUrl',
    book_desc: 'description',
    category_type: 'category',
    book_stat_cd: 'state',
    book_key: 'bookKey'
  };

  return serverResponse.map(obj => {
    return mapKeys(obj, function(value, key) {
      return serverKeyMap[key];
    });
  });
};

export const actions = {
  fetchBookList,
  createBook,
  deleteBook,
  editBook,
  clearBookList
};

// ------------------------------------
// Reducer
// ------------------------------------
export default handleActions(
  {
    [BOOK_LIST_RECEIVE]: (state, { payload }) => {
      return {
        ...state,
        bookList: payload.bookList
      };
    },
    [BOOK_LIST_CLEAR]: state => {
      return {
        ...state,
        bookList: []
      };
    }
  },
  initialState
);

// ------------------------------------
// Selector
// ------------------------------------

const getBookList = state => {
  return state.bookList;
};

export const selectors = {
  getBookList
};
