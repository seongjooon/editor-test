import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { getSelectedPageId } from 'redux/modules/page/selectors';
import { getEventGroups } from 'redux/modules/eventGroup/selectors';
import { getScripts, getSelectedScript } from 'redux/modules/script/selectors';
import {
  addScript,
  deleteScript,
  selectScript,
  sortScript,
  updateScript,
  updateScriptWithId
} from 'redux/modules/script/actions';
import { componentActions } from 'redux/modules/component';
import { getSelectedComponentId } from 'redux/modules/appState/selectors';

import {
  EditorState,
  RichUtils,
  convertToRaw,
  convertFromRaw,
  getDefaultKeyBinding,
  KeyBindingUtil
} from 'draft-js';
import Editor from 'draft-js-plugins-editor';
import createMentionPlugin, {
  defaultSuggestionsFilter
} from 'draft-js-mention-plugin';
// import { EditorState, RichUtils, convertToRaw, convertFromRaw } from 'views/shared/draft-js';
// import Editor from 'views/shared/draft-js-plugins-editor';
// import createMentionPlugin, { defaultSuggestionsFilter } from 'views/shared/draft-js-mention-plugin';
import { stringify } from 'query-string';

import Tabs from './Tabs';
import SelectBox from 'views/shared/SelectBox/upper.js';
import popupMaker from 'views/shared/Popup';

// constant
import Language from 'constants/Language';

let timer;

// color https://codepen.io/Kiwka/pen/oBpVve
// color https://github.com/facebook/draft-js/blob/master/examples/draft-0-10-0/color/color.html

const Entry = props => {
  const { mention, theme, searchValue, isFocused, ...parentProps } = props;

  return (
    <div
      {...parentProps}
      style={{
        padding: `8px 11px`,
        borderBottomWidth: `1px`,
        borderBottomStyle: `solid`,
        borderBottomColor: `#b8b8b8`
      }}
    >
      <div>
        <div style={{ color: `#525252`, fontSize: `13px` }}>
          {mention.title}
        </div>
      </div>
    </div>
  );
};

const positionSuggestions = ({ state, props }) => {
  let transform;

  if (state.isActive && props.suggestions.length > 0) {
    transform = 'scaleY(1)';
  } else if (state.isActive) {
    transform = 'scaleY(0)';
  }

  return {
    transform
  };
};

const styleMap = {
  CODE: {
    backgroundColor: 'rgb(221, 221, 221)',
    fontSize: `13px`
  }
};

class StyleButton extends React.Component {
  constructor() {
    super();
    this.onToggle = e => {
      e.preventDefault();
      this.props.onToggle(this.props.style);
    };
  }

  render() {
    let className = 'RichEditor-styleButton';
    if (this.props.active) {
      className += ' RichEditor-activeButton';
    }

    return (
      <span className={className} onMouseDown={this.onToggle}>
        {this.props.label}
      </span>
    );
  }
}

const BLOCK_TYPES = [
  { label: 'Code Block', style: 'code-block' },
  { label: 'UL', style: 'unordered-list-item' }
];
const BlockStyleControls = props => {
  const { editorState } = props;
  const selection = editorState.getSelection();
  const blockType = editorState
    .getCurrentContent()
    .getBlockForKey(selection.getStartKey())
    .getType();
  return (
    <div className="RichEditor-controls">
      {BLOCK_TYPES.map(type => (
        <StyleButton
          key={type.label}
          active={type.style === blockType}
          label={type.label}
          onToggle={props.onToggle}
          style={type.style}
        />
      ))}
    </div>
  );
};

const INLINE_STYLES = [
  { label: 'Bold', style: 'BOLD' },
  { label: 'Underline', style: 'UNDERLINE' },
  { label: 'Monospace', style: 'CODE' }
];
const InlineStyleControls = props => {
  const currentStyle = props.editorState.getCurrentInlineStyle();

  return (
    <div className="RichEditor-controls">
      {INLINE_STYLES.map(type => (
        <StyleButton
          key={type.label}
          active={currentStyle.has(type.style)}
          label={type.label}
          onToggle={props.onToggle}
          style={type.style}
        />
      ))}
    </div>
  );
};

class Scripts extends React.Component {
  constructor(props) {
    super(props);
    const eventGroups = this.props.eventGroups.map(group => ({
      ...group,
      name: group.title
    }));

    this.mentionPlugin = createMentionPlugin({
      eventGroups,
      entityMutability: 'IMMUTABLE',
      positionSuggestions,
      mentionComponent: mentionProps => {
        return <span className="ms-script-btn">{mentionProps.children}</span>;
      }
    });

    this.state = {
      focus: false,
      scripts: [...this.props.scripts],
      selectedPageId: this.props.selectedPageId,
      eventGroups: eventGroups,

      selectedScriptId: null,

      selectedEndEventId: null,
      editorStatus: false,
      editorState: EditorState.createEmpty()
    };
  }

  customSuggestionsFilter = (searchValue, suggestions) => {
    const size = list =>
      list.constructor.name === 'List' ? list.size : list.length;

    const get = (obj, attr) => (obj.get ? obj.get(attr) : obj[attr]);

    const value = searchValue.toLowerCase();
    const filteredSuggestions = suggestions.filter(
      suggestion =>
        !value ||
        get(suggestion, 'name')
          .toLowerCase()
          .indexOf(value) > -1
    );
    const length =
      size(filteredSuggestions) < 10 ? size(filteredSuggestions) : 10;
    return filteredSuggestions.slice(0, length);
  };

  onSearchChange = ({ value }) => {
    this.setState({
      suggestions: this.customSuggestionsFilter(value, this.state.eventGroups)
    });
  };

  onChange = editorState => {
    if (timer) clearTimeout(timer);
    this.setState(
      {
        editorState: editorState
      },
      () => {
        const contentState = this.state.editorState.getCurrentContent();
        const raw = convertToRaw(contentState);
        const { selectedScriptId, selectedEndEventId } = this.state;
        if (raw.blocks[0].text.charCodeAt() > 1200) {
          this.onUpdateScriptWithData(
            JSON.stringify(raw),
            selectedScriptId,
            selectedEndEventId
          );
        } else {
          timer = setTimeout(
            () =>
              this.onUpdateScriptWithData(
                JSON.stringify(raw),
                selectedScriptId,
                selectedEndEventId
              ),
            500
          );
        }
      }
    );
  };

  onUpdateScriptWithData = (raw, selectedScriptId, selectedEndEventId) => {
    const { updateScriptWithId } = this.props;
    updateScriptWithId(raw, selectedScriptId, selectedEndEventId);
  };

  onUpdateScript = () => {
    const { updateScript } = this.props;
    const { selectedEndEventId } = this.state;
    const contentState = this.state.editorState.getCurrentContent();
    const raw = convertToRaw(contentState);
    updateScript(JSON.stringify(raw), selectedEndEventId);
  };

  onSortEnd = ({ oldIndex, newIndex }) => {
    if (oldIndex === newIndex) return;
    const { sortScript } = this.props;
    sortScript(oldIndex, newIndex);
  };

  onSelectScript = scriptId => {
    const { scripts } = this.props;

    if (this.state.selectedScriptId !== scriptId) {
      this.setState(
        {
          focus: false,
          editorStatus: false,
          selectedScriptId: scriptId
        },
        () => {
          const { selectScript } = this.props;
          const { selectedScriptId } = this.state;

          selectScript(selectedScriptId);
          const selectedScript = scripts.find(
            script => script.id === selectedScriptId
          );
          const editorState = EditorState.createWithContent(
            convertFromRaw(JSON.parse(selectedScript.script))
          );

          this.setState({
            selectedEndEventId: selectedScript.onEndEventGroup,
            editorStatus: true,
            editorState: editorState
          });
        }
      );
    }
  };

  onAddScript = () => {
    const { scripts, addScript } = this.props;
    if (scripts.length < 10) {
      const contentState = EditorState.createEmpty().getCurrentContent();
      const raw = convertToRaw(contentState);
      addScript(JSON.stringify(raw));
    } else {
      popupMaker('b', () => {}, [
        [{ type: 'plain', text: Language.json['lang.code.30134'] }]
      ]);
    }
  };

  onDeleteScript = id => {
    popupMaker(
      'a',
      () => {
        const { deleteScript } = this.props;
        deleteScript(id);
      },
      [[{ type: 'plain', text: Language.json['lang.code.30133'] }]]
    );
  };

  onSelectEndEventId = id => {
    this.setState(
      {
        selectedEndEventId: id
      },
      () => {
        this.onUpdateScript();
      }
    );
  };

  onFocus = () => {
    const { selectedComponentId, selectComponent } = this.props;
    const { focus } = this.state;

    if (selectedComponentId === null) {
      this.setState(
        {
          focus: true
        },
        () => {
          this.editor.focus();
        }
      );
    } else {
      // deselect component
      selectComponent(null);
    }
  };

  onBlur = () => {
    this.setState(
      {
        focus: false
      },
      () => {
        this.editor.blur();
        this.editorWrap.scrollTop = 0;
        this.onUpdateScript();
      }
    );
  };

  onEventGroupPopupTrigger = () => {
    const { scripts } = this.props;
    const { selectedScriptId } = this.state;
    const targetScript = scripts.find(script => script.id === selectedScriptId);
    const editorState = EditorState.createWithContent(
      convertFromRaw(JSON.parse(targetScript.script))
    );
    const eventGroups = this.props.eventGroups.map(group => ({
      ...group,
      name: group.title
    }));

    this.setState(
      {
        eventGroups: eventGroups,
        editorStatus: false
      },
      () => {
        this.setState({
          selectedEndEventId: targetScript.onEndEventGroup,
          editorStatus: true,
          editorState: editorState
        });
      }
    );
  };

  toggleBlockType = blockType => {
    this.onChange(RichUtils.toggleBlockType(this.state.editorState, blockType));
  };

  toggleInlineStyle = inlineStyle => {
    this.onChange(
      RichUtils.toggleInlineStyle(this.state.editorState, inlineStyle)
    );
  };

  static getDerivedStateFromProps(props, state) {
    if (!props.scripts.length) {
      return {
        scripts: [...props.scripts],
        selectedScriptId: null
      };
    } else if (props.selectedPageId !== state.selectedPageId) {
      const eventGroups = props.eventGroups.map(group => ({
        ...group,
        name: group.title
      }));

      return {
        selectedPageId: props.selectedPageId,
        eventGroups: eventGroups,

        selectedScriptId: null,
        selectedEndEventId: null,

        editorStatus: false,
        editorState: EditorState.createEmpty()
      };
    }

    // page not change
    else {
      // add script
      if (props.scripts.length > state.scripts.length) {
        return {
          scripts: [...props.scripts],
          selectedScriptId: 'new_script',
          selectedEndEventId: null
        };
      }

      // delete script
      if (props.scripts.length < state.scripts.length) {
        const lastIndex = state.scripts.length - 1;
        let newSelectedScriptIndex = state.scripts.indexOf(
          state.scripts.find(script => script.id === state.selectedScriptId)
        );
        if (lastIndex === newSelectedScriptIndex) {
          newSelectedScriptIndex--;
        }

        return {
          scripts: [...props.scripts],
          selectedScriptId: props.scripts[newSelectedScriptIndex].id,
          selectedEndEventId:
            props.scripts[newSelectedScriptIndex].onEndEventGroup,

          editorStatus: false,
          editorState: 'delete_script'
        };
      }

      // event-group length change
      if (props.eventGroups.length !== state.eventGroups.length) {
        const eventGroups = props.eventGroups.map(group => ({
          ...group,
          name: group.title
        }));
        return {
          eventGroups: eventGroups
        };
      }
    }

    return null;
  }

  shouldComponentUpdate(nextProps, nextState) {
    // page change
    if (nextState.selectedScriptId === null) {
      const { scripts } = nextProps;
      const { eventGroups } = nextState;

      this.mentionPlugin = createMentionPlugin({
        eventGroups,
        entityMutability: 'IMMUTABLE',
        positionSuggestions,
        mentionComponent: mentionProps => {
          return <span className="ms-script-btn">{mentionProps.children}</span>;
        }
      });

      if (scripts.length) {
        this.setState(
          {
            scripts: [...scripts],
            selectedScriptId: scripts[0].id,
            selectedEndEventId: scripts[0].onEndEventGroup
          },
          () => {
            const { selectScript } = this.props;
            const { selectedScriptId } = this.state;

            selectScript(selectedScriptId);
            const editorState = EditorState.createWithContent(
              convertFromRaw(
                JSON.parse(
                  scripts.find(script => script.id === selectedScriptId).script
                )
              )
            );

            this.setState({
              editorStatus: true,
              editorState: editorState
            });
          }
        );
      } else {
        this.onAddScript();
      }

      return true;
    }

    // add script
    else if (nextState.selectedScriptId === 'new_script') {
      const { scripts } = nextProps;
      this.setState(
        {
          selectedScriptId: scripts[scripts.length - 1].id
        },
        () => {
          const { selectScript } = this.props;
          const { selectedScriptId } = this.state;

          selectScript(selectedScriptId);
          const editorState = EditorState.createEmpty();

          this.setState({
            editorStatus: true,
            editorState: editorState
          });
        }
      );

      return true;
    }

    // delete script
    else if (nextState.editorState === 'delete_script') {
      const { scripts, selectScript } = nextProps;
      const { selectedScriptId } = nextState;

      selectScript(selectedScriptId);
      const editorState = EditorState.createWithContent(
        convertFromRaw(
          JSON.parse(
            scripts.find(script => script.id === selectedScriptId).script
          )
        )
      );

      this.setState({
        editorStatus: true,
        editorState: editorState
      });
      return true;
    } else return true;
  }

  componentDidMount() {
    const { scripts } = this.props;
    if (scripts.length) {
      this.setState(
        {
          selectedScriptId: scripts[0].id
        },
        () => {
          const { selectScript } = this.props;
          const { selectedScriptId } = this.state;

          selectScript(selectedScriptId);
          const editorState = EditorState.createWithContent(
            convertFromRaw(
              JSON.parse(
                scripts.find(script => script.id === selectedScriptId).script
              )
            )
          );

          this.setState({
            selectedEndEventId: scripts[0].onEndEventGroup,
            editorStatus: true,
            editorState: editorState
          });
        }
      );
    } else {
      this.onAddScript();
    }
    window.minischool = {};
    window.minischool.onEventGroupPopupTrigger = this.onEventGroupPopupTrigger;
  }
  //@TODO: 문자열 획득
  getTextFromEditorState = () => {
    return this.state.editorState.getCurrentContent().getPlainText('\u0001');
  };

  onKeyBindingFn = event => {
    if (KeyBindingUtil.hasCommandModifier(event) && event.keyCode === 75) {
      return 'bold';
    }
    return getDefaultKeyBinding(event);
  };

  handleKeyCommand = command => {
    if (command === 'backspace') return;

    let newState;
    if (command === 'bold') {
      newState = RichUtils.toggleInlineStyle(this.state.editorState, 'BOLD');
    }

    if (newState) {
      this.setState({ editorState: newState });
      return 'handled';
    }

    return 'not-handled';
  };

  render() {
    const { scripts } = this.props;
    const {
      focus,
      selectedScriptId,
      selectedEndEventId,
      editorStatus,
      editorState
    } = this.state;
    const { MentionSuggestions } = this.mentionPlugin;
    const plugins = [this.mentionPlugin];

    if (!editorStatus) return null;

    let contentState, raw, blank;
    contentState = editorState.getCurrentContent();

    let className = 'editor-wrap RichEditor-editor';

    if (!contentState.hasText()) {
      if (
        contentState
          .getBlockMap()
          .first()
          .getType() !== 'unstyled'
      ) {
        className += ' RichEditor-hidePlaceholder';
      }
    }

    raw = convertToRaw(contentState);

    if (raw.blocks[0].text === '') {
    }

    return [
      <div id="ms-editor-scripts" key={0}>
        <div className="absolute-inner">
          <Tabs
            tabs={scripts}
            axis={'x'}
            lockAxis={'x'}
            lockToContainerEdges={true}
            lockOffset={'0%'}
            helperClass={'script-drag-helper'}
            useDragHandle={true}
            onSortEnd={this.onSortEnd}
            distance={3}
            selectedScriptId={selectedScriptId}
            onSelectScript={this.onSelectScript}
            onAddScript={this.onAddScript}
            onDeleteScript={this.onDeleteScript}
          />

          <div style={{ margin: `0 8px` }}>
            <InlineStyleControls
              editorState={editorState}
              onToggle={this.toggleInlineStyle}
            />
            <BlockStyleControls
              editorState={editorState}
              onToggle={this.toggleBlockType}
            />
          </div>

          <div
            // className='editor-wrap'
            className={className}
            onMouseUp={this.onFocus}
            onMouseDown={this.onFocus}
            style={
              focus
                ? {}
                : {
                    overflowY: `hidden`,
                    backgroundColor: `#ddd`
                  }
            }
            ref={element => {
              this.editorWrap = element;
            }}
          >
            {editorStatus ? (
              // @TODO: 에디터 컴포넌트
              <Editor
                editorState={editorState}
                onChange={this.onChange}
                onBlur={this.onBlur}
                plugins={plugins}
                customStyleMap={styleMap}
                //키 입력 바인딩
                onKeyBindingFn={this.onKeyBindingFn}
                //커맨드 입력시 볼드처리
                handleKeyCommand={this.handleKeyCommand}
                ref={element => {
                  this.editor = element;
                }}
              />
            ) : (
              undefined
            )}
          </div>

          <MentionSuggestions
            style={{
              position: `absolute`,
              overflowY: `auto`,
              height: `200px`,
              top: `38px`,
              right: `8px`,
              margin: 0,
              padding: 0
            }}
            onSearchChange={this.onSearchChange}
            suggestions={this.state.eventGroups}
            entryComponent={Entry}
          />

          <div className="bottom-content-wrap">
            <span className="text" style={{ width: `calc(100% - 320px)` }}>
              {`※ ${Language.json['lang.code.30121']}`}
            </span>
            <span
              className="text"
              style={{ color: `#bdbdbd`, marginRight: `4px` }}
            >{`Next ${Language.json['lang.code.30013']}`}</span>
            <SelectBox
              onSelect={this.onSelectEndEventId}
              value={selectedEndEventId === null ? null : selectedEndEventId}
              placeholder={Language.json['lang.code.30076']}
              options={this.state.eventGroups}
              style={{
                width: `250px`,
                verticalAlign: `middle`,
                zIndex: 5
              }}
            />
          </div>
        </div>
      </div>
    ];
  }
}

const mapStateToProps = state => ({
  selectedComponentId: getSelectedComponentId(state),
  selectedPageId: getSelectedPageId(state),
  eventGroups: getEventGroups(state),
  scripts: getScripts(state)
});

const mapDispatchToProps = dispatch => ({
  addScript: bindActionCreators(addScript, dispatch),
  deleteScript: bindActionCreators(deleteScript, dispatch),
  selectScript: bindActionCreators(selectScript, dispatch),
  sortScript: bindActionCreators(sortScript, dispatch),
  updateScript: bindActionCreators(updateScript, dispatch),
  updateScriptWithId: bindActionCreators(updateScriptWithId, dispatch),
  selectComponent: bindActionCreators(
    componentActions.selectComponent,
    dispatch
  )
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Scripts);
