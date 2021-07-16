/**
 * export ORM
 */
import { ORM } from 'redux-orm';
import Page from './page/model';
import Book from './book/model';
import Asset from './asset/model';
import Component from './component/model';
import ImageComponent from './component/imageComponent';
import VideoComponent from './component/videoComponent';
import Event from './event/model';
import EventGroup from './eventGroup/model';
import PageGroup from './pageGroup/model';
import Quiz from './quiz/model';
import QuizAnswer from './quizAnswer/model';
import Script from './script/model';
import AppState from './appState/model';

const orm = new ORM({
  stateSelector: (state) => state.orm,
});

orm.register(Page, Book, Asset, Component, Event, EventGroup, PageGroup, ImageComponent, VideoComponent, Quiz, QuizAnswer, Script, AppState);

export default orm;
