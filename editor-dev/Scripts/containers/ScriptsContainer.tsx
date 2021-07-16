import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { bookLoad } from '../../../redux/modules/book/actions';
import { selectScript } from '../../../redux/modules/script/selectors';
import { SelectorState } from '../../../interface/redux/model';
import { scriptSelect } from '../../../redux/modules/script/actions';
import { ScriptType } from 'src/types/Scripts';
import ScriptViewer from '../components/ScriptViewer';
import EditorViewer from '../components/EditorViewer';
import ScriptMoveViewer from '../components/ScriptMoveViewer';
import { createEditorStateWithText } from '@draft-js-plugins/editor';

import { EditorState, RichUtils, convertToRaw, convertFromRaw, getDefaultKeyBinding, KeyBindingUtil } from 'draft-js';

const text = 'The toolbar above the editor can be used for formatting text, as in conventional static editors  …';

const ScriptsContainer = () => {
  const dispatch = useDispatch();
  const selectors = useSelector((state: SelectorState) => ({
    script: selectScript(state),
  }));
  // console.log('셀랙터', selectors.script);
  const [scripts, setScripts] = useState<ScriptType[]>([{ id: 0, editorState: createEditorStateWithText(text) }]);
  const [selectedScriptId, setSelectedScriptId] = useState<number>(4);
  const [editorState, setEditorState] = useState<any>(createEditorStateWithText(text));
  const [active, setActive] = useState<boolean>(true);
  const [baseData, setBaseData] = useState<any>(null);

  useEffect(() => {
    const fetchBaseApi = async () => {
      const res = await axios.post('https://dev-papi.minischool.co.kr/v3/book/findBookInfo', {
        // book_id: 2926,
        // class_key: 'cdFTGhtMoPc2PynA0T3w',
        // token: '67221c364e8a40cf98f80d30ac391e18',
        // book_id: 3029,
        // class_key: 'eZNwmjshi24UVXoLR0MD',
        // token: '67221c364e8a40cf98f80d30ac391e18',
        book_id: 3043,
        class_key: 'UVdMKd8oWsCcQ2IfjL3Y',
        token: '67221c364e8a40cf98f80d30ac391e18',
      });

      const baseData = JSON.parse(res.data.result.raw_data);
      console.log('## res', baseData);

      dispatch(bookLoad(baseData));
      setBaseData(baseData);
    };

    fetchBaseApi();

    const selectedScript: any = selectors.script.find((script: any) => script.id === selectedScriptId);
    if (selectors.script.length > 1) {
      const editorState = EditorState.createWithContent(convertFromRaw(JSON.parse(selectedScript.script)));
      console.log('데이타~~~~~~~~~~1!!', editorState);
      setEditorState(editorState);
    }
  }, [dispatch, selectedScriptId, selectors.script]);

  const onScriptClick = (selectedScriptId: number) => {
    setSelectedScriptId(selectedScriptId);
  };

  const createScript = () => {
    if (scripts.length === 10) {
      // TODO: 알림창
      return alert('스크립트는 최대 10개까지 작성이 가능합니다.');
    }
    const initailScriptData = { id: scripts.length, editorState: createEditorStateWithText(text) };
    setScripts([...scripts, initailScriptData]);
  };

  const deleteScript = (scriptId: number) => {
    // TODO: 정말 스크립트를 삭제할 것인지 확인창
    const filteredScripts: ScriptType[] = scripts.filter((script: ScriptType) => script.id !== scriptId);
    let changedScriptId;
    if (filteredScripts.length === 1) {
      changedScriptId = filteredScripts[0].id;
    } else if (scriptId !== selectedScriptId) {
      changedScriptId = selectedScriptId;
    } else {
      const scriptsLength = filteredScripts.length - 1;
      changedScriptId = filteredScripts[scriptsLength].id;
    }
    setSelectedScriptId(changedScriptId);
    setScripts(filteredScripts);
  };

  const onEditorChange = (editorState: any) => {
    setEditorState(editorState);
  };

  return (
    <>
      {/* <ScriptViewer
        scripts={scripts}
        selectedScriptId={selectedScriptId}
        active={active}
        onScriptClick={onScriptClick}
        createScript={createScript}
        deleteScript={deleteScript}
      /> */}
      <EditorViewer editorState={editorState} onEditorChange={onEditorChange} />
      {/* <ScriptMoveViewer /> */}
    </>
  );
};

export default ScriptsContainer;
