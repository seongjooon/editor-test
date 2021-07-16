import * as Type from './actionTypes';
import { FADE_TYPE } from '../../../constants/msConstant';

import OrmSession, { Model, many, fk, attr } from 'redux-orm';
import _ from 'lodash';

interface QuizAnswer {
  pushedImage: any;
  pushedSound: any;
  defaultSound: any;
}
class QuizAnswer extends Model {
  static reducer(action, QuizAnswer, session) {
    const { payload, type } = action;
    const { Asset, Quiz } = session;

    switch (type as Type.QuizAnswerActionTypes) {
      case Type.QUIZ_ANSWER_ADD: {
        const { quizId, data } = payload; 

        const quizAnswer = this.create({ ...data });
        const quiz = Quiz.withId(quizId);
        Quiz.answers.add(quizAnswer);
        break;
      }
      case Type.QUIZ_ANSWER_UPDATE: {
        const { id } = payload;
        if (!this.idExists(id)) return;

        //Asset create
        const _createAsset = (assetType: string) => {
          const quizAnswerAsset = this.withId(id)[assetType];
          const payloadAsset = payload[assetType];

          if (quizAnswerAsset !== null) {
            quizAnswerAsset.delete();
          }

          if (payload.hasOwnProperty(assetType) && payloadAsset !== null) {
            return Asset.create(payloadAsset);
          } else {
            return null;
          }
        };

        this.upsert({
          ...payload,
          pushedImage: _createAsset('pushedImage'),
          pushedSound: _createAsset('pushedSound'),
          defaultSound: _createAsset('defaultSound'),
        });

        break;
      }
      case Type.QUIZ_ANSWER_DELETE: {
        break;
      }
      case Type.QUIZ_ANSWER_LAST: {
        break;
      }
      default:
        break;
    }
  }

  static parse(data) {
    //@ts-ignore
    const { Asset } = this.session;
    const clonedData = { ...data };

    if (clonedData.pushedImage) clonedData.pushedImage = Asset.parse(clonedData.pushedImage);

    if (clonedData.pushedSound) clonedData.pushedSound = Asset.parse(clonedData.pushedSound);

    if (clonedData.defaultSound) clonedData.defaultSound = Asset.parse(clonedData.defaultSound);

    return this.upsert(clonedData);
  }

  delete() {
    if (this.pushedImage !== null) this.pushedImage.delete();
    if (this.pushedSound !== null) this.pushedSound.delete();
    if (this.defaultSound !== null) this.defaultSound.delete();

    super.delete();
  }
}

QuizAnswer.modelName = 'QuizAnswer';

QuizAnswer.fields = {
  id: attr(),
  title: attr(),
  defaultImage: fk('Component'),
  pushedImage: fk('Asset', 'pushed_image'),
  pushedSound: fk('Asset', 'pushed_sound'),
  defaultSound: fk('Asset', 'default_sound'),
};
//@ts-ignore
QuizAnswer.defaultProps = {
  title: '',
  defaultImage: null,
  pushedImage: null,
  pushedSound: null,
  defaultSound: null,
};

export default QuizAnswer;
