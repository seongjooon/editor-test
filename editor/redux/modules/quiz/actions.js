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
import type { AnswerModel } from 'redux/modules/answer/actions';

/****************************
 * Type
 */

export type QuizRef = {
  id?: number,
  title: string,
  answers: Array<AnswerModel>
};

export type QuizModel = Quiz;

/*****************
 * Constant
 */

const ADD = 'minischool/quiz/ADD';
const DELETE = 'minischool/quiz/DELETE';
const UPDATE = 'minischool/quiz/UPDATE';

/***********************
 *  Action
 */
const _add = createAction(ADD, (payload: QuizModel) => payload);
const _delete = createAction(DELETE, (payload: { id: number }) => payload);
const _update = createAction(UPDATE, (payload: QuizModel) => payload);

export const addQuiz = (data: QuizModel) => {
  console.log('#### redux addQuiz', data);
  return (dispatch: any) => {
    dispatch(_add(data));
  };
};

export const deleteQuiz = (id: number) => {
  console.log('#### redux deleteQuiz', id);
  return (dispatch: any) => {
    dispatch(_delete({ id }));
  };
};

export const updateQuiz = (id: number, title: String) => {
  console.log('#### redux updateQuiz', id, title);
  return (dispatch: any) => {
    dispatch(_update({ id, title }));
  };
};

export const actions = {
  addQuiz,
  deleteQuiz,
  updateQuiz
};

/***************
 * Reducer
 */

const ValidatingModel = propTypesMixin(Model);

class Quiz extends ValidatingModel {
  props: QuizRef;

  toJSON() {
    return {
      ...this.ref,
      answers: this.answers.toModelArray().map(item => item.toJSON())
    };
  }

  clone() {
    const clonedData = this.toJSON();
    const { Quiz } = this.getClass().session;
    return Quiz.import(clonedData);
  }

  delete() {
    this.answers.toModelArray().forEach(item => {
      // TODO: reverse로 찾아서 사용하는 곳 지워주기
      item.delete();
    });
    super.delete();
  }

  static parse(data) {
    const { Answer } = this.session;
    const clonedData = { ...data };

    if (!isNil(clonedData.answers))
      clonedData.answers = clonedData.answers.map(item => Answer.parse(item));

    return this.upsert(clonedData);
  }

  static import(data) {
    const { Answer } = this.session;
    const clonedData = { ...data };
    console.log('NEO import quiz ', data);

    delete clonedData.id;
    // delete clonedData.zIndex;

    if (!isNil(clonedData.answers))
      clonedData.answers = clonedData.answers.map(item => Answer.import(item));

    return this.upsert(clonedData);
  }

  static create(props) {
    // const { Answer } = this.session;
    // const clonedData = { ...props };

    // if (!isNil(clonedData.answers))
    //   clonedData.answers = clonedData.answers.map(item => Answer.parse(item));

    return super.create({
      ...props
    });
  }

  static reducer(action, Quiz, session) {
    const { payload, type } = action;
    // console.log('### module reducer', payload, type);
    const { Answer, Page } = session;
    switch (type) {
      case ADD: {
        const { title, answers } = payload;
        const newItem = this.create({ title });

        // newItem.answers = answers.map(item => Answer.create(item));
        answers.forEach(item => {
          const newAnswer = Answer.create(item);
          newItem.answers.add(newAnswer);
        });

        const page = Page.getSelected();
        page.quizzes.add(newItem);
        break;
      }
      case DELETE: {
        const { id }: { id: number } = payload;

        this.withId(id).delete();
        // const page = Page.getSelected();
        // page.quizzes.delete(id);
        break;
      }
      case UPDATE: {
        const { id } = payload;
        if (!this.idExists(id)) return;

        this.upsert({
          ...payload
        });
        break;
      }
    }
  }
}

Quiz.modelName = 'Quiz';

Quiz.fields = {
  id: attr(),
  title: attr(),
  answers: many('Answer')
};

Quiz.defaultProps = {
  title: '',
  answers: []
};

export default Quiz;
