import React from 'react';
import {
  SortableContainer,
  SortableElement,
  SortableHandle
} from 'views/shared/react-sortable-hoc';
import { EditorState, convertToRaw } from 'draft-js';

// constant
import Language from 'constants/Language';

const DragLayer = SortableHandle(props => {
  const { tab, number, onSelectScript } = props;

  return (
    <div className="drag-layer" onClick={() => onSelectScript(tab.id)}>
      {`${Language.json['lang.code.30012']} ${number}`}
    </div>
  );
});

const Tab = SortableElement(props => {
  const {
    tab,
    number,
    selectedScriptId,
    onSelectScript,
    onDeleteScript,
    tabLength
  } = props;
  return (
    <div className={`ms-tab ${selectedScriptId === tab.id ? 'active' : ''}`}>
      <DragLayer number={number} tab={tab} onSelectScript={onSelectScript} />
      {tabLength !== 1 ? (
        <span
          className="delete-btn"
          onClick={() => {
            onDeleteScript(tab.id);
          }}
        />
      ) : (
        undefined
      )}
    </div>
  );
});

const Tabs = SortableContainer(props => {
  const {
    tabs,
    selectedScriptId,
    onSelectScript,
    onAddScript,
    onDeleteScript
  } = props;

  const tabLength = tabs.length;

  return (
    <div className="tab-wrap">
      {tabs.map((tab, index) => {
        return (
          <Tab
            key={index}
            index={index}
            number={index + 1}
            tab={tab}
            selectedScriptId={selectedScriptId}
            onSelectScript={onSelectScript}
            onDeleteScript={onDeleteScript}
            tabLength={tabLength}
          />
        );
      })}
      <div id="script-plus-btn" onClick={() => onAddScript()} />
    </div>
  );
});

export default Tabs;
