import { useState, useEffect } from 'react';
import { Button, Box, Input, TextField } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import { scriptAdd, scriptUpdate, scriptDelete } from '../redux/modules/script/actions';
import axios from 'axios';
import { bookLoad } from '../redux/modules/book/actions';
import { selectScript } from '../redux/modules/script/selectors';
import { selectAssets } from '../redux/modules/asset/selectors';
import { selectComponents, getAllImageComponents, getAllVideoComponents } from '../redux/modules/component/selectors';
import { selectEvents } from '../redux/modules/event/selectors';
import { selectEventGroups } from '../redux/modules/eventGroup/selectors';
import { selectPageGroups } from '../redux/modules/pageGroup/selectors';
import { selectPages } from '../redux/modules/page/selectors';
import { getAllAppState } from '../redux/modules/appState/selectors';
import { selectBooks } from '../redux/modules/book/selectors';
import { appStateInit } from '../redux/modules/appState/actions';
import { SelectorState } from '../interface/redux/model';
import Asset from './crud/Asset';
import Script from './crud/Script';
import Component from './crud/Component';
import Event from './crud/Event';
import Page from './crud/Page';
import Book from './crud/Book';

const OrmCrudTest = () => {
  const dispatch = useDispatch();
  const selectors = useSelector((state: SelectorState) => ({
    script: selectScript(state),
    asset: selectAssets(state),
    allComps: selectComponents(state),
    allImageComps: getAllImageComponents(state),
    allVideoComps: getAllVideoComponents(state),
    allEvents: selectEvents(state),
    allEventGroups: selectEventGroups(state),
    allPages: selectPages(state),
    allPageGroups: selectPageGroups(state),
    appState: getAllAppState(state),
    books: selectBooks(state),
  }));

  useEffect(() => {
    const fetchBaseApi = async () => {
      const res = await axios.post('https://dev-papi.minischool.co.kr/v3/book/findBookInfo', {
        book_id: 2993,
        class_key: 'ErbVBvemKO0HyXKcpicl',
        token: '67221c364e8a40cf98f80d30ac391e18',
        // book_id: 3029,
        // class_key: 'eZNwmjshi24UVXoLR0MD',
        // token: '67221c364e8a40cf98f80d30ac391e18',
      });

      const baseData = JSON.parse(res.data.result.raw_data);
      dispatch(appStateInit({}));
      dispatch(bookLoad(baseData));
    };
    fetchBaseApi();
  }, []);

  return (
    <div>
    
    </div>
  );
};

export const Btn = ({ children, onClick }: { children: string; onClick?: () => void; inputId?: number; onChange?: () => void }) => {
  const _onClick = () => {
    onClick && onClick();
  };

  return (
    <>
      <Button style={{ margin: '20px' }} variant="contained" color="primary" onClick={_onClick}>
        {children}
      </Button>
      {/* <TextField style={{ width: '60px' }} size="small" variant="filled" label="ID" value={inputId} onChange={onChange}></TextField> */}
    </>
  );
};

export default OrmCrudTest;
