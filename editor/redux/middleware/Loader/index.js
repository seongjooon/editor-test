import MSConfig from 'constants/msConfig';

// Log
import MSLog from 'utils/MSLog';
// constants
import { END_REASON } from 'constants/Log';
// util
import { fetchBlob } from 'utils/FetchPost';

let error_count = 0;
const TWO_DAYS = 172800000;

export default class Loader {
  static init(allAssetCount) {
    this.allAssetCount = allAssetCount;

    let parsedBlob = null;
    let expiredDate = null;

    if (localStorage.getItem('blob_url')) {
      parsedBlob = JSON.parse(localStorage.getItem('blob_url'));

      if (Array.isArray(parsedBlob)) {
        localStorage.removeItem('blob_url');
        parsedBlob = {};
      }

      if (parsedBlob[location.pathname]) {
        parsedBlob[location.pathname].forEach(url => {
          const URL = window.URL || window.webkitURL;
          URL.revokeObjectURL(url);
        });
      }
    }

    if (parsedBlob === null) {
      parsedBlob = {};
    }

    if (!localStorage.getItem('expired_date')) {
      localStorage.setItem('expired_date', new Date().getTime());
    }
    expiredDate = Number(localStorage.getItem('expired_date'));

    if (+new Date() - expiredDate > TWO_DAYS) {
      localStorage.setItem('expired_date', new Date().getTime());
      parsedBlob = {};
    }

    this.diskCache = {};
    parsedBlob[location.pathname] = [];
    localStorage.setItem('blob_url', JSON.stringify(parsedBlob));
  }

  static addAsset(asset) {
    const diskCache = this.diskCache;
    // console.log('###### loader asset', asset)
    
    const splited_by_slash = asset.src.split('/');
    const file_id = splited_by_slash[splited_by_slash.length - 1].split('.')[0];
    let copied_status = false;

    const keys = Object.keys(diskCache);
    for (let i = 0; i < keys.length; i++) {
      if (diskCache[keys[i]].fileId === file_id) {
        diskCache[asset.id] = diskCache[keys[i]];
        copied_status = true;
        break;
      }
    }

    if (!copied_status) {
      diskCache[asset.id] = {
        fileId: file_id,
        src: asset.src
      };

      let fatal = false;

      const FETCH_ASSET = uri => {
        fetchBlob(uri)
          .then(blob => {
            const URL = window.URL || window.webkitURL;
            const objectURL = URL.createObjectURL(blob);
            diskCache[asset.id].src = objectURL;

            // localstorage logic
            const parsedBlob = JSON.parse(localStorage.getItem('blob_url'));

            if (!Array.isArray(parsedBlob[location.pathname])) {
              parsedBlob[location.pathname] = [];
            }

            parsedBlob[location.pathname].push(objectURL);
            localStorage.setItem('blob_url', JSON.stringify(parsedBlob));
            // localstorage logic
            this.assetCurrentCount++;

            if (this.progressHandler) {
              this.progressHandler(this.assetCurrentCount, this.allAssetCount);
            }
          })
          .catch(err => {
            error_count++;

            if (error_count === 2) {
              fatal = true;
              MSLog({
                errorType: 'fatal',
                code: END_REASON.ASSET_LOAD_ERROR,
                error: new Error(err)
              });
            }
            if (fatal) {
              return;
            }

            MSLog({
              code: END_REASON.ASSET_LOAD_ERROR,
              error: new Error(err)
            });
            FETCH_ASSET(uri);
          });
      };

      FETCH_ASSET(asset.src);
    } else {
      this.assetCurrentCount++;
      if (this.progressHandler)
        this.progressHandler(this.assetCurrentCount, this.allAssetCount);
    }
  }

  static getWithAssetId(asset_id) {
    return this.diskCache[asset_id];
  }

  /*
    static destroy () {
        const diskCache = this.diskCache;
        const URL = window.URL || window.webkitURL;

        Object.keys(diskCache).forEach(key => {
            URL.revokeObjectURL(diskCache[key].src)
        });

        this.diskCache = {};
    }

    static removeAsset (assetId) {
        const diskCache = this.diskCache;
        const URL = window.URL || window.webkitURL;
        URL.revokeObjectURL(diskCache[assetId].src);

        let localstorage_blob = JSON.parse(localStorage.getItem('blob_url'));
        localstorage_blob = localstorage_blob.filter(blob => (blob !== diskCache[assetId].src));
        localStorage.setItem('blob_url', JSON.stringify(localstorage_blob));

        delete diskCache[assetId];
    }
    */
}

Loader.allAssetCount = null;
Loader.assetCurrentCount = 0;
Loader.diskCache = {};
Loader.progressHandler = null;
