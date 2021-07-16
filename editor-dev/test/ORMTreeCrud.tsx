import { useState, useEffect } from 'react';
import axios from 'axios';
import _ from 'lodash';
import { OrmState } from 'redux-orm';
import IndexedModelClasses from 'redux-orm';
import { useSelector, useDispatch } from 'react-redux';
import Languages from '../languages'

//materialui
import { makeStyles } from '@material-ui/core/styles';
import TreeView from '@material-ui/lab/TreeView';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import TreeItem from '@material-ui/lab/TreeItem';
import TextField from '@material-ui/core/TextField';

//actions
import { bookLoad } from '../redux/modules/book/actions';
import { appStateInit } from '../redux/modules/appState/actions';

//selectors
import { selectBooks } from '../redux/modules/book/selectors';
import { selectAssets } from '../redux/modules/asset/selectors';
import { selectComponents, getAllImageComponents, getAllVideoComponents } from '../redux/modules/component/selectors';
import { selectEvents } from '../redux/modules/event/selectors';
import { selectEventGroups } from '../redux/modules/eventGroup/selectors';
import { selectPages } from '../redux/modules/page/selectors';
import { selectPageGroups } from '../redux/modules/pageGroup/selectors';
import { selectScript } from '../redux/modules/script/selectors';
import { selectQuiz } from '../redux/modules/quiz/selectors';
import { selectAnswer } from '../redux/modules/quizAnswer/selectors';
import { getAllAppState } from '../redux/modules/appState/selectors';
import { SelectorState } from '../interface/redux/model';

//components
import { Btn } from './ORMDataTestView';
import Asset from './crud/Asset';
import Book from './crud/Book';
import Component from './crud/Component';
import Event from './crud/Event';
import Page from './crud/Page';
import Script from './crud/Script';

const getRandomId = () => {
  return _.random(0, 9999999).toString();
};

//트리 그리기
const drawTree = (data: any, treeId: string) => {
  if (Array.isArray(data)) {
    return (
      <TreeItem nodeId={getRandomId()} label={treeId}>
        {data.map((item1, index1) => {
          return drawTree(item1, index1.toString());
        })}
      </TreeItem>
    );
  } else if (data === null || data === undefined) {
    return <TreeItem key={`${treeId}`} nodeId={getRandomId()} label={`${treeId} - ${data}`} />;
  } else {
    return (
      <TreeItem nodeId={getRandomId()} label={treeId}>
        {Object.keys(data).map((key, index2) => {
          const elem = data[key];

          if (typeof elem === 'string' || typeof elem === 'number' || typeof elem === 'boolean') {
            return <TreeItem key={`${treeId}-${index2}`} nodeId={getRandomId()} label={`${key} - ${elem}`} />;
          } else if (elem === null) {
            return <TreeItem key={`${treeId}-${index2}`} nodeId={getRandomId()} label={`${key} - NULL`} />;
          } else {
            return drawTree(elem, key);
          }
          // } else if (Array.isArray(elem)) {
          //   return drawTree(elem, key);
        })}
      </TreeItem>
    );
  }
};

const ORMTreeCrud = () => {
  const useStyles = makeStyles({
    root: {
      height: 240,
      flexGrow: 1,
      maxWidth: 1000,
    },
  });
  const classes = useStyles();

  const dispatch = useDispatch();
  const selectors = useSelector((state: SelectorState) => ({
    books: selectBooks(state),
    assets: selectAssets(state),
    components: selectComponents(state),
    imageComponents: getAllImageComponents(state),
    videoComponents: getAllVideoComponents(state),
    events: selectEvents(state),
    eventGroups: selectEventGroups(state),
    pages: selectPages(state),
    pageGroups: selectPageGroups(state),
    script: selectScript(state),
    quiz: selectQuiz(state),
    quizAnswer: selectAnswer(state),
    appState: getAllAppState(state),
  }));

  const [modelId, setModelId] = useState({
    pageGroupUpdate: 0,
    pageGroupDelete: 0,
    pageUpdate: 0,
    pageDelete: 0,
    eventGroupUpdate: 0,
    eventGroupDelete: 0,
    eventUpdate: 0,
    eventDelete: 0,
    componentUpdateImage: 0,
    componentUpdateVideo: 0,
    componentDeleteImage: 0,
    componentDeleteVideo: 0,
    assetUpdate: 0,
    scriptUpdate: 0,
    scriptDelete: 0,
  });

  const onChangeId = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    const _modelId = { ...modelId };
    _modelId[id] = Number(value);

    setModelId((prevState) => {
      console.log(prevState, _modelId);
      return _modelId;
    });
  };

  useEffect(() => {
    const fetchBaseApi = async () => {
      console.log('@@@@@@@@@@@@@@@@@@@@45555')
      const res = await axios.post('https://dev-papi.minischool.co.kr/v3/book/findBookInfo', {
        book_id: 2993,
        class_key: 'ErbVBvemKO0HyXKcpicl',
        token: '67221c364e8a40cf98f80d30ac391e18',
        // book_id: 3029,
        // class_key: 'eZNwmjshi24UVXoLR0MD',
        // token: '67221c364e8a40cf98f80d30ac391e18',
      });
      // await Languages.getLanguagePack();
      const baseData = JSON.parse(res.data.result.raw_data);
      dispatch(appStateInit({}));
      dispatch(bookLoad(baseData));
      console.log(Languages.getString(43008));
    };
    fetchBaseApi();
  }, []);

  return (
    <div style={{ display: 'flex' }}>
      <div style={{ margin: '20px' }}>
        <ModelIdInput modelId={modelId} onChangeId={onChangeId}></ModelIdInput>
        <Book selectors={selectors} dispatch={dispatch} modelId={modelId}></Book>
        <Page selectors={selectors} dispatch={dispatch} modelId={modelId}></Page>
        <Event selectors={selectors} modelId={modelId}></Event>
        <Component selectors={selectors} modelId={modelId}></Component>
        <Asset selectors={selectors}></Asset>
        <Script selectors={selectors}></Script>
      </div>
      <hr></hr>
      <TreeView className={classes.root} defaultCollapseIcon={<ExpandMoreIcon />} defaultExpandIcon={<ChevronRightIcon />}>
        {drawTree(selectors.books, `books ${selectors.books.length}`)}
        <hr></hr>
        {drawTree(selectors.assets, `assets ${selectors.assets.length}`)}
        <hr></hr>
        {drawTree(selectors.components, `components ${selectors.components.length}`)}
        <hr></hr>
        {drawTree(selectors.events, `events ${selectors.events.length}`)}
        <hr></hr>
        {drawTree(selectors.eventGroups, `eventGroups ${selectors.eventGroups.length}`)}
        <hr></hr>
        {drawTree(selectors.pages, `pages ${selectors.pages.length}`)}
        <hr></hr>
        {drawTree(selectors.pageGroups, `pageGroups ${selectors.pageGroups.length}`)}
        <hr></hr>
        {drawTree(selectors.script, `script ${selectors.script.length}`)}
        <hr></hr>
        {drawTree(selectors.quiz, `quiz ${selectors.quiz.length}`)}
        <hr></hr>
        {drawTree(selectors.quizAnswer, `quizAnswer ${selectors.quizAnswer.length}`)}
        <hr></hr>
        {drawTree(selectors.appState, `appState ${selectors.appState.length}`)}
        <hr></hr>
        {drawTree(selectors.imageComponents, `imageComponents ${selectors.imageComponents.length}`)}
        <hr></hr>
        {drawTree(selectors.videoComponents, `videoComponents ${selectors.videoComponents.length}`)}
      </TreeView>
    </div>
  );
};

const ModelIdInput = ({ modelId, onChangeId }) => {
  const getInput = (_id: string) => {
    return <TextField label={_id} id={_id} value={modelId[_id]} onChange={onChangeId}></TextField>;
  };

  return (
    <div>
      {getInput('pageGroupUpdate')}
      {getInput('pageGroupDelete')}
      <br></br>
      {getInput('pageUpdate')}
      {getInput('pageDelete')}
      <br></br>
      {getInput('eventGroupUpdate')}
      {getInput('eventGroupDelete')}
      <br></br>
      {getInput('eventUpdate')}
      {getInput('eventDelete')}
      <br></br>
      {getInput('componentUpdateImage')}
      {getInput('componentUpdateVideo')}
      {getInput('componentDeleteImage')}
      {getInput('componentDeleteVideo')}
      <br></br>
      {getInput('assetUpdate')}
      <br></br>
      {getInput('scriptUpdate')}
      {getInput('scriptDelete')}
      {/* <TextField
        style={{ width: '60px' }}
        label="pageGroupUpdate"
        id="pageGroupUpdate"
        value={modelId.pageGroupUpdate}
        onChange={onChangeId}
      ></TextField>
      <TextField
        style={{ width: '60px' }}
        label="pageGroupDelete"
        id="pageGroupDelete"
        value={modelId.pageGroupDelete}
        onChange={onChangeId}
      ></TextField> */}
    </div>
  );
};

export default ORMTreeCrud;
