/**
 * Created by neo on 2016. 10. 17..
 */

// @flow

/*********
 * LIB
 */
import { ORM } from 'redux-orm';

/********
 * LOCAL
 */

import Book from './book/actions';
import PageGroup from './pageGroup/actions';
import Page from './page/actions';
import Component from './component/actions';
import ImageComponent from './component/imageComponent';
import VideoComponent from './component/videoComponent';
import EventGroup from './eventGroup/actions';
import Event from './event/actions';
import C2Data from './c2Data/actions';
import Asset from './asset/actions';
import AppState from './appState/actions';
import Script from './script/actions';
import Answer from './answer/actions';
import Quiz from './quiz/actions';

export const orm = new ORM();
orm.register(
  AppState,
  Asset,
  C2Data,
  Event,
  Component,
  ImageComponent,
  VideoComponent,
  EventGroup,
  Page,
  PageGroup,
  Book,
  Script,
  Answer,
  Quiz,
);

export default orm;
