import { Model, createSelector as ormCreateSelector, many, fk, attr } from 'redux-orm';

import { createAction } from 'redux-actions';
import { VideoComponentModel } from '../../../../interface/redux/model';


const _default: VideoComponentModel = {
  loop: false,
  width: 0,
  height: 0,
  asset: null
};
class VideoComponent extends Model {
  static parse(data) {
    //@ts-ignore
    const { Asset } = this.session;
    const clonedData = { ...data };

    if (clonedData.asset) clonedData.asset = Asset.parse(clonedData.asset);

    return this.upsert(clonedData);
  }

  static create(props: any) {
    return super.create({
      //@ts-ignore
      ...VideoComponent.defaultProps,
      ...props,
    });
  }
}

VideoComponent.modelName = 'VideoComponent';

VideoComponent.fields = {
  id: attr(),
  width: attr(),
  height: attr(),
  loop: attr(),
  asset: fk('Asset', 'videoComponents'),
};

//@ts-ignore
VideoComponent.defaultProps = _default;

export default VideoComponent;
