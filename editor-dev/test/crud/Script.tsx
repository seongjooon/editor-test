import Hoc from './Hoc';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Btn } from '../OrmCrudTest';
import { scriptAdd, scriptUpdate, scriptDelete } from '../../redux/modules/script/actions';

const dummyData = {
  create: {
    script: 'test script',
    onEndEventGroup: null,
    zIndex: 0,
  },
  update: {
    id: 3,
    script: 'test script updated',
    onEndEventGroup: null,
    zIndex: 5,
  },
};

const Script = ({ selectors }) => {
  const dispatch = useDispatch();

  const onCreate = () => {
    dispatch(scriptAdd(dummyData.create));
  };

  const onUpdate = () => {
    dispatch(scriptUpdate(dummyData.update));
  };

  const onDelete = () => {
    dispatch(scriptDelete({ id: 3 }));
  };

  return (
    <div>
      <hr></hr>
      <h3>Script</h3>
      <Btn onClick={onCreate}>create</Btn>
      <Btn onClick={onUpdate}>update</Btn>
      <Btn onClick={onDelete}>delete</Btn>
      {/* {JSON.stringify(selectors.script)} */}
    </div>
  );
};

//@ts-ignore
export default Script;
