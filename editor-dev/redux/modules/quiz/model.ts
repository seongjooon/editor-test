import * as Type from './actionTypes';
import { FADE_TYPE } from '../../../constants/msConstant';

import { Model, many, fk, attr } from 'redux-orm';
import _ from 'lodash';

interface Quiz {
  answers: any;
}

class Quiz extends Model {
  //@TODO: redux handleActions test
  static reducer(action, Quiz, session) {
    const { payload, type } = action;
    const { QuizAnswer, Page } = session;

    switch (type as Type.QuizActionTypes) {
      case Type.QUIZ_ADD: {
        const { title, answers } = payload;
        const newItem = this.create({ title });

        answers.forEach((item) => {
          const newAnswer = QuizAnswer.create(item);
          newItem.answers.add(newAnswer);
        });

        const page = Page.getSelected();
        page.quizzes.add(newItem);
        break;
      }
      case Type.QUIZ_UPDATE: {
        const { id } = payload;
        if (!this.idExists(id)) return;

        this.upsert({ ...payload });
        break;
      }
      case Type.QUIZ_DELETE: {
        const { id } = payload;
        if (!this.idExists(id)) return;
        this.withId(id).delete();
        // QuizAnswer.
        break;
      }
      default:
        break;
    }
  }

  delete() {
    this.answers.toModelArray().forEach(item => {
      item.delete();
    })

    super.delete();
  }

  static parse(data) {
    //@ts-ignore
    const { QuizAnswer } = this.session;
    const clonedData = { ...data };

    if (clonedData.answers) clonedData.answers = clonedData.answers.map((item) => QuizAnswer.parse(item));

    return this.upsert(clonedData);
  }
}

Quiz.modelName = 'Quiz';

Quiz.fields = {
  id: attr(),
  title: attr(),
  answers: many('QuizAnswer'),
};

//@ts-ignore
Quiz.defaultProps = {
  title: '',
  answers: [],
};

export default Quiz;
