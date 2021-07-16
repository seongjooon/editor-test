import orm from '../orm';
import { createSelector } from 'redux-orm';
import { OrmSession } from 'redux-orm/Session';
import AppState from './model';

export const getAllAppState = createSelector(orm, (session: OrmSession<any>) => {
  return session.AppState.all().toRefArray();
})