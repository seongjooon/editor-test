/**
 * Root Reducer
 */

 import { combineReducers } from 'redux';
 import { createReducer } from 'redux-orm';
 import orm from './modules/orm';
 
 const rootReducer = combineReducers({
     orm: createReducer(orm)
 })
 
 export default rootReducer;