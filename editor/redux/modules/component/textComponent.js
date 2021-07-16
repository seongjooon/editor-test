/**
 * Created by neo on 2016. 11. 15..
 */

/*********
 * LIB
 */
// redux
import { Model, fk, attr } from 'redux-orm';
import propTypesMixin from 'redux-orm-proptypes';
import { createAction } from 'redux-actions';
// util
import random from 'lodash/random';

/*******
 * LOCAL
 */

/**************
 * Type
 */

export type TextModel = {
  id: number,
  text: string,
  fontSize: number,
  fontColor: string
};

/*****************
 * Constant
 */
const TEXT_COMPONENT_CLEAR = 'TEXT_COMPONENT_CLEAR';
const TEXT_COMPONENT_RECEIVE = 'TEXT_COMPONENT_RECEIVE';
const TEXT_COMPONENT_UPDATE_TITLE = 'TEXT_COMPONENT_UPDATE_TITLE';

/***********************
 *  Action
 */

const _clear = createAction(TEXT_COMPONENT_CLEAR, payload => payload);
const _receive = createAction(TEXT_COMPONENT_RECEIVE, payload => payload);
const _updateTitle = createAction(
  TEXT_COMPONENT_UPDATE_TITLE,
  (payload: ComponentKey) => payload
);

/***************
 * Reducer
 */

const ValidatingModel = propTypesMixin(Model);

class TextComponent extends ValidatingModel {
  props: TextModel;

  toJSON() {
    return {
      ...this.ref
    };
  }

  clone() {
    const clonedData = { ...this.ref };
    delete clonedData.id;

    const { TextComponent } = this.getClass().session;
    return TextComponent.create(clonedData);
  }

  static parse(data) {
    const clonedData = { ...data };
    return this.upsert(clonedData);
  }

  static reducer(action, TextComponent, session) {
    const { payload, type } = action;

    switch (type) {
    }
  }
}

TextComponent.modelName = 'TextComponent';

TextComponent.fields = {
  id: attr(),
  text: attr(),
  fontSize: attr(),
  fontColor: attr()
};

TextComponent.defaultProps = {
  text: 'Text',
  fontSize: 40,
  fontColor: '#123123'
};

export default TextComponent;
