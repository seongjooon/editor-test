import orm from '../orm';
import { createSelector } from 'redux-orm';

export const selectComponents = createSelector(orm, session => {
    return session.Component.all().toRefArray();
})


export const getAllImageComponents = createSelector(orm, session => {
    return session.ImageComponent.all().toRefArray();
})

export const getAllVideoComponents = createSelector(orm, session => {
    return session.VideoComponent.all().toRefArray();
})
