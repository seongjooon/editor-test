import orm from '../orm';
import { createSelector } from 'redux-orm';
import ORM, { OrmState } from 'redux-orm/ORM';
import { EventModel } from '../../../interface/redux/model';
import { Selector } from 'redux-orm/redux';
import { OrmSession } from 'redux-orm/Session';

// OrmState<IndexedModelClasses<any, any>>
//Selector<OrmState<unknown>, any>

export const selectEvents: Selector<OrmState<any>, any> = createSelector(orm, session => {
    return (session as OrmSession<any>).Event.all().toRefArray();
})