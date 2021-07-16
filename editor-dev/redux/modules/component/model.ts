import * as Type from './actionTypes';
import { COMPONENT_TYPE } from '../../../constants/msConstant';

import { Model, many, fk, attr, oneToOne } from 'redux-orm';
import _ from 'lodash';

interface Component {
  imageComponent: any;
  videoComponent: any;
}

class Component extends Model {
  static parse(data) {
    //@ts-ignore
    const { ImageComponent, VideoComponent } = this.session;
    const clonedData = { ...data };

    if (clonedData.imageComponent) {
      //@ts-ignore
      clonedData.imageComponent = ImageComponent.parse(clonedData.imageComponent);
    }

    if (clonedData.videoComponent) {
      clonedData.videoComponent = VideoComponent.parse(clonedData.videoComponent);
    }

    return this.upsert(clonedData);
  }

  static select(id: number) {
    //@ts-ignore
    const { AppState } = this._session;
    AppState.selectComponent(id);
  }

  //getSelectedComponent
  static getSelected() {
    //@ts-ignore
    const { AppState } = this.session;
    const selectedId = AppState.getSelectedComponentId();
    if (selectedId === null) return null;
    else return this.withId(selectedId);
  }

  delete() {
    if (this.imageComponent !== null) this.imageComponent.delete();
    if (this.videoComponent !== null) this.videoComponent.delete();

    super.delete();
  }

  static reducer(action, Component, session) {
    const { payload, type } = action;
    const { Page, AppState, ImageComponent, VideoComponent, Asset } = session;

    switch (type as Type.ComponentActionTypes) {
      //image 추가
      case Type.COMPONENT_ADD_IMAGE: {
        const { asset, width, height, x, y } = payload;

        //Asset 생성
        // const newAsset = Asset.create(asset);
        const newAsset = Asset.withId(55);

        //ImageComponent 생성
        const newImageComponent = ImageComponent.create({
          asset: newAsset,
          width,
          height,
        });

        //새 Component 객체 생성
        const newComponent = this.create({
          ...Component.defaultProps,
          type: COMPONENT_TYPE.Image,
          title: newAsset.title,
          width,
          height,
          x,
          y,
          imageComponent: newImageComponent,
        });
        console.log('@@@@ asset---', Asset.withId(55).title);
        console.log('@@@@ asset', newComponent);
        //생성된 페이지 추가하기
        const page = Page.getSelected();
        page.components.add(newComponent);
        break;
      }

      //character 추가
      case Type.COMPONENT_ADD_CHARACTER: {
        const { width, height, x, y } = payload;

        // create com
        const newComponent = this.create({
          ...Component.defaultProps,
          type: COMPONENT_TYPE.Character,
          title: 'test character',
          width: width,
          height: height,
          x: x,
          y: y,
        });
        const page = Page.getSelected();
        page.components.add(newComponent);
        break;
      }
      //학생 화면 추가
      case Type.COMPONENT_ADD_STUDENT_VIEW: {
        const { width, height, x, y } = payload;

        // create com
        const newComponent = this.create({
          ...Component.defaultProps,
          type: COMPONENT_TYPE.StudentView,
          title: 'studentView',
          width: width,
          height: height,
          x: x,
          y: y,
        });
        const page = Page.getSelected();
        page.components.add(newComponent);
        break;
      }
      //교사 화면 추가
      case Type.COMPONENT_ADD_TEACHER_VIEW: {
        const { width, height, x, y } = payload;

        // create com
        const newComponent = this.create({
          ...Component.defaultProps,
          type: COMPONENT_TYPE.TeacherView,
          title: 'teacherView',
          width: width,
          height: height,
          x: x,
          y: y,
        });
        const page = Page.getSelected();
        page.components.add(newComponent);
        break;
      }

      //동영상 추가
      case Type.COMPONENT_ADD_VIDEO: {
        const { asset, width, height, x, y } = payload;

        //Asset 생성
        // const newAsset = Asset.create(asset);
        const newAsset = Asset.withId(58);

        const newVideoComponent = VideoComponent.create({
          asset: newAsset,
          width,
          height,
        });

        //새 Component 객체 생성
        const newComponent = this.create({
          ...Component.defaultProps,
          type: COMPONENT_TYPE.Video,
          title: newAsset.title,
          width,
          height,
          x,
          y,
          videoComponent: newVideoComponent,
        });

        //생성된 페이지 추가하기
        const page = Page.getSelected();
        page.components.add(newComponent);
        break;
      }

      case Type.COMPONENT_UPDATE_IMAGE: {
        const { asset, width, height, id } = payload;
        if (!this.withId(id)) {
          console.error('ERR: id not exist');
          return;
        }

        //기존에있던 이미지 삭제
        // const component = this.getSelected();
        const component = this.withId(id);
        // 덮어씌우기때문에 굳이 삭제할 필요 없음 >> 추후 문제되면 해결
        // component.imageComponent.delete();

        //새 asset 생성
        const newAsset = Asset.create(asset);

        //ImageComponent 생성
        const newImageComponent = ImageComponent.create({
          asset: newAsset,
          width,
          height,
        });

        component.title = 'updated imageComponent';
        //현재 component의 imageCompoet 교체
        component.imageComponent = newImageComponent;
        break;
      }

      case Type.COMPONENT_UPDATE_VIDEO: {
        const { asset, width, height, id } = payload;
        if (!this.withId(id)) {
          console.error('ERR: id not exist');
          return;
        }

        const component = this.withId(id);
        // component.videoComponent.delete();

        const newAsset = Asset.create(asset);
        const newVideoComponent = VideoComponent.create({
          asset: newAsset,
          width,
          height,
        });

        component.title = 'updated videoComponent';
        component.videoComponent = newVideoComponent;
        break;
      }

      case Type.COMPONENT_DELETE: {
        const { id } = payload;
        if (!this.withId(id)) {
          console.error('ERR: id not exist');
          return;
        }

        this.withId(id).delete();
        // this.adjustZIndex();
        break;
      }
      default:
        break;
    }
  }
}

Component.modelName = 'Component';

Component.fields = {
  id: attr(),
  type: attr(),
  title: attr(),
  width: attr(),
  height: attr(),
  x: attr(),
  y: attr(),
  angle: attr(),
  opacity: attr(),
  visible: attr(),
  lock: attr(),
  dragable: attr(),
  global: attr(),
  blendMode: attr(),
  userInteraction: attr(),
  zIndex: attr(),
  // component
  imageComponent: oneToOne('ImageComponent'), // imageComponent id
  videoComponent: oneToOne('VideoComponent'), // videocomponent id
  // event
  onMouseClick: fk('EventGroup', 'components_onMouseClick'),
  onMouseOver: fk('EventGroup', 'components_onMouseOver'),
};

//@ts-ignore
Component.defaultProps = {
  width: 300,
  height: 300,
  x: 500,
  y: 500,
  angle: 0,
  opacity: 1,
  visible: true,
  lock: false,
  dragable: false,
  global: false,
  blendMode: 0,
  userInteraction: true,
  zIndex: 0,
  imageComponent: null,
  videoComponent: null,
  onMouseClick: null,
  onMouseOver: null,
};

export default Component;

/**
 * 
 * 
 *  const addComponent = (type, title) => {
      const { width, height, x, y } = payload;
      let newAsset = null;
      let comp = null;

      if (type === COMPONENT_TYPE.Image || type === COMPONENT_TYPE.Video) {
        newAsset = Asset.create(payload.asset);
        const _componentModel = type === COMPONENT_TYPE.Image ? ImageComponent : VideoComponent;
        comp = _componentModel.create({
          asset: newAsset,
          width,
          height,
        });
      }

      //새 Component 객체 생성
      const component = this.create({
        type,
        title,
        width,
        height,
        x,
        y,
      });

      if (type === COMPONENT_TYPE.Image) component.imageComponent = comp;
      if (type === COMPONENT_TYPE.Video) component.videoComponent = comp;

      //생성된 페이지 추가하기
      const page = Page.getSelected();
      page.components.add(component);
    };

    const createImageComponent = (asset, width, height) => {
      const _asset = Asset.create(asset);

      //ImageComponent 생성
      const imageComponent = ImageComponent.create({
        asset: _asset,
        width,
        height,
      });

      return imageComponent;
    };

    const createVideoComponent = (asset, width, height) => {
      const _asset = Asset.create(asset);

      //ImageComponent 생성
      const videoComponent = VideoComponent.create({
        asset: _asset,
        width,
        height,
      });

      return videoComponent;
    };
 */
