// export type {AssetModel} from './asset';
// export type {VPropertyModel} from './component/visibleProperty';
// export type {ImageModel} from './component/imageComponent';
// export type {Pathfinding, Sine, Fade, Tween} from './component/imageComponent';
// export type {TextModel} from './component/textComponent';
// export type {VideoModel} from './component/videoComponent';
// export type {EventModel} from './event';
// export type {C2DataModel} from './c2Data';
// export type {EventGroupModel} from './eventGroup';
// export type {PageGroupModel} from './pageGroup';
// export type {PageModel, Script} from './page';

//import * as CT from 'constants/msConstant';

/*eslint-disable */
// export type ComponentModel =
//     ImageModel
//         | TextModel
//         | VideoModel
//     ;
// /*eslint-enable */
// export type ComponentKey = {
//     id: number,
//     uuid?: number,
//     type: ComponentType,
//     title?: string,
//     vId?: number,
//     assetId?: number
// }

// export type ComponentType =
//     CT.COMPONENT_TYPE.image
//         | CT.COMPONENT_TYPE.text
//         | CT.COMPONENT_TYPE.video
//     ;

export type { AuthType } from './auth';
export { actions as authActions, selectors as authSelectors } from './auth';
export {
  actions as playerStateActions,
  selectors as playerStateSelectors
} from './playerState';
export { actions as appStateActions } from './appState/actions';
