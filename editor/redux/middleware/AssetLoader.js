/******
 * LIB
 */
import { find, random, remove } from 'lodash';
/****
 * Local
 */
import createjs from '../../utils/preloadjs';
import MSError from '../../utils/MSError';
import { MODE } from 'constants/msConstant';
import MSConfig from 'constants/msConfig';
// Log
import MSLog from 'utils/MSLog';
// constants
import { END_REASON } from 'constants/Log';

const BG_LOAD_MIN_ASSET = 100;
const BG_LOAD_DONE_PROGRESS = 0.5;

export default class AssetLoader {
  static assetCount = 0;

  static load(assets, progress) {
    this.assetCount = assets.length;
    AssetLoader.destroy();
    AssetLoader.queue = new createjs.LoadQueue(true);
    AssetLoader.queue.setMaxConnections(1);

    return new Promise((resolve, reject) => {
      let bgLoad = false;
      if (
        !MSConfig.isMobile() &&
        (window.mode == MODE.TEACHER || window.mode == MODE.STUDENT) &&
        assets.length > BG_LOAD_MIN_ASSET
      )
        bgLoad = true;

      assets.map(asset => {
        const tmpUrl = `${asset.src}?${random(11111, 99999)}`;
        //const tmpUrl = asset.src;
        AssetLoader.queue.loadFile({
          id: asset.id,
          type: asset.assetType,
          src: tmpUrl,
          crossOrigin: 'anonymous',
          loadTimeout: 100000
        });
      });

      function handleFileLoad(event) {
        AssetLoader.assets.push({
          id: event.item.id,
          info: event.item,
          data: event.result
        });
      }

      function handleOverallProgress(event) {
        if (bgLoad) {
          progress(event.progress * BG_LOAD_DONE_PROGRESS * 10);
          if (event.progress > BG_LOAD_DONE_PROGRESS) resolve();
        } else {
          progress(event.progress);
        }
      }

      function handleError(event) {
        console.error('handleError', event);

        AssetLoader.assets.push({
          id: event.data.id,
          info: null,
          data: null
        });

        MSError.info('asset load error', 'asset', event.data.src);

        MSLog({ code: END_REASON.ASSET_LOAD_ERROR });
        reject(error);
      }

      function handleComplete() {
        resolve();
      }

      AssetLoader.queue.on('fileload', handleFileLoad);
      AssetLoader.queue.on('progress', handleOverallProgress);
      AssetLoader.queue.on('error', handleError);
      if (!bgLoad) AssetLoader.queue.on('complete', handleComplete);

      AssetLoader.queue.load();
    });
  }

  static destroy() {
    AssetLoader.assets = [];
    if (AssetLoader.queue) AssetLoader.queue.destroy();
  }

  static getWithAssetId(id) {
    return find(AssetLoader.assets, { id: id });
  }

  static removeWithAssetId(id) {
    remove(AssetLoader.assets, item => {
      return item.id === id;
    });
  }
}

AssetLoader.queue = null;
AssetLoader.assets = [];
