/**
 * Created by neo on 2016. 11. 15..
 */

// @flow

/*********
 * LIB
 */
// redux
import { Model, attr } from 'redux-orm';
import { createAction } from 'redux-actions';
import propTypesMixin from 'redux-orm-proptypes';
import Loader from 'redux/middleware/Loader';

// util
import { sumBy, isUndefined } from 'lodash';
import MSConfig from 'constants/msConfig';

/*******
 * LOCAL
 */
import * as CT from 'constants/msConstant';
// type
import type { ComponentModel, ImageModel } from '../component';
/********
 * Type
 */

export type AssetRef = {
  id?: number,
  src: string,
  sourceType: any,
  assetType: any,
  createdDate: string,
  title: string,
  fileSize?: number
};

export type AssetModel = Asset;

/*****************
 * Constant
 */
export const CREATE = 'minischool/asset/CREATE';
export const UPDATE = 'minischool/asset/UPDATE';

/***********************
 *  Action
 */
const _create = createAction(CREATE, (payload: AssetModel) => payload);
const _update = createAction(
  UPDATE,
  (payload: { fieldName: string, value: any }) => payload
);

export const createAsset = (payload: AssetModel) => {
  return (dispatch: any) => {
    dispatch(_create(payload));
  };
};

export const actions = {
  createAsset
};

/***************
 * Reducer
 */

const ValidatingModel = propTypesMixin(Model);

export class Asset extends ValidatingModel {
  props: AssetRef;

  toJSON() {
    return { ...this.ref };
  }

  clone() {
    const clonedData = { ...this.ref };
    delete clonedData.id;

    const { Asset } = this.getClass().session;
    return Asset.create(clonedData);
  }

  delete() {
    super.delete();
  }

  static create(props: any) {
    // create
    const newAsset = super.create(props);
    const s3Url = MSConfig.getAssetUrlByDeviceType(props.src, props.assetType);
    const asset = {
      id: newAsset.id,
      src: s3Url
    };

    Loader.addAsset(asset);
    return newAsset;
  }

  static totalFileSize() {
    return sumBy(this.all().toRefArray(), function(o) {
      return Number(o.fileSize);
    });
  }

  static allOrderByPage(): Array<AssetModel> {
    const { Book, PageGroup, Page } = this.session;

    let allAsset = [];

    Book.getSelected()
      .sortedPageGroups.toModelArray()
      .map(pageGroup => {
        pageGroup.sortedPages.toModelArray().map(page => {
          // bgImage / bgSound
          if (!isUndefined(page.bgImage) && page.bgImage)
            allAsset.push(page.bgImage.ref);
          if (!isUndefined(page.bgSound) && page.bgSound)
            allAsset.push(page.bgSound.ref);

          page.eventGroups.toModelArray().forEach(eventGroup => {
            eventGroup.events.toModelArray().forEach(event => {
              if (!isUndefined(event.asset) && event.asset) {
                allAsset.push(event.asset.ref);
              }
            });
          });

          page.sortedComponents
            .toModelArray()
            .map((component: ComponentModel) => {
              if (component.type === 'image') {
                const {
                  imageComponent
                }: { imageComponent: ImageModel } = component;
                allAsset.push(imageComponent.asset.ref);

                imageComponent.imageList.toModelArray().forEach(asset => {
                  allAsset.push(asset.ref);
                });
              } else if (component.videoComponent !== null)
                allAsset.push(component.videoComponent.asset.ref);
            });
        });
      });

    return allAsset;
  }

  static parse(data) {
    const clonedData = { ...data };
    return this.upsert(clonedData);
  }

  static import(data) {
    const clonedData = { ...data };

    console.log('NEO Aset ', data);

    delete clonedData.id;
    // delete clonedData.zIndex;

    return this.upsert(clonedData);
  }

  static reducer(action, Asset, session) {
    const { payload, type } = action;

    switch (type) {
      case CREATE: {
        Asset.create(payload);
        break;
      }
      case UPDATE: {
        const { fieldName, value } = payload;
        const assetState = this.withId(0);
        assetState.set(fieldName, value);
        break;
      }
    }
  }
}

Asset.modelName = 'Asset';

Asset.fields = {
  id: attr(),
  src: attr(),
  sourceType: attr(),
  assetType: attr(),
  createdDate: attr(),
  title: attr(),
  fileSize: attr()
};

Asset.defaultProps = {
  createdDate: ''
};

export default Asset;
