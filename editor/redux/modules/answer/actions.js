/**
 * Created by neo on 2016. 11. 15..
 */
// @flow

/*********
 * LIB
 */
// redux
import { Model, many, fk, attr } from 'redux-orm';
import propTypesMixin from 'redux-orm-proptypes';
import { createAction } from 'redux-actions';
// util
import { isNil, maxBy } from 'lodash';

// constants
import Language from 'constants/Language';

/*******
 * LOCAL
 */
// type, constant
import {
  MS_STRING,
  ANIMATION_EFFECT,
  FLY_TYPE,
  ActionType,
  DIRECTION
} from 'constants/msConstant';
import type { AssetModel } from 'redux/modules/asset//actions';
import type { ComponentModel } from 'redux/modules/component//actions';
import { lastAnswer } from 'redux/modules/appState/actions';

/****************************
 * Type
 */

export type AnswerRef = {
  id?: number,
  title: string,
  defaultImage: ComponentModel,
  pushedImage: ?AssetModel,
  pushedSound: ?AssetModel,
  defaultSound: ?AssetModel
};

export type AnswerModel = Answer;

/*****************
 * Constant
 */

const ADD = 'minischool/answer/ADD';
const DELETE = 'minischool/answer/DELETE';
const UPDATE = 'minischool/answer/UPDATE';
const LAST = 'minischool/answer/LAST';

/***********************
 *  Action
 */
const _add = createAction(
  ADD,
  (payload: { quizId: number, data: AnswerModel }) => payload
);
const _delete = createAction(DELETE, (payload: { id: number }) => payload);
const _update = createAction(UPDATE, (payload: AnswerModel) => payload);
const _last = createAction(LAST, (payload: { id: number }) => payload);

export const addAnswer2 = (quizId: number, data: AnswerModel) => {
  console.log('#### redux addAnswer', quizId, data);
  return (dispatch: any) => {
    dispatch(_add({ quizId, data }));
  };
};

export const addAnswer = (quizId: number, data: AnswerModel, callBack: Function) => {
  console.log('#### redux addAnswer', quizId, data);

  return (dispatch: any, getState: any, orm: any) => {
    dispatch(_add({ quizId, data }));
    // dispatch(_addTeacherView({ width, height, x, y }));
    const { Answer } = orm.session(getState().orm);
    const answer = Answer.all().last();
    
    callBack(answer.id);
    console.log('%%%%%%%%%%%%%%%%%%%% ', answer.id);
    // select
    dispatch(lastAnswer(answer.id));
    // dispatch(_last({id:answer.id}));
  };
};

export const deleteAnswer = (id: number) => {
  console.log('#### redux deleteAnswer', id);
  return (dispatch: any) => {
    dispatch(_delete({ id }));
  };
};

export const updateAnswer = (data: AnswerModel) => {
  console.log('#### redux updateAnswer', data);
  return (dispatch: any) => {
    dispatch(_update(data));
  };
};

export const actions = {
  addAnswer,
  deleteAnswer,
  updateAnswer
};

/***************
 * Reducer
 */

const ValidatingModel = propTypesMixin(Model);

class Answer extends ValidatingModel {
  props: AnswerRef;

  toJSON() {
    return {
      ...this.ref,
      defaultImage: isNil(this.defaultImage) ? null : this.defaultImage.id,
      pushedImage: isNil(this.pushedImage) ? null : this.pushedImage.toJSON(),
      pushedSound: isNil(this.pushedSound) ? null : this.pushedSound.toJSON(),
      defaultSound: isNil(this.defaultSound) ? null : this.defaultSound.toJSON()
    };
  }

  clone() {
    const clonedData = {
      ...this.ref,
      defaultImage: this.defaultImage.id
    };
    delete clonedData['id'];

    const { Asset } = this.getClass().session;

    let newPushedImage = null;
    if (clonedData.pushedImage !== null) {
      const asset = Asset.withId(clonedData.pushedImage);
      newPushedImage = asset.clone();
    }

    let newPushedSound = null;
    if (clonedData.pushedSound !== null) {
      const asset = Asset.withId(clonedData.pushedSound);
      newPushedSound = asset.clone();
    }

    let newDefaultSound = null;
    if (clonedData.defaultSound !== null) {
      const asset = Asset.withId(clonedData.defaultSound);
      newDefaultSound = asset.clone();
    }

    const newAnswer = Answer.create({
      ...clonedData,
      pushedImage: newPushedImage,
      pushedSound: newPushedSound,
      defaultSound: newDefaultSound
    });

    return newAnswer;
  }

  delete() {
    if (this.pushedImage !== null) this.pushedImage.delete();
    if (this.pushedSound !== null) this.pushedSound.delete();
    if (this.defaultSound !== null) this.defaultSound.delete();

    super.delete();
  }

  static parse(data) {
    const { Asset } = this.session;
    const clonedData = { ...data };

    // if(!isNil(clonedData.target))
    //     clonedData.target = Component.parse(clonedData.target);

    if (!isNil(clonedData.pushedImage))
      clonedData.pushedImage = Asset.parse(clonedData.pushedImage);

    if (!isNil(clonedData.pushedSound))
      clonedData.pushedSound = Asset.parse(clonedData.pushedSound);

    if (!isNil(clonedData.defaultSound))
      clonedData.defaultSound = Asset.parse(clonedData.defaultSound);

    return this.upsert(clonedData);
  }

  static import(data) {
    const { Asset } = this.session;
    const clonedData = { ...data };

    delete clonedData.id;
    // delete clonedData.zIndex;

    if (!isNil(clonedData.pushedImage)) {
      clonedData.pushedImage = Asset.import(clonedData.pushedImage);
      // console.log('NEO import answer 33 ', clonedData.pushedImage);
      // console.log('NEO import answer 444 ', clonedData.pushedImage);
    }

    if (!isNil(clonedData.pushedSound))
      clonedData.pushedSound = Asset.import(clonedData.pushedSound);

    if (!isNil(clonedData.defaultSound))
      clonedData.defaultSound = Asset.import(clonedData.defaultSound);

    return this.upsert(clonedData);
  }

  static create(props) {
    console.log('NEO ### redux props', props);
    const { Asset } = this.session;

    let newPushedImage = null;
    if (props.hasOwnProperty('pushedImage') && props.pushedImage !== null) {
      if (props.pushedImage.id === undefined)
        newPushedImage = Asset.create(props.pushedImage);
      else newPushedImage = props.pushedImage.id;
    }

    let newPushedSound = null;
    if (props.hasOwnProperty('pushedSound') && props.pushedSound !== null) {
      if (props.pushedSound.id === undefined)
        newPushedSound = Asset.create(props.pushedSound);
      else newPushedSound = props.pushedSound.id;
    }

    let newDefaultSound = null;
    if (props.hasOwnProperty('defaultSound') && props.defaultSound !== null) {
      if (props.defaultSound.id === undefined)
        newDefaultSound = Asset.create(props.defaultSound);
      else newDefaultSound = props.defaultSound.id;
    }

    return super.create({
      ...props,
      pushedImage: newPushedImage,
      pushedSound: newPushedSound,
      defaultSound: newDefaultSound
    });
  }

  static reducer(action, Answer, session) {
    const { payload, type } = action;

    switch (type) {
      case ADD: {
        const { quizId, data } = payload;
        const { Asset, Quiz } = session;

        const newAnswer = this.create({
          ...data
        });
        const quiz = Quiz.withId(quizId);
        quiz.answers.add(newAnswer);
        break;
      }
      case DELETE: {
        const { id }: { id: number } = payload;
        this.withId(id).delete();
        break;
      }
      case LAST: {
        const { AppState } = session;
        const { id } = payload;
        console.log('ZZZZZZZZZZZZZ ', id);
        AppState.lastAnswer(id);
        break;
      }
      case UPDATE: {
        const { id } = payload;
        if (!this.idExists(id)) return;
        const { Asset } = session;

        const answer = this.withId(id);

        let newPushedImage = null;
        if (answer.pushedImage !== null) {
          answer.pushedImage.delete();
        }
        if (
          payload.hasOwnProperty('pushedImage') &&
          payload.pushedImage !== null
        ) {
          newPushedImage = Asset.create(payload.pushedImage);
        }

        let newPushedSound = null;
        if (answer.pushedSound !== null) {
          answer.pushedSound.delete();
        }
        if (
          payload.hasOwnProperty('pushedSound') &&
          payload.pushedSound !== null
        ) {
          newPushedSound = Asset.create(payload.pushedSound);
        }

        let newDefaultSound = null;
        if (answer.defaultSound !== null) {
          answer.defaultSound.delete();
        }
        if (
          payload.hasOwnProperty('defaultSound') &&
          payload.defaultSound !== null
        ) {
          newDefaultSound = Asset.create(payload.defaultSound);
        }

        // let newPushedSound = null;
        // if (answer.pushedSound !== null) {
        //   newPushedSound = Asset.upsert({
        //     ...payload.pushedSound,
        //     id: answer.pushedSound.id
        //   });

        //   let newDefaultSound = null;
        //   if (answer.defaultSound !== null) {
        //     newDefaultSound = Asset.upsert({
        //       ...payload.defaultSound,
        //       id: answer.defaultSound.id
        //     });

        //     this.upsert({
        //       ...payload,
        //       pushedImage: newPushedImage,
        //       pushedSound: newPushedSound,
        //       defaultSound: newDefaultSound
        //     });
        //     break;
        //   }
        // }

        this.upsert({
          ...payload,
          pushedImage: newPushedImage,
          pushedSound: newPushedSound,
          defaultSound: newDefaultSound
        });
        break;
      }
    }
  }
}

Answer.modelName = 'Answer';

Answer.fields = {
  id: attr(),
  title: attr(),
  defaultImage: fk('Component'),
  pushedImage: fk('Asset', 'pushed_image'),
  pushedSound: fk('Asset', 'pushed_sound'),
  defaultSound: fk('Asset', 'default_sound')
};

Answer.defaultProps = {
  title: '',
  defaultImage: null,
  pushedImage: null,
  pushedSound: null,
  defaultSound: null
};

export default Answer;
