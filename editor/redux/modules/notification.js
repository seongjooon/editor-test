import { createAction, handleActions } from 'redux-actions';

/***
 * Local
 */

// ------------------------------------
// Constants
// ------------------------------------
export const NOTIFICATION_EMIT = 'NOTIFICATION_EMIT';
export const NOTIFICATION_DISMISS = 'NOTIFICATION_DISMISS';

const initialState = {};

// ------------------------------------
// Actions
// ------------------------------------
export const emitNotification = createAction(
  NOTIFICATION_EMIT,
  payload => payload
);
export const dismissNotification = createAction(
  NOTIFICATION_DISMISS,
  payload => payload
);

export const emit = msError => {
  console.error('Noti => ', msError);

  return dispatch => {
    dispatch(emitNotification(msError.toJSON()));
    // if(msError.path)
    //   dispatch(push(msError.path));
  };
};

export const alertMessage = (title, message) => {
  return dispatch => {
    dispatch(emitNotification({ title, message }));
    // if(msError.path)
    //   dispatch(push(msError.path));
  };
};

export const dismiss = () => {
  return dispatch => {
    // const notification = getState().notification;
    // if(notification.path)
    //   dispatch(push(notification.path));
    dispatch(dismissNotification());
  };
};

export const actions = {
  emit,
  alertMessage,
  dismiss
};

// ------------------------------------
// Reducer
// ------------------------------------
export default handleActions(
  {
    [NOTIFICATION_EMIT]: (state, { payload }) => {
      //return state.concat([payload]);
      return payload;
    },
    [NOTIFICATION_DISMISS]: () => {
      return {};
    }
  },
  initialState
);
