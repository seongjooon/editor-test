import { FADE_TYPE } from '../../../constants/msConstant';

import { Model, many, fk, attr } from 'redux-orm';
import * as Type from './actionTypes';
import _ from 'lodash';
import { Action } from 'redux-actions';
import { EventModel } from '../../../interface/redux/model';
import Page from '../page/model';

class Event extends Model {
  static reducer(action, Event, session): void {
    const { payload, type } = action;
    const { Asset, EventGroup } = session;

    switch (type as Type.EventActionTypes) {
      case Type.EVENT_ADD: {
        const { asset } = payload;
        let newAssetId = null;

        if (payload.hasOwnProperty('asset') && asset !== null) {
          //asset id 없으면 asset create한 뒤 저장
          if (asset.id === undefined) {
            newAssetId = Asset.create(payload.asset);
          } else {
            newAssetId = asset.id;
          }
        }

        const event = this.create({
          ...payload,
          asset: newAssetId,
        });
        // eventGroup에 event 저장
        // const eventGroup = EventGroup.getSelected();
        const eventGroup = EventGroup.all().toModelArray()[0];
        console.log(eventGroup);
        if (eventGroup !== null) eventGroup.events.add(event);
        break;
      }
      case Type.EVENT_DELETE: {
        const { id } = payload;
        if (!this.idExists(id)) return;

        this.withId(id).delete();
        break;
      }
      case Type.EVENT_UPDATE: {
        const { id, asset } = payload;
        if (!this.idExists(id)) return;

        //해당 아이디의 이벤트 획득
        const event = this.withId(id);

        //이벤트에 asset있으면 asset upsert한뒤 upsert
        let newAsset = null;
        if (event.asset !== null) {
          newAsset = Asset.upsert({
            ...asset,
            id: event.asset.id,
          });
        }
        this.upsert({
          ...payload,
          asset: newAsset,
        });
        break;
      }
      case Type.EVENT_SORT: {
        //load
        break;
      }
      default:
        break;
    }
  }

  static parse(data: EventModel) {
    //@ts-ignore
    const { Asset } = this.session;
    const clonedData: any = { ...data };

    if (clonedData.asset) clonedData.asset = Asset.parse(clonedData.asset);

    return this.upsert(clonedData);
  }

  //eventGroup 삭제시 asset, event도 삭제
  delete(): void {
    //@ts-ignore
    if (this.asset !== null) this.asset.delete();
    //@ts-ignore @TODO: asset null
    console.log('@@@ asset', this.asset);
    super.delete();
  }

  deleteByEventGroup(id): void {
    if (!Event.withId(id)) return;

    Event.withId(id).delete();
  }
}

Event.modelName = 'Event';

Event.fields = {
  id: attr(),
  name: attr(),
  action: attr(),
  property: attr(),
  target: many('Component', 'eventTargets'),
  asset: fk('Asset'),
  zIndex: attr(),
  components: many('Component'),
};

//@ts-ignore
Event.defaultProps = {
  target: null,
  asset: null,
  zIndex: 0,
};

export default Event;
