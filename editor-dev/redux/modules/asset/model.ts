import * as Type from './actionTypes';
import { FADE_TYPE } from '../../../constants/msConstant';

import { Model, many, fk, attr } from 'redux-orm';
import _ from 'lodash';

class Asset extends Model {
  static reducer(action, Asset, session) {
    const { Book, PageGroup, Page } = session;
    const { payload, type } = action;

    switch (type as Type.AssetActionTypes) {
      case Type.ASSET_CREATE: {
        const newData = { 
          ...Asset.defaultProps, 
          ...payload 
        };
        this.create(newData);
        break;
      }
      case Type.ASSET_UPDATE: {
        const { id } = payload;
        if (!this.idExists(id)) return;
        const newData = { ...payload };

        this.upsert(newData);
        break;
      }
    }
  }

  static parse(data) {
    const clonedData = { ...data };
    return this.upsert(clonedData);
  }

  delete() {
    super.delete();
  }

  //total file size
  static totalFileSize() {
    // return sumBy(this.all().toRefArray(), function(o) {
    //   return Number(o.fileSize);
    // });
  }

  static allOrderByPage() {}
}

Asset.modelName = 'Asset';

Asset.fields = {
  id: attr(),
  src: attr(),
  sourceType: attr(),
  assetType: attr(),
  createdDate: attr(),
  title: attr(),
  fileSize: attr(),
};

//@ts-ignore
Asset.defaultProps = {
  createdDate: '',
};

export default Asset;
