/*********
 * LIB
 */
// redux
import { createSelector as ormCreateSelector } from 'redux-orm';
import { createSelector } from 'reselect';
import { pageSelectors } from 'redux/modules/page';
/*******
 * Local
 */
import { orm } from 'redux/modules/model';
import { appStateSelectors } from '../appState';
import type { QuizModel, QuizRef } from './actions';

const ormSelector = state => state.orm;

export const getQuizList: () => Array<QuizRef> = createSelector(
  ormSelector,
  pageSelectors.getSelectedPage,
  ormCreateSelector(orm, (session, selectedPage) => {
    const { Page } = session;
    if (selectedPage === null) return [];
    const page = Page.withId(selectedPage.id);
    if (page === null) return [];
    // const quizzes = page.quizzes;

    const result2 = page.quizzes.toModelArray().map(quiz => {
      const answers = quiz.answers.toModelArray().map(answer => {
        return {
          ...answer.ref,
          defaultImage:
            answer.defaultImage !== null ? answer.defaultImage.id : null,
          pushedImage:
            answer.pushedImage !== null ? answer.pushedImage.ref : null,
          pushedSound:
            answer.pushedSound !== null ? answer.pushedSound.ref : null,
          defaultSound:
            answer.defaultSound !== null ? answer.defaultSound.ref : null
        };
      });
      return {
        ...quiz.ref,
        answers
      };
    });

    return result2;
  })
);

export const selectors = {
  getQuizList
};
