import { useState, useEffect } from 'react';
import axios from 'axios';
import { bookLoad } from '../redux/modules/book/actions';
import { quizAdd, quizUpdate, quizDelete } from '../redux/modules/quiz/actions';
import { quizAnswerAdd, quizAnswerUpdate, quizAnswerDelete } from '../redux/modules/quizAnswer/actions';
import { selectBooks } from '../redux/modules/book/selectors';
import { selectAssets } from '../redux/modules/asset/selectors';
import { selectComponents } from '../redux/modules/component/selectors';
import { selectEvents } from '../redux/modules/event/selectors';
import { selectEventGroups } from '../redux/modules/eventGroup/selectors';
import { selectPages } from '../redux/modules/page/selectors';
import { selectPageGroups } from '../redux/modules/pageGroup/selectors';
import { selectScript } from '../redux/modules/script/selectors';
import { selectQuiz } from '../redux/modules/quiz/selectors';
import { selectAnswer } from '../redux/modules/quizAnswer/selectors';
import { getAllAppState } from '../redux/modules/appState/selectors';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Box, Input, TextField } from '@material-ui/core';
import { OrmState } from 'redux-orm';
import IndexedModelClasses from 'redux-orm';
import { makeStyles } from '@material-ui/core/styles';
import TreeView from '@material-ui/lab/TreeView';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import TreeItem from '@material-ui/lab/TreeItem';
import _ from 'lodash';

const getRandomId = () => {
  return _.random(0, 9999999).toString();
};

const ReduxTest = () => {
  const selectors = useSelector((state: OrmState<IndexedModelClasses<any, any>>) => ({
    books: selectBooks(state),
    assets: selectAssets(state),
    components: selectComponents(state),
    events: selectEvents(state),
    eventGroups: selectEventGroups(state),
    pages: selectPages(state),
    pageGroups: selectPageGroups(state),
    script: selectScript(state),
    quiz: selectQuiz(state),
    quizAnswer: selectAnswer(state),
    appState: getAllAppState(state),
  }));

  const [baseData, setBaseData] = useState<any>(null);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [bookForm, setBookForm] = useState({ bookId: 0, urlHash: '' });

  //67221c364e8a40cf98f80d30ac391e18
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchBaseApi = async () => {
      const res = await axios.post('https://dev-papi.minischool.co.kr/v3/book/findBookInfo', {
        book_id: 2926,
        class_key: 'cdFTGhtMoPc2PynA0T3w',
        token: '67221c364e8a40cf98f80d30ac391e18',
        // book_id: 3029,
        // class_key: 'eZNwmjshi24UVXoLR0MD',
        // token: '67221c364e8a40cf98f80d30ac391e18',
      });

      const baseData = JSON.parse(res.data.result.raw_data);
      console.log('## res', baseData);

      dispatch(bookLoad(baseData));
      setBaseData(baseData);
    };

    fetchBaseApi();
  }, []);

  return (
    <div>
      <h1>Orm Data Test View</h1>
      <hr></hr>
      <TextField style={{ width: '200px', margin: '20px' }} id="standard-basic" label="bookId" />
      <TextField style={{ width: '800px', margin: '20px' }} id="standard-basic" label="url hash" />
      <Button style={{ margin: '20px' }} variant="contained" color="primary">
        get rawdata
      </Button>
      <hr></hr>
      <div>
        <h1>Orm Data crud</h1>
      </div>
      <hr></hr>
      <Box>
        <DataTree baseData={baseData} selectors={selectors}></DataTree>
      </Box>
    </div>
  );
};

const DataTree = ({ baseData, selectors }) => {
  const useStyles = makeStyles({
    root: {
      height: 240,
      flexGrow: 1,
      maxWidth: 1000,
    },
  });
  const classes = useStyles();

  const getTreeElementsForArray = (data: any, treeId: string) => {
    return (
      <TreeItem nodeId={getRandomId()} label={treeId}>
        {data.map((item1, index1) => {
          const id = index1.toString();
          return (
            <TreeItem key={id} nodeId={getRandomId()} label={id}>
              {Object.keys(item1).map((key, index2) => {
                const elem = item1[key];

                if (typeof elem === 'string' || typeof elem === 'number') {
                  return <TreeItem key={`${index1}-${index2}`} nodeId={getRandomId()} label={`${key} - ${elem}`} />;
                } else if (elem === null) {
                  return <TreeItem key={`${index1}-${index2}`} nodeId={getRandomId()} label={`${key} - NULL`} />;
                } else if (Array.isArray(elem)) {
                  return getTreeElementsForArray(elem, key);
                } else {
                  return getTreeElementsForObject(elem, key);
                }
              })}
            </TreeItem>
          );
        })}
      </TreeItem>
    );
  };

  const getTreeElementsForObject = (data: any, treeId: string) => {
    return (
      <TreeItem nodeId={getRandomId()} label={treeId}>
        {Object.keys(data).map((key, index2) => {
          const elem = data[key];

          if (typeof elem === 'string' || typeof elem === 'number') {
            return <TreeItem key={`${treeId}-${index2}`} nodeId={getRandomId()} label={`${key} - ${elem}`} />;
          } else if (elem === null) {
            return <TreeItem key={`${treeId}-${index2}`} nodeId={getRandomId()} label={`${key} - NULL`} />;
          } else if (Array.isArray(elem)) {
            return getTreeElementsForArray(elem, key);
          } else {
            return getTreeElementsForObject(elem, key);
          }
        })}
      </TreeItem>
    );
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
    } else {
      return (
        <TreeItem nodeId={getRandomId()} label={treeId}>
          {Object.keys(data).map((key, index2) => {
            const elem = data[key];

            if (typeof elem === 'string' || typeof elem === 'number') {
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

  return (
    <TreeView className={classes.root} defaultCollapseIcon={<ExpandMoreIcon />} defaultExpandIcon={<ChevronRightIcon />}>
      {drawTree(selectors.books, 'books')}
      <hr></hr>
      {drawTree(selectors.assets, 'assets')}
      <hr></hr>
      {drawTree(selectors.components, 'components')}
      <hr></hr>
      {drawTree(selectors.events, 'events')}
      <hr></hr>
      {drawTree(selectors.eventGroups, 'eventGroups')}
      <hr></hr>
      {drawTree(selectors.pages, 'pages')}
      <hr></hr>
      {drawTree(selectors.pageGroups, 'pageGroups')}
      <hr></hr>
      {drawTree(selectors.script, 'script')}
      <hr></hr>
      {drawTree(selectors.quiz, 'quiz')}
      <hr></hr>
      {drawTree(selectors.quizAnswer, 'quizAnswer')}
      <hr></hr>
      {drawTree(selectors.appState, 'appState')}
    </TreeView>
  );
};

export const Btn = ({ children, onClick }: { children: string; onClick?: () => void }) => {
  const _onClick = () => {
    onClick && onClick();
  };

  return (
    <Button style={{ margin: '20px' }} variant="contained" color="primary" onClick={_onClick}>
      {children}
    </Button>
  );
};

export default ReduxTest;
