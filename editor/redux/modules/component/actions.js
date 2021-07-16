/**
 * Created by neo on 2016. 11. 15..
 */
/*********
 * LIB
 */
// redux
import { Model, oneToOne, attr, fk } from 'redux-orm';
import propTypesMixin from 'redux-orm-proptypes';
import { createAction } from 'redux-actions';
// util
import { isNil, maxBy } from 'lodash';

// constants
import Language from 'constants/Language';

/*******
 * LOCAL
 */
import { COMPONENT_TYPE } from 'constants/msConstant';
// type
import type { ImageModel } from './imageComponent';
import type { VideoModel } from './videoComponent';
import type { EventGroupModel } from 'redux/modules/eventGroup/actions';
import type { AssetModel } from 'redux/modules/asset/actions';

/*********
 * Canvas callback
 */
export const canvasHandler = {
  active: false,
  onAdd: null,
  onDelete: null,
  onSelect: null,
  onSort: null,
  onUpdate: null,
  onImageChange: null
};

/**************
 * Type
 */
export type ComponentRef = {
  id: number,
  type: string,
  title: string,
  // visible
  width: number,
  height: number,
  x: number,
  y: number,
  angle: number,
  opacity: number,
  visible: boolean,
  lock: boolean,
  dragable: boolean,
  global: boolean,
  blendMode: number,
  userInteraction: true,
  zIndex: number,
  // component
  imageComponent: ?number | ?ImageModel,
  videoComponent: ?number | ?VideoModel,
  // event
  onMouseClick: ?number | ?EventGroupModel,
  onMouseOver: ?number | ?EventGroupModel
};

export type ComponentModel = Component & ComponentRef;

export type ComponentCanvas = {
  id: number,
  type: string,
  width: number,
  height: number,
  x: number,
  y: number,
  angle: number,
  opacity: number,
  visible: boolean,
  lock: boolean,
  dragable: boolean,
  global: boolean,
  blendMode: number,
  userInteraction: true,
  zIndex: number,
  assetId: number,
  src: string,
  c2Data: ?any
};

/*****************
 * Constant
 */
// new action type
const ADD_IMAGE = 'minischool/component/ADD_IMAGE';
const ADD_VIDEO = 'minischool/component/ADD_VIDEO';
const ADD_CHARACTER = 'minischool/component/ADD_CHARACTER';
const ADD_TEACHER_VIEW = 'minischool/component/ADD_TEACHER_VIEW';
const ADD_STUDENT_VIEW = 'minischool/component/ADD_STUDENT_VIEW';
const UPDATE_IMAGE = 'minischool/component/UPDATE_IMAGE';
const UPDATE_VIDEO = 'minischool/component/UPDATE_VIDEO';

const DELETE = 'minischool/component/DELETE';
const SORT = 'minischool/component/SORT';
const SELECT = 'minischool/component/SELECT';
const CLONE = 'minischool/component/CLONE';
const UPDATE_POSITION = 'minischool/component/UPDATE_POSITION';
const UPDATE_SCALE = 'minischool/component/UPDATE_SCALE';
const UPDATE_ANGLE = 'minischool/component/UPDATE_ANGLE';
const UPDATE_FIELD = 'minischool/component/UPDATE_FIELD';
const UPDATE_BEHAVIOR = 'minischool/component/UPDATE_BEHAVIOR';

const DONE_CANVAS_UPDATE = 'minischool/component/DONE_CANVAS_UPDATE';
const COPY_COMPONET = 'minischool/component/COPY_COMPONENT';

/***********************
 *  Action
 */

const _addImageComponent = createAction(
  ADD_IMAGE,
  (payload: {
    asset: AssetModel,
    width: number,
    height: number,
    x: number,
    y: number
  }) => payload
);
const _addVideoComponent = createAction(
  ADD_VIDEO,
  (payload: {
    asset: AssetModel,
    width: number,
    height: number,
    x: number,
    y: number
  }) => payload
);
const _addCharacter = createAction(
  ADD_CHARACTER,
  (payload: { width: number, height: number, x: number, y: number }) => payload
);
const _addTeacherView = createAction(
  ADD_TEACHER_VIEW,
  (payload: { width: number, height: number, x: number, y: number }) => payload
);
const _addStudentrView = createAction(
  ADD_STUDENT_VIEW,
  (payload: { width: number, height: number, x: number, y: number }) => payload
);
const _updateImageComponent = createAction(
  UPDATE_IMAGE,
  (payload: { asset: AssetModel, width: number, height: number }) => payload
);
const _updateVideoComponent = createAction(
  UPDATE_VIDEO,
  (payload: { asset: AssetModel, width: number, height: number }) => payload
);

const _delete = createAction(DELETE, (payload: { id: number }) => payload);
const _sort = createAction(
  SORT,
  (payload: { fromIndex: number, toIndex: number }) => payload
);
const _select = createAction(SELECT, (payload: { id: number }) => payload);
const _clone = createAction(CLONE, (payload: { id: number }) => payload);
const _updatePosition = createAction(
  UPDATE_POSITION,
  (payload: { x: number, y: number }) => payload
);
const _updateScale = createAction(
  UPDATE_SCALE,
  (payload: { width: number, height: number }) => payload
);
const _updateAngle = createAction(
  UPDATE_ANGLE,
  (payload: { width: number, height: number }) => payload
);

const _doneCanvasUpdate = createAction(DONE_CANVAS_UPDATE);
const _updateField = createAction(
  UPDATE_FIELD,
  (payload: { fieldName: string, value: any }) => payload
);
const _copyComponent = createAction(
  COPY_COMPONET,
  (payload: { id: number, title: string }) => payload
);
const _updateBehavior = createAction(
  UPDATE_BEHAVIOR,
  (payload: { componentId: number, behaviors: any }) => payload
);

export const addCharacterComponent = (
  width: number,
  height: number,
  x: number,
  y: number
) => {
  return (dispatch: any, getState: any, orm: any) => {
    dispatch(_addCharacter({ width, height, x, y }));
    const { Component } = orm.session(getState().orm);
    const addedComponent = Component.all().last();
    if (canvasHandler.active) {
      canvasHandler.onAdd(addedComponent.getDataForCanvas());
    }
    // select
    dispatch(selectComponent(addedComponent.id));
  };
};

export const addTeacherComponent = (
  width: number,
  height: number,
  x: number,
  y: number
) => {
  return (dispatch: any, getState: any, orm: any) => {
    dispatch(_addTeacherView({ width, height, x, y }));
    const { Component } = orm.session(getState().orm);
    const addedComponent = Component.all().last();
    if (canvasHandler.active) {
      canvasHandler.onAdd(addedComponent.getDataForCanvas());
    }
    // select
    dispatch(selectComponent(addedComponent.id));
  };
};

export const addStudentComponent = (
  width: number,
  height: number,
  x: number,
  y: number
) => {
  return (dispatch: any, getState: any, orm: any) => {
    dispatch(_addStudentrView({ width, height, x, y }));
    const { Component } = orm.session(getState().orm);
    const addedComponent = Component.all().last();
    if (canvasHandler.active) {
      canvasHandler.onAdd(addedComponent.getDataForCanvas());
    }
    // select
    dispatch(selectComponent(addedComponent.id));
  };
};

export const addImageComponent = (
  asset: AssetModel,
  width: number,
  height: number,
  x: number,
  y: number
) => {
  return (dispatch: any, getState: any, orm: any) => {
    dispatch(_addImageComponent({ asset, width, height, x, y }));
    const { Component } = orm.session(getState().orm);
    const addedComponent = Component.all().last();
    if (canvasHandler.active) {
      canvasHandler.onAdd(addedComponent.getDataForCanvas());
    }
    // select
    dispatch(selectComponent(addedComponent.id));
  };
};

export const addVideoComponent = (
  asset: AssetModel,
  width: number,
  height: number,
  x: number,
  y: number
) => {
  return (dispatch: any, getState: any, orm: any) => {
    dispatch(_addVideoComponent({ asset, width, height, x, y }));
    const { Component } = orm.session(getState().orm);
    const addedComponent = Component.all().last();
    if (canvasHandler.active) {
      canvasHandler.onAdd(addedComponent.getDataForCanvas());
    }
    // select
    dispatch(selectComponent(addedComponent.id));
  };
};

export const updateImageComponent = (
  asset: AssetModel,
  width: number,
  height: number
) => {
  return (dispatch: any, getState: any, orm: any) => {
    dispatch(_updateImageComponent({ asset, width, height }));
    if (canvasHandler.active) {
      const { Component } = orm.session(getState().orm);
      const component = Component.getSelected();
      if (component !== null) {
        canvasHandler.onImageChange(component.getDataForCanvas());
      }
    }
  };
};

export const updateVideoComponent = (
  asset: AssetModel,
  width: number,
  height: number
) => {
  return (dispatch: any) => {
    dispatch(_updateVideoComponent({ asset, width, height }));
  };
};

export const deleteComponent = (id: number) => {
  return (dispatch: any, getState: any, orm: any) => {
    dispatch(selectComponent(null));

    if (canvasHandler.active) {
      const { Component } = orm.session(getState().orm);
      const deletedComponent = Component.withId(id).ref;
      canvasHandler.onDelete(deletedComponent);
    }

    dispatch(_delete({ id }));
  };
};

export const sortComponent = (fromIndex: number, toIndex: number) => {
  return (dispatch: any) => {
    dispatch(_sort({ fromIndex, toIndex }));

    if (canvasHandler.active) {
      setTimeout(() => {
        canvasHandler.onSort();
      }, 0);
    }
  };
};

export const selectComponent = (id: number) => {
  return (dispatch: any, getState: any, orm: any) => {
    dispatch(_select({ id }));

    if (canvasHandler.active) {
      const { Component } = orm.session(getState().orm);
      const selectedComponent = id !== null ? Component.withId(id).ref : null;
      canvasHandler.onSelect(selectedComponent);
    }
  };
};

export const updatePosition = (x: number, y: number) => {
  return (dispatch: any, getState: any, orm: any) => {
    dispatch(_updatePosition({ x, y }));
    if (canvasHandler.active) {
      const { Component } = orm.session(getState().orm);
      const component = Component.getSelected();
      if (component !== null) canvasHandler.onUpdate(component.ref);
    }
  };
};

export const updateScale = (width: number, height: number) => {
  return (dispatch: any, getState: any, orm: any) => {
    dispatch(_updateScale({ width, height }));
    if (canvasHandler.active) {
      const { Component } = orm.session(getState().orm);
      const component = Component.getSelected();
      if (component !== null) canvasHandler.onUpdate(component.ref);
    }
  };
};

export const updateAngle = (angle: number) => {
  return (dispatch: any, getState: any, orm: any) => {
    dispatch(_updateAngle({ angle }));
    if (canvasHandler.active) {
      const { Component } = orm.session(getState().orm);
      const component = Component.getSelected();
      if (component !== null) canvasHandler.onUpdate(component.ref);
    }
  };
};

export const doneCanvasUpdate = () => {
  return (dispatch: any) => {
    dispatch(_doneCanvasUpdate());
  };
};

export const updateVisible = (visible: boolean) => {
  return (dispatch: any, getState: any, orm: any) => {
    dispatch(_updateField({ fieldName: 'visible', value: visible }));
    if (canvasHandler.active) {
      const { Component } = orm.session(getState().orm);
      const component = Component.getSelected();
      if (component !== null) canvasHandler.onUpdate(component.ref);
    }
  };
};

export const updateLock = (lock: boolean) => {
  return (dispatch: any, getState: any, orm: any) => {
    dispatch(_updateField({ fieldName: 'lock', value: lock }));
    if (canvasHandler.active) {
      const { Component } = orm.session(getState().orm);
      const component = Component.getSelected();
      if (component !== null) canvasHandler.onUpdate(component.ref);
    }
  };
};

export const updateDragable = (dragable: boolean) => {
  return (dispatch: any) => {
    dispatch(_updateField({ fieldName: 'dragable', value: dragable }));
  };
};

export const updateBlendMode = (destinationIn: number) => {
  return (dispatch: any) => {
    dispatch(_updateField({ fieldName: 'blendMode', value: destinationIn }));
  };
};

export const updateUserInteraction = (enable: boolean) => {
  return (dispatch: any) => {
    dispatch(_updateField({ fieldName: 'userInteraction', value: enable }));
  };
};

export const updateOpacity = (opacity: boolean) => {
  return (dispatch: any, getState: any, orm: any) => {
    dispatch(_updateField({ fieldName: 'opacity', value: opacity }));
    if (canvasHandler.active) {
      const { Component } = orm.session(getState().orm);
      const component = Component.getSelected();
      if (component !== null) canvasHandler.onUpdate(component.ref);
    }
  };
};

export const updateMouseOver = (eventGroupId: number) => {
  return (dispatch: any) => {
    dispatch(_updateField({ fieldName: 'onMouseOver', value: eventGroupId }));
  };
};

export const updateMouseClick = (eventGroupId: number) => {
  return (dispatch: any) => {
    dispatch(_updateField({ fieldName: 'onMouseClick', value: eventGroupId }));
  };
};

export const copyComponent = (id: number, title: string) => {
  return (dispatch: any, getState: any, orm: any) => {
    dispatch(_copyComponent({ id, title }));

    const { Component } = orm.session(getState().orm);
    const addedComponent = Component.all().last();
    if (canvasHandler.active) {
      canvasHandler.onAdd(addedComponent.getDataForCanvas());
    }
    dispatch(selectComponent(addedComponent.id));
  };
};

export const updateTitle = (title: string) => {
  return (dispatch: any) => {
    dispatch(_updateField({ fieldName: 'title', value: title }));
  };
};

export const updateBehavior = (componentId: number, behaviors: any) => {
  return (dispatch: any, getState: any, orm: any) => {
    dispatch(
      _updateBehavior({ componentId: componentId, behaviors: behaviors })
    );
  };
};

export const actions = {
  addCharacterComponent,
  addTeacherComponent,
  addStudentComponent,
  addImageComponent,
  addVideoComponent,
  deleteComponent,
  sortComponent,
  selectComponent,
  updatePosition,
  updateScale,
  doneCanvasUpdate,
  updateVisible,
  updateLock,
  updateDragable,
  updateAngle,
  updateOpacity,
  updateMouseOver,
  updateMouseClick,
  copyComponent,
  updateTitle,
  updateBlendMode,
  updateUserInteraction
};

/***************
 * Reducer
 */
const ValidatingModel = propTypesMixin(Model);

class Component extends ValidatingModel {
  props: ComponentModel;

  toJSON() {
    return {
      ...this.ref,
      imageComponent: isNil(this.imageComponent)
        ? null
        : this.imageComponent.toJSON(),
      videoComponent: isNil(this.videoComponent)
        ? null
        : this.videoComponent.toJSON()
      // onMouseClick: this.onMouseClick,//isNil(this.onMouseClick) ? null : this.onMouseClick.toJSON(),
      // onMouseOver: this.onMouseOver//isNil(this.onMouseOver) ? null : this.onMouseOver.toJSON(),
    };
  }

  clone(components: any) {
    const clonedData = { ...this.ref };
    delete clonedData.id;
    if (components) {
      // rearragne zIndex
      components.toModelArray().forEach(component => {
        if (clonedData.zIndex < component.ref.zIndex) {
          component.set('zIndex', component.ref.zIndex + 1);
        }
      });

      clonedData.zIndex += 1;
      clonedData.x += 70;
      clonedData.y += 70;
    }

    clonedData.imageComponent = isNil(this.imageComponent)
      ? null
      : this.imageComponent.clone();
    clonedData.videoComponent = isNil(this.videoComponent)
      ? null
      : this.videoComponent.clone();
    clonedData.onMouseClick = isNil(this.onMouseClick)
      ? null
      : this.onMouseClick.id;
    clonedData.onMouseOver = isNil(this.onMouseOver)
      ? null
      : this.onMouseOver.id;

    const { Component } = this.getClass().session;
    return Component.create(clonedData);
  }

  delete() {
    if (this.imageComponent !== null) this.imageComponent.delete();

    if (this.videoComponent !== null) this.videoComponent.delete();

    super.delete();
  }

  getLinkedEvents(): Array<any> {
    return this.eventTargets.toModelArray();
  }

  getLinkedEventGroupNames(): Array<any> {
    let eventGroupNames = [];
    this.getLinkedEvents().map(event => {
      event.getLinkedEventGroups().forEach(eventGroup => {
        const result = eventGroupNames.find(item => item === eventGroup.title);
        if (typeof result === 'undefined')
          eventGroupNames.push(eventGroup.title);
      });
    });
    return eventGroupNames;
  }

  getDataForCanvas(): ComponentCanvas {
    let asset: ?AssetRef = null;
    let c2Data: ?any = null;
    if (this.imageComponent !== null) {
      asset = this.imageComponent.asset;
      c2Data = this.imageComponent.c2Data;
    } else if (this.videoComponent !== null) asset = this.videoComponent.asset;

    return {
      id: this.id,
      type: this.type,
      width: this.width,
      height: this.height,
      x: this.x,
      y: this.y,
      angle: this.angle,
      opacity: this.opacity,
      visible: this.visible,
      lock: this.lock,
      dragable: this.dragable,
      global: this.global,
      blendMode: this.blendMode,
      userInteraction: this.userInteraction,
      zIndex: this.zIndex,
      // asset
      assetId: asset ? asset.id : null,
      src: asset ? asset.src : null,
      c2Data: c2Data
    };
  }

  static adjustZIndex() {
    const { Page } = this.session;
    const page = Page.getSelected();
    const items = page.reverseSortedComponents
      .toRefArray()
      .map(item => item.id);
    items.reverse().forEach((id: number, index: number) => {
      this.withId(id).set('zIndex', index);
    });
  }

  static parse(data: any) {
    const { ImageComponent, VideoComponent, EventGroup } = this.session;
    const clonedData = { ...data };

    if (!isNil(clonedData.imageComponent))
      clonedData.imageComponent = ImageComponent.parse(
        clonedData.imageComponent
      );

    if (!isNil(clonedData.videoComponent))
      clonedData.videoComponent = VideoComponent.parse(
        clonedData.videoComponent
      );

    // if(!isNil(clonedData.onMouseClick))
    //     clonedData.onMouseClick = clonedData.onMouseClick;//EventGroup.parse(clonedData.onMouseClick);
    //
    // if(!isNil(clonedData.onMouseOver))
    //     clonedData.onMouseOver = clonedData.onMouseOver;//EventGroup.parse(clonedData.onMouseOver);

    return this.upsert(clonedData);
  }

  static getSelected() {
    const { AppState } = this.session;
    const selectedId = AppState.getSelectedComponentId();
    if (selectedId === null) return null;
    else return this.withId(selectedId);
  }

  static select(id: number) {
    const { AppState } = this.session;
    AppState.selectComponent(id);
  }

  static create(props: any) {
    const { Page } = this.session;
    const page = Page.getSelected();

    if (page === null || props.hasOwnProperty('zIndex')) {
      return super.create(props);
    }
    // update zIndex
    const lastComponent = page.sortedComponents.last();
    let nextZIndex = 0;
    if (typeof lastComponent !== 'undefined')
      nextZIndex = lastComponent.zIndex + 1;

    // create
    return super.create({
      ...props,
      zIndex: nextZIndex
    });
  }

  static import(data) {
    const { ImageComponent, VideoComponent, EventGroup } = this.session;
    const clonedData = { ...data };
    delete clonedData.id;
    // delete clonedData.zIndex;

    if (!isNil(clonedData.imageComponent))
      clonedData.imageComponent = ImageComponent.import(
        clonedData.imageComponent
      );

    if (!isNil(clonedData.videoComponent))
      clonedData.videoComponent = VideoComponent.import(
        clonedData.videoComponent
      );

    return this.upsert(clonedData);
  }

  static reducer(action, Component, session) {
    const { payload, type } = action;
    const { Page, AppState } = session;

    switch (type) {
      case ADD_IMAGE: {
        const {
          asset,
          width,
          height,
          x,
          y
        }: {
          asset: AssetModel,
          width: number,
          height: number,
          x: number,
          y: number
        } = payload;
        const { Page, Asset, ImageComponent } = session;
        // create asset

        const newAsset = Asset.create(asset);

        // create image com
        const newImageComponent = ImageComponent.create({
          asset: newAsset,
          width: width,
          height: height
        });

        // create com
        const newComponent = this.create({
          type: COMPONENT_TYPE.Image,
          title: asset.title,
          width: width,
          height: height,
          x: x,
          y: y,
          imageComponent: newImageComponent
        });
        const page = Page.getSelected();
        page.components.add(newComponent);
        break;
      }
      case ADD_VIDEO: {
        const {
          asset,
          width,
          height,
          x,
          y
        }: {
          asset: AssetModel,
          width: number,
          height: number,
          x: number,
          y: number
        } = payload;
        const { Page, Asset, VideoComponent } = session;
        // create asset
        const newAsset = Asset.create(asset);

        // create image com
        const newVideoComponent = VideoComponent.create({
          asset: newAsset,
          width: width,
          height: height
        });

        // create com
        const newComponent = this.create({
          type: COMPONENT_TYPE.Video,
          title: asset.title,
          width: width,
          height: height,
          x: x,
          y: y,
          videoComponent: newVideoComponent
        });
        const page = Page.getSelected();
        page.components.add(newComponent);
        break;
      }
      case ADD_CHARACTER: {
        const {
          width,
          height,
          x,
          y
        }: {
          width: number,
          height: number,
          x: number,
          y: number
        } = payload;
        const { Page } = session;

        // create com
        const newComponent = this.create({
          type: COMPONENT_TYPE.Character,
          title: Language.getString(30006),
          width: width,
          height: height,
          x: x,
          y: y
        });
        const page = Page.getSelected();
        page.components.add(newComponent);
        break;
      }
      case ADD_TEACHER_VIEW: {
        const {
          width,
          height,
          x,
          y
        }: {
          width: number,
          height: number,
          x: number,
          y: number
        } = payload;
        const { Page } = session;

        // create com
        const newComponent = this.create({
          type: COMPONENT_TYPE.TeacherView,
          title: Language.getString(30007),
          width: width,
          height: height,
          x: x,
          y: y
        });
        const page = Page.getSelected();
        page.components.add(newComponent);
        break;
      }
      case ADD_STUDENT_VIEW: {
        const {
          width,
          height,
          x,
          y
        }: {
          width: number,
          height: number,
          x: number,
          y: number
        } = payload;
        const { Page } = session;

        // create com
        const newComponent = this.create({
          type: COMPONENT_TYPE.StudentView,
          title: Language.getString(30008),
          width: width,
          height: height,
          x: x,
          y: y
        });
        const page = Page.getSelected();
        page.components.add(newComponent);
        break;
      }

      case UPDATE_IMAGE: {
        const { asset, width, height } = payload;
        const { Asset, ImageComponent } = session;
        const { title } = asset;

        const component = this.getSelected();
        component.imageComponent.delete();

        const newAsset = Asset.create(asset);
        const newImageComponent = ImageComponent.create({
          asset: newAsset,
          width: width,
          height: height
        });

        component.title = title;
        component.imageComponent = newImageComponent;
        break;
      }

      case UPDATE_VIDEO: {
        const { asset, width, height } = payload;
        const { Asset, VideoComponent } = session;
        const { title } = asset;

        const component = this.getSelected();
        component.videoComponent.delete();

        const newAsset = Asset.create(asset);
        const newVideoComponent = VideoComponent.create({
          asset: newAsset,
          width: width,
          height: height
        });

        component.title = title;
        component.videoComponent = newVideoComponent;
        break;
      }

      case DELETE: {
        const { id }: { id: number } = payload;
        this.withId(id).delete();
        this.adjustZIndex();
        break;
      }
      case SORT: {
        const page = Page.getSelected();
        const videoAssetId = [];
        const items = page.reverseSortedComponents.toRefArray().map(item => {
          if (
            item.type === 'video' ||
            item.type === 'studentView' ||
            item.type === 'teacherView'
          ) {
            videoAssetId.push(item.id);
          }
          return item.id;
        });
        const { fromIndex, toIndex } = payload;

        const upVideo = [];
        if (
          fromIndex > toIndex &&
          videoAssetId.find(vId => vId === items[fromIndex]) &&
          !videoAssetId.find(vId => vId === items[toIndex])
        ) {
          upVideo.push(items[fromIndex]);
        }

        items.move(fromIndex, toIndex);

        const othersAssetId = [];
        const frontVideoId = [];
        const backVideoId = [];

        items.forEach((assetId, index) => {
          if (videoAssetId.find(vId => vId === assetId)) {
            if (othersAssetId.length) {
              backVideoId.push(assetId);
            } else {
              frontVideoId.push(assetId);
            }
          } else {
            othersAssetId.push(assetId);
          }
        });

        upVideo.forEach(vId => {
          frontVideoId.push(vId);
          backVideoId.splice(backVideoId.indexOf(vId), 1);
        });

        const sortedAssetId = frontVideoId
          .concat(othersAssetId)
          .concat(backVideoId);
        sortedAssetId.reverse().forEach((id: number, index: number) => {
          this.withId(id).set('zIndex', index);
        });
        break;
      }
      case SELECT: {
        const { id } = payload;
        this.select(id);
        break;
      }
      case UPDATE_POSITION: {
        const { x, y } = payload;

        const selected = this.getSelected();
        if (selected !== null) {
          selected.update({ x: x, y: y });
        }

        break;
      }
      case UPDATE_SCALE: {
        const { width, height } = payload;

        const selected = this.getSelected();
        if (selected !== null) {
          selected.update({ width: width, height: height });
        }
        break;
      }
      case UPDATE_ANGLE: {
        const { angle } = payload;
        const selected = this.getSelected();
        if (selected !== null) {
          selected.update({ angle: angle });
        }
        break;
      }
      case COPY_COMPONET: {
        const { id, title } = payload;
        const { Page } = session;
        const page = Page.getSelected();

        const component = Component.withId(id);
        const newComponent = component.clone(page.sortedComponents);
        newComponent.title = title;

        page.components.add(newComponent);
        break;
      }
      case DONE_CANVAS_UPDATE: {
        AppState.withId(0).addedComponentId = null;
        AppState.withId(0).deletedComponentId = null;
        AppState.withId(0).isComponentSorted = false;
        AppState.withId(0).isComponentUpdated = false;
        break;
      }
      case UPDATE_FIELD: {
        const { fieldName, value } = payload;
        const selected = this.getSelected();

        if (selected !== null) {
          selected.set(fieldName, value);
        }
        break;
      }

      case UPDATE_BEHAVIOR: {
        const { componentId, behaviors } = payload;
        // const component = this.getSelected();
        const component = this.withId(componentId);
        delete component.imageComponent['behaviors'];
        component.imageComponent.behaviors = behaviors;
        break;
      }
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
  imageComponent: oneToOne('ImageComponent'),
  videoComponent: oneToOne('VideoComponent'),
  // event
  onMouseClick: fk('EventGroup', 'components_onMouseClick'),
  onMouseOver: fk('EventGroup', 'components_onMouseOver')
};

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
  onMouseOver: null
};

//orm.register(Component);

export default Component;
