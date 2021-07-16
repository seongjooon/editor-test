// @flow

/*********
 * LIB
 */
// redux
import { createSelector as ormCreateSelector } from 'redux-orm';
import { createSelector } from 'reselect';
import { Model, many, fk, attr } from 'redux-orm';
// util
import { isNil, maxBy } from 'lodash';

/*******
 * Local
 */
import { orm } from 'redux/modules/model';
import { appStateSelectors } from '../appState';
// type
import type { ComponentModel, ComponentRef, ComponentCanvas } from './actions';
import type { AssetModel, AssetRef } from 'redux/modules/asset/actions';

const ormSelector = state => state.orm;

export const getComponents: () => Array<ComponentRef> = createSelector(
  ormSelector,
  ormCreateSelector(orm, session => {
    const { Page } = session;
    const page = Page.getSelected();
    if (page === null) return [];
    return page.sortedComponents.toRefArray();
  })
);

// export type ComponentCanvas = {
//     id: number,
//     type: 'image' | 'text' | 'video',
//     width: number,
//     height: number,
//     x: number,
//     y: number,
//     angle: number,
//     opacity: number,
//     visible: boolean,
//     lock: boolean,
//     dragable: boolean,
//     global: boolean,
//     blendMode: number,
//     zIndex: number,
//     assetId: number,
//     src: string,
//     c2Data: ?any
// }

const getComponentsForCanvas: () => Array<ComponentCanvas> = createSelector(
  ormSelector,
  ormCreateSelector(orm, session => {
    const { Page } = session;
    const page = Page.getSelected();
    if (page === null) return [];

    return page.sortedComponents
      .toModelArray()
      .map((component: ComponentModel) => {
        return component.getDataForCanvas();
      });
  })
);

export type ComponentAsset = {
  id: number,
  title: string,
  type: string,
  zIndex: number,
  src: string,
  linkedEventGroupNames: Array<string>
};

export const getComponentAssets: () => Array<ComponentAsset> = createSelector(
  ormSelector,
  ormCreateSelector(orm, session => {
    const { Page } = session;
    const page = Page.getSelected();
    if (page === null) return [];

    return page.reverseSortedComponents
      .toModelArray()
      .map((component: ComponentModel) => {
        let asset: ?AssetRef = null;
        if (component.imageComponent !== null)
          asset = component.imageComponent.asset;
        else if (component.videoComponent !== null)
          asset = component.videoComponent.asset;

        return {
          id: component.id,
          title: component.title,
          type: component.type,
          zIndex: component.zIndex,
          src: asset ? asset.src : null,
          assetId: asset ? asset.id : null,
          linkedEventGroupNames: component.getLinkedEventGroupNames()
        };
      });
  })
);

export const getSelectedComponentId: () => number = createSelector(
  ormSelector,
  appStateSelectors.getSelectedComponentId,
  ormCreateSelector(orm, (session, selectedComponentId) => {
    return selectedComponentId;
  })
);

const getComponentModels: () => Array<ComponentModel> = createSelector(
  ormSelector,
  ormCreateSelector(orm, session => {
    const { Page } = session;
    const page = Page.getSelected();
    if (page === null) return [];

    return page.sortedComponents.toModelArray().map(com => com.toJSON());
  })
);

export const getSelectedComponent: () => ComponentRef = createSelector(
  ormSelector,
  appStateSelectors.getSelectedComponentId,
  ormCreateSelector(orm, (session, selectedComponentId) => {
    if (selectedComponentId === null) return null;

    const { Component } = session;
    const component = Component.withId(selectedComponentId);
    return component.toJSON();
  })
);

const getSelectedComponentForCanvas: () => ComponentRef = createSelector(
  ormSelector,
  appStateSelectors.getSelectedComponentId,
  ormCreateSelector(orm, (session, selectedComponentId) => {
    if (selectedComponentId === null) return null;

    const { Component } = session;
    const component = Component.withId(selectedComponentId);
    return component.ref;
  })
);

export const getSelectedComponentModel: () => ComponentModel = createSelector(
  ormSelector,
  appStateSelectors.getSelectedComponentId,
  ormCreateSelector(orm, (session, selectedComponentId) => {
    if (selectedComponentId === null) return null;
    const { Component } = session;
    return Component.withId(selectedComponentId);
  })
);

export type ImageComponentInfo = {
  id: number,
  title: string,
  zIndex: number,
  src: string
};

const getImageComponents: () => Array<ImageComponentInfo> = createSelector(
  ormSelector,
  ormCreateSelector(orm, session => {
    const { Page } = session;
    const page = Page.getSelected();
    if (page === null) return [];

    const imageComponents = page.sortedComponents
      .filter(component => component.type == 'image')
      .toModelArray()
      .map((component: ComponentModel) => {
        const { asset } = component.imageComponent;
        return {
          id: component.id,
          title: component.title,
          zIndex: component.zIndex,
          src: asset.src,
          assetId: asset.id,
          dragable: component.dragable
        };
      });
    return imageComponents;
  })
);

const getImageComponents2: () => Array<ImageComponentInfo> = createSelector(
  ormSelector,
  getImageComponents,
  ormCreateSelector(orm, (session, pageImageComponents) => {
    const { Page } = session;
    const page = Page.getSelected();
    if (page === null) return [];

    console.log('NEO ', pageImageComponents);

    const usedImage = [];
    page.quizzes.toModelArray().forEach(quiz => {
      quiz.answers.toModelArray().forEach(answer => {
        if (answer.defaultImage !== null){
          console.log('DEFAULT ', answer.defaultImage.id);
          usedImage.push(answer.defaultImage.id);
        }
      });
    });

    const result = pageImageComponents.filter(image => {
      return !usedImage.includes(image.id);
    });
    console.log('NEO 2 ', result);
    return result;

    // const imageComponents = page.sortedComponents
    //   .filter(component => component.type == 'image')
    //   .toModelArray()
    //   .map((component: ComponentModel) => {
    //     const { asset } = component.imageComponent;
    //     return {
    //       id: component.id,
    //       title: component.title,
    //       zIndex: component.zIndex,
    //       src: asset.src,
    //       assetId: asset.id,
    //       dragable: component.dragable
    //     };
    //   });
    // return imageComponents;
  })
);

const getImageComponentsFromPageId: () => Array<
  ImageComponentInfo
> = createSelector(
  ormSelector,
  ormCreateSelector(orm, session => {
    const { PageGroup } = session;
    const pageGroup = PageGroup.getSelected();
    const pageComponents = pageGroup.sortedPages.toModelArray().map(page => {
      return {
        pageId: page.id,
        components: page.sortedComponents
          .filter(component => component.type == 'image')
          .toModelArray()
          .map(component => {
            const { asset } = component.imageComponent;
            return {
              assetId: asset.id,
              src: asset.src,
              width: component.width,
              height: component.height,
              x: component.x,
              y: component.y,
              angle: component.angle,
              opacity: component.opacity,
              visible: component.visible,
              zIndex: component.zIndex
            };
          })
      };
    });
    return pageComponents;
  })
);

const getAddedComponent = createSelector(
  ormSelector,
  appStateSelectors.getAddedComponentId,
  ormCreateSelector(orm, (session, addedComponentId) => {
    const { Component } = session;
    if (addedComponentId === null || !Component.idExists(addedComponentId))
      return null;

    const component = Component.withId(addedComponentId);
    let asset: ?AssetRef = null;
    let c2Data: ?any = null;
    if (component.imageComponent !== null) {
      asset = component.imageComponent.asset;
      c2Data = component.imageComponent.c2Data;
    } else if (component.videoComponent !== null)
      asset = component.videoComponent.asset;

    return {
      id: component.id,
      type: component.type,
      width: component.width,
      height: component.height,
      x: component.x,
      y: component.y,
      angle: component.angle,
      opacity: component.opacity,
      visible: component.visible,
      lock: component.lock,
      zIndex: component.zIndex,
      // asset
      assetId: asset ? asset.id : null,
      src: asset ? asset.src : null,
      c2Data: c2Data
    };
  })
);

const getDeletedComponentId = createSelector(
  ormSelector,
  appStateSelectors.getDeletedComponentId,
  ormCreateSelector(orm, (session, deletedComponentId) => {
    return deletedComponentId;
  })
);

const getIsComponentSorted = createSelector(
  ormSelector,
  appStateSelectors.getIsComponentSorted,
  ormCreateSelector(orm, (session, isComponentSorted) => {
    return isComponentSorted;
  })
);

const getIsComponentUpdated = createSelector(
  ormSelector,
  appStateSelectors.getIsComponentUpdated,
  ormCreateSelector(orm, (session, isComponentUpdated) => {
    return isComponentUpdated;
  })
);

export const selectors = {
  getComponents,
  getComponentModels,
  getSelectedComponent,
  getAddedComponent,
  getDeletedComponentId,
  getIsComponentSorted,
  getIsComponentUpdated,
  getImageComponents,
  getImageComponents2,
  getComponentAssets,
  getComponentsForCanvas,
  getSelectedComponentModel,
  getSelectedComponentId,
  getImageComponentsFromPageId,
  getSelectedComponentForCanvas
};
