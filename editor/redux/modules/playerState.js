/**
 * Created by neo on 2016. 11. 16..
 */

/*********
 * LIB
 */
// redux
import update from 'immutability-helper';
import { createAction, handleActions } from 'redux-actions';

/*******
 * LOCAL
 */
import type {
  PlayerState,
  PlayerConfig,
  ConnectionState,
  PeerInfo
} from '../../constants/C2Type';
// redux
//import {notifyActions} from 'redux/modules';

/**********
 * Constants
 */
const CONNECTION_STATE_UPDATE = 'CONNECTION_STATE_UPDATE';
const PEER_ADD = 'PEER_ADD';
const PEER_DELETE = 'PEER_DELETE';
const CONFIG_RECEIVE = 'CONFIG_RECEIVE';
const EVENT_LOG_ADD = 'EVENT_LOG_ADD';
const ROOM_UPDATE = 'ROOM_UPDATE';
const PEERS_UPDATE = 'PEERS_UPDATE';
const CLASS_STATE_UPDATE = 'CLASS_STATE_UPDATE';
const SCRIPTER_OPEN = 'SCRIPTER_OPEN';

export const CLASS_STATE = {
  NONE: 'NONE',
  RESERVED: 'RESERVED',
  READY: 'READY',
  DOING: 'DOING',
  FINISHED: 'FINISHED',
  ABSENT: 'ABSENT',
  ABNORMAL: 'ABNORMAL'
};

const initialState: PlayerState = {
  connectionState: {
    id: '',
    alias: '',
    isLogin: false,
    isHost: false,
    isInRoom: false,
    isConnected: false
  },
  classState: 'NONE',
  roomState: {
    roomName: '',
    peers: []
  },
  config: {
    signalServer: '',
    iceServer: [],
    gameName: 'ms_game',
    instanceName: 'ms_instance'
  },
  isOpenScripter: false,
  cdr: {
    events: []
  }
};

/***********************
 *  Action
 */
const _updateConnectionState = createAction(
  CONNECTION_STATE_UPDATE,
  payload => payload
);
const _addPeer = createAction(PEER_ADD, payload => payload);
const _deletePeer = createAction(PEER_DELETE, payload => payload);
const _receiveConfig = createAction(CONFIG_RECEIVE, payload => payload);
const _addEvent = createAction(EVENT_LOG_ADD, payload => payload);
const _updateRoom = createAction(ROOM_UPDATE, payload => payload);
const _updatePeers = createAction(PEERS_UPDATE, payload => payload);
const _openScripter = createAction(SCRIPTER_OPEN, payload => payload);
const _updateClassState = createAction(CLASS_STATE_UPDATE, payload => payload);

const updatePeers = (peers: Array<PeerInfo>) => {
  //console.log('updatePeers 111', peers);
  return dispatch => {
    //console.log('updatePeers 2222', peers);
    dispatch(_updatePeers(peers));
  };
};

const updateRoom = (roomName: string) => {
  return dispatch => {
    dispatch(_updateRoom(roomName));
  };
};

const updateConnectionSate = (state: ConnectionState) => {
  return dispatch => {
    dispatch(_updateConnectionState(state));
  };
};

const addPeer = (peer: PeerInfo) => {
  return dispatch => {
    dispatch(_addPeer(peer));
  };
};

const deletePeer = (peerId: string) => {
  return dispatch => {
    dispatch(_deletePeer(peerId));
  };
};

const receiveConfig = (config: PlayerConfig) => {
  return dispatch => {
    dispatch(_receiveConfig(config));
  };
};

const addEvent = (event: string) => {
  return dispatch => {
    dispatch(_addEvent(event));
  };
};

// const goBack = (msError) => {
//
//     return (dispatch) => {
//         dispatch(notifyActions.emit(msError));
//     };
//
// };

const openScripter = (isOpen: boolean) => {
  return dispatch => {
    dispatch(_openScripter(isOpen));
  };
};

const updateClassState = (state: string) => {
  return dispatch => {
    dispatch(_updateClassState(state));
  };
};

////////////////////////////////

export const actions = {
  updateConnectionSate,
  addPeer,
  deletePeer,
  receiveConfig,
  addEvent,
  updateRoom,
  updatePeers,
  //goBack,
  openScripter,
  updateClassState
};

/***************
 * Reducer
 */
export default handleActions(
  {
    [CONNECTION_STATE_UPDATE]: (state, { payload }) => {
      return {
        ...state,
        connectionState: payload
      };
    },
    [CLASS_STATE_UPDATE]: (state, { payload }) => {
      return {
        ...state,
        classState: payload
      };
    },
    [CONFIG_RECEIVE]: (state, { payload }) => {
      return {
        ...state,
        config: payload
      };
    },
    [EVENT_LOG_ADD]: (state, { payload }) => {
      return {
        state: update(state, {
          cdr: { events: { $push: [payload] } }
        })
      };
    },
    [ROOM_UPDATE]: (state, { payload }) => {
      return update(state, {
        roomState: { roomName: { $set: payload } }
      });
    },
    [PEERS_UPDATE]: (state, { payload }) => {
      return update(state, {
        roomState: { peers: { $set: payload } }
      });
    },
    [SCRIPTER_OPEN]: (state, { payload }) => {
      return {
        ...state,
        isOpenScripter: payload
      };
    }
  },
  initialState
);

/*************************
 * Selector
 */

const isPeerOnline = (state: PlayerState) => {
  if (state.playerState.roomState.peers.length > 0) return true;
  else false;
};

const isOpenScripter = state => {
  return state.playerState.isOpenScripter;
};

export const selectors = {
  isPeerOnline,
  isOpenScripter
};
