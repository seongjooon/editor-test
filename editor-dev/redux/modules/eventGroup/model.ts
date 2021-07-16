import * as Type from './actionTypes';
import { FADE_TYPE } from '../../../constants/msConstant';

import { Model, many, fk, attr } from 'redux-orm';
import _ from 'lodash';

class EventGroup extends Model {
  static reducer(action, EventGroup, session) {
    const { payload, type } = action;
    const { Page } = session;

    switch (type as Type.EventGroupActionTypes) {
      case Type.EVENTGROUP_ADD: {
        //새 이벤트그룹 생성
        const { title } = payload;
        const newEventGroup = this.create({ ...payload });
        //page에 추가
        const page = Page.all().toModelArray()[0];
        page.eventGroups.add(newEventGroup);
        //@TODO: 나중에 주석 해제
        this.select(newEventGroup.id);
        break;
      }
      case Type.EVENTGROUP_DELETE: {
        //@TODO: 나중에 주석 해제
        const { id } = payload;
        if (!this.withId(id)){
          console.error('ERR: id not exist')
          return;
        } 

        this.select(null);
        const eventGroup = this.withId(id);

        //@TODO: 나중에 주석 해제
        eventGroup.deleteLinkedScripts(id);
        eventGroup.delete();

        // console.log(eventGroup, eventGroup.events.withId())

        //@ts-ignore
        break;
        //@TODO: 나중에 리팩토링
        // Page.getSelected()
        //   .components.toModelArray()
        //   .forEach((com) => {
        //     if (com.imageComponent !== null) {
        //       const copied_behaviors = [...com.imageComponent.behaviors];

        //       copied_behaviors.forEach((b, i) => {
        //         const copied_behavior = { ...b };

        //         if (copied_behavior.name === 'Magnetic') {
        //           if (copied_behavior.eventId === eventGroupId) {
        //             copied_behavior.eventId = null;
        //           }
        //         }
        //         copied_behaviors[i] = copied_behavior;
        //       });

        //       com.imageComponent.behaviors = copied_behaviors;
        //     }
        //   });
      }
      case Type.EVENTGROUP_SORT: {
        //load
        break;
      }
      case Type.EVENTGROUP_SELECT: {
        //load
        break;
      }
      case Type.EVENTGROUP_CLONE: {
        //load
        break;
      }
      case Type.EVENTGROUP_UPDATE_TITLE: {
        const { title, id } = payload;
        if (!this.withId(id)){
          console.error('ERR: id not exist')
          return;
        } 
        const event_group = EventGroup.all().toModelArray()[id - 1];
        event_group.title = title;
        //@TODO: 나중에 주석 해제
        // event_group.updateLinkedScripts(event_group.id, title);
        break;
      }
      case Type.EVENTGROUP_UPDATE_SYNC: {
        //load
        break;
      }
    }
  }

  static parse(data) {
    //@ts-ignore
    const { Event } = this.session;
    const clonedData = { ...data };

    if (clonedData.events) clonedData.events = clonedData.events.map((event) => Event.parse(event));

    return this.upsert(clonedData);
  }

  static select(id) {
    //@ts-ignore
    const { AppState } = this.session;
    AppState.selectEventGroup(id);
  }

  static getSelected() {
    //@ts-ignore
    const { AppState } = this.session;
    const selectedId = AppState.getSelectedEventGroupId();
    if (selectedId === null) return null;
    else return this.withId(selectedId);
  }

  deleteLinkedScripts() {
    //@ts-ignore
    const { Page } = this.getClass().session;
    console.log('@@@@@@@', Page.getSelected())
    const scripts = Page.getSelected().sortedScripts.toModelArray();
    //@TODO: 대본에 등록된 이벥트 제거
    scripts.forEach((script) => {
      // script.deleteEventGroup(id);
    });
  }

  updateLinkedScripts(id, title) {
    //@ts-ignore
    const { Event, Page } = this.session;

    const scripts = Page.getSelected().sortedScripts.toModelArray();
    scripts.forEach((script) => {
      script.updateEventGroupTitle(id, title);
    });
  }

  //@TODO: 삭제함
  delete() {
    //@ts-ignore
    this.events.toModelArray().forEach((item) => {
      item.delete();
    });

    super.delete();
  }
}

EventGroup.modelName = 'EventGroup';

EventGroup.fields = {
  id: attr(),
  title: attr(),
  events: many('Event', 'eventGroups'),
  egSync: attr(),
  zIndex: attr(),
};

//@ts-ignore
EventGroup.defaultProps = {
  events: [],
  egSync: true,
  zIndex: 0,
};

export default EventGroup;
