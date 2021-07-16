/********
 * LIB
 */
import { createAction, handleActions } from 'redux-actions';
import { push } from 'react-router-redux';

/*******
 * LOCAL
 */
import FetchPost from 'utils/FetchPost';
import { actions as notify } from './notification';
import { actions as playerStateAction, CLASS_STATE } from './playerState';
// type, constants
import { API_HOST, API_PATH, ROLE } from 'constants/msConstant';
// util
import MSError from '../../utils/MSError';
import NativeInterface from '../../utils/NativeInterface';
import MSConfig from 'constants/msConfig';
import pubSub from 'utils/pubSub';
// Log
import MSLog from 'utils/MSLog';
// constants
import { END_REASON } from 'constants/Log';
import queryString from 'query-string';

// ------------------------------------
// Constants
// ------------------------------------
export const LOGIN_REQUEST = 'LOGIN_REQUEST';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';
export const LOGOUT = 'LOGOUT';
export const STORE_USER = 'STORE_USER';

export type AuthType = {
  isAuthenticated: boolean,
  memberType: ?string,
  c2ss: {
    serverUrl: ?string
  },
  teacher: {
    teacherNo: ?string,
    loginId: ?string,
    name: ?string
  },
  student: {
    birthday: ?string,
    parentsName: ?string,
    studentNo: ?string,
    sex: ?string,
    name: ?string,
    age: number
  },
  classInfo: {
    startTime: number,
    endTime: number,
    waitDuration: number
  },
  bookId: number,
  token: string,
  classKey: string,
  bookKey: string
};

const initialState = {
  isAuthenticated: false,
  memberType: null,
  c2ss: {
    serverUrl: null
  },
  teacher: {
    teacherNo: null,
    loginId: null,
    name: null
  },
  student: {
    birthday: null,
    parentsName: null,
    studentNo: null,
    sex: null,
    name: null,
    age: 0
  },
  classInfo: {
    startTime: -1,
    endTime: -1,
    waitDuration: -1
  },
  bookId: null,
  token: '',
  classKey: '',
  bookKey: ''
};

// ------------------------------------
// Actions
// ------------------------------------
export const requestLogin = createAction(LOGIN_REQUEST, payload => payload);
export const receiveLogin = createAction(LOGIN_SUCCESS, payload => payload);
export const invalidLogin = createAction(LOGIN_FAILURE, payload => payload);
export const doLogout = createAction(LOGOUT, payload => payload);

export const logout = () => {
  return dispatch => {
    _removeToken();
    dispatch(doLogout());
    dispatch(push('/auth/login'));
  };
};

export const setUser = () => {
  return dispatch => {
    const token = _getToken().token;
    const user = {
      loginId: _getToken().loginId,
      memberName: _getToken().memberName,
      memberType: _getToken().memberType
    };

    if (!token || !user.loginId) {
      _removeToken();
      dispatch(doLogout());
    } else {
      dispatch(receiveLogin({ user, token }));
    }
  };
};

export const isAuthenticated = () => {
  return !!_getToken().token;
};

const _getToken = () => {
  return {
    token: localStorage.getItem('token'),
    loginId: localStorage.getItem('loginId'),
    memberName: localStorage.getItem('memberName'),
    memberType: localStorage.getItem('memberType')
  };
};

const _removeToken = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('loginId');
  localStorage.removeItem('memberName');
  localStorage.removeItem('memberType');
};

export const login = (identity, password) => {
  return dispatch => {
    dispatch(requestLogin({ identity, password }));

    FetchPost(API_HOST + API_PATH + '/member/getUserToken', {
      body: JSON.stringify({
        login_id: identity,
        password: password,
        access_key: 'YWNjZXNzS2V5VjAwMDAwMDAwMW1pbmlzY2hvb2wxNDc3NTYwMzAxNDQy',
        secret_key: 'c2VjcmV0S2V5VjAwMDAwMDAwMW1pbmlzY2hvb2wxNDc3NTYwMzYxNTI2'
      })
    })
      .then(res => {
        const token = res.result.token;

        dispatch(
          push({
            pathname: '/home',
            search: `?token=${token}&loginId=${identity}`
          })
        );
      })
      .catch(error => {
        console.log('error: ', error);
        dispatch(invalidLogin(error));
      });
  };
};

export const loginWithToken = token => {
  return dispatch => {
    dispatch(requestLogin({ token }));

    FetchPost(API_HOST + API_PATH + '/member/getUserInfo', {
      body: JSON.stringify({ token })
    })
      .then(res => {
        const token = res.result.token;
        const user = {
          loginId: res.result.login_id,
          memberName: res.result.member_name,
          memberType: res.result.member_type
        };

        dispatch(receiveLogin({ user, token }));
      })
      .catch(err => {
        dispatch(invalidLogin(err));
        dispatch(
          notify.emit({
            type: 'danger',
            title: 'Invalid Credentials',
            message: err.msg
          })
        );
      });
  };
};

export const loginWithTokenAndClassKey = (token, classKey, isPlayer = true) => {
  return dispatch => {
    dispatch(requestLogin());

    const url_params = queryString.parse(location.search);

    const paramObj = {
      token: token,
      class_key: classKey,
      target_device: NativeInterface.getRunningDevice(),
      teacher_character: url_params.tc !== undefined ? url_params.tc : null
    };

    return FetchPost(API_HOST + API_PATH + '/common/baseData', {
      body: JSON.stringify(paramObj)
    })
      .then(res => {
        if (!res.result) return;

        const {
          book,
          teacher: teacherData,
          student: studentData,
          c2ss: c2ssData,
          classInfo: classInfoData,
          comm_resource_info,
          asset_bucket_name,
          connect_no,
          member_type
        } = res.result;

        if (
          !book ||
          !teacherData ||
          !studentData ||
          !c2ssData ||
          !classInfoData
        )
          throw new Error('invalid response');

        MSConfig.assetBucketName = asset_bucket_name;
        MSConfig.connectNo = connect_no;

        // 공통 리소스 설정
        const {
          background_rgb_value,
          ending_teacher_go_url,
          loading_sound_url,
          loading_image_url,
          loading_go_url,
          button_rgb_value,
          text_rgb_value,
          teacher_feedback_url,
          button_text_rgb_value
        } = comm_resource_info;

        const memberType = member_type;
        const bookId = book.book_id;

        MSConfig.backgroundColor = background_rgb_value;
        MSConfig.textColor = text_rgb_value;
        MSConfig.buttonColor = button_rgb_value;
        MSConfig.buttonTxtColor = button_text_rgb_value;
        MSConfig.teacherFeedbackUrl = teacher_feedback_url;
        MSConfig.endingTeacherUrl = ending_teacher_go_url;
        MSConfig.loadingImage = loading_image_url;
        MSConfig.loadingSound = loading_sound_url;
        MSConfig.loadingUrl = loading_go_url;
        pubSub.publish('commonResourceFetched');

        MSError.setUserContext({
          serverUrl: c2ssData.server_url,
          teacherNo: teacherData.teacher_no,
          teacherLoginId: teacherData.login_id,
          studentNo: studentData.student_no
        });

        MSError.setExtraTag({
          token,
          classkey: classKey,
          bookId,
          connectNo: connect_no
        });

        const c2ss = {
          serverUrl: c2ssData.server_url
        };

        const teacher = {
          teacherNo: teacherData.teacher_no,
          loginId: teacherData.login_id,
          name: teacherData.name
        };

        const student = {
          birthday: studentData.birthday,
          parentsName: studentData.parents_name,
          studentNo: studentData.student_no,
          sex: studentData.sex,
          name: studentData.name,
          age: studentData.age
        };

        if (!isPlayer) {
          const classInfo = {};

          return dispatch(
            receiveLogin({
              token,
              classKey,
              memberType,
              bookId,
              c2ss,
              teacher,
              student,
              classInfo
            })
          );
        }

        student.photo = studentData.profile_image_url;
        let classInfo = null;
        const classState = classInfoData.stat_cd;

        if (classInfoData.class_no == -1 && classInfoData.start_time == -1) {
          classInfo = {
            startTime: classInfoData.start_time,
            endTime: classInfoData.end_time,
            waitDuration: classInfoData.wait_duration
          };
        } else {
          classInfo = {
            startTime: classInfoData.start_time * 1000, //now + 10000,//classInfo.startTime,
            endTime: classInfoData.end_time * 1000, //now + 10000 + 30000,//student.endTime,
            waitDuration: classInfoData.wait_duration * 60 //student.waitDuration,
          };

          if (
            classState === CLASS_STATE.ABSENT ||
            classState === CLASS_STATE.FINISHED ||
            classState === CLASS_STATE.ABNORMAL
          ) {
            MSLog({
              code: END_REASON.CLASS_FINISHED,
              error: new Error('class finished')
            });
          } else if (classState === CLASS_STATE.DOING) {
            MSLog({
              code: END_REASON.CLASS_INVALID,
              error: new Error('class already doing')
            });
          } else if (
            classState === CLASS_STATE.RESERVED ||
            classState === CLASS_STATE.READY
          ) {
            const date = new Date();
            const now = date.getTime();

            if (
              classState === CLASS_STATE.RESERVED &&
              now > classInfo.endTime
            ) {
              MSLog({
                code: END_REASON.CLASS_ALREADY_ENDED,
                error: new Error('class ended')
              });
            }

            if (
              memberType === ROLE.TEACHER &&
              classState === CLASS_STATE.READY
            ) {
              MSLog({
                code: END_REASON.CLASS_INVALID,
                error: new Error('class invalid')
              });
            }

            dispatch(playerStateAction.updateClassState(classState));
          } else {
            MSLog({
              code: END_REASON.CLASS_INVALID,
              error: new Error('class invalid')
            });
          }
        }

        dispatch(
          receiveLogin({
            token,
            classKey,
            memberType,
            bookId,
            c2ss,
            teacher,
            student,
            classInfo
          })
        );
      })
      .catch(error => {
        if (error.status == 400) {
          return MSLog({
            errorType: 'fatal',
            code: END_REASON.INVALID_TOKEN,
            error: new Error('invalid token'),
            extraInfo: { token }
          });
        } else if (error.status == 404) {
          return MSLog({
            errorType: 'fatal',
            code: END_REASON.USER_NOT_FOUND,
            error: new Error('user not found'),
            extraInfo: { token }
          });
        } else {
          MSLog({
            errorType: 'fatal',
            code: END_REASON.UNKNOWN_ERROR,
            error,
            extraInfo: { token }
          });
        }
      });
  };
};

export const actions = {
  login,
  isAuthenticated,
  setUser,
  logout,
  loginWithToken,
  loginWithTokenAndClassKey
};

// ------------------------------------
// Reducer
// ------------------------------------
export default handleActions(
  {
    [LOGOUT]: state => {
      return {
        ...state,
        ...initialState
      };
    },
    [LOGIN_REQUEST]: state => {
      return {
        ...state,
        isAuthenticated: false
      };
    },
    [LOGIN_SUCCESS]: (state, { payload }) => {
      return {
        ...state,
        isAuthenticated: true,
        memberType: payload.memberType,
        c2ss: payload.c2ss,
        teacher: payload.teacher,
        student: payload.student,
        bookId: payload.bookId,
        token: payload.token,
        classKey: payload.classKey,
        bookKey: payload.bookKey,
        classInfo: payload.classInfo
      };
    },
    [LOGIN_FAILURE]: (state, { payload }) => {
      return {
        ...state,
        isAuthenticated: false,
        message: payload
      };
    }
  },
  initialState
);

// ------------------------------------
// Selector
// ------------------------------------

const getUser = state => {
  return state.auth.teacher;
};

const getToken = state => {
  return state.auth.token;
};

const getAuth = state => {
  return state.auth;
};

export const selectors = {
  getUser,
  getToken,
  getAuth
};
