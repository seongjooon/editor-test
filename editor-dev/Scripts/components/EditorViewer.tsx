import { IEditorViewerProps } from 'src/types/Scripts';
import { makeStyles } from '@material-ui/core/styles';
import Editor from '@draft-js-plugins/editor';
import createToolbarPlugin from '@draft-js-plugins/static-toolbar';
import '@draft-js-plugins/static-toolbar/lib/plugin.css';
import { BoldButton, UnderlineButton, CodeButton, UnorderedListButton, CodeBlockButton } from '@draft-js-plugins/buttons';

const staticToolbarPlugin = createToolbarPlugin();
const { Toolbar } = staticToolbarPlugin;
const plugins = [staticToolbarPlugin];

const useStyles = makeStyles(() => ({
  editorStyle: {
    padding: '5px',
    width: '1000px',
    height: '200px',
    border: '5px solid tomato',
    fontSize: '1.8rem',
  },
  scriptWrapperStyle: {
    width: '900px',
    border: '1px solid skyblue',
  },
  editorViewerStyle: {
    boxSizing: 'border-box',
    border: '1px solid #ddd',
    cursor: 'text',
    padding: '16px',
    borderRadius: '2px',
    marginBottom: '2em',
    boxShadow: 'inset 0px 1px 8px -3px #ABABAB',
    background: '#fefefe',
    fontSize: '1.8rem',
  },
  inlineStyle: {
    margin: '0 10px',
    fontSize: '1.5rem',
  },
}));

// 컨트롤과 에디터 박스 함께 묶어서 작업한 것이 에디터스테이트에 잘 담기는지 확인 해야함.
const EditorViewer: React.FC<IEditorViewerProps> = ({ editorState, onEditorChange }) => {
  const classes = useStyles();
  return (
    <div className={classes.editorViewerStyle}>
      <Toolbar>
        {(externalProps) => (
          <>
            <BoldButton {...externalProps} />
            <UnderlineButton {...externalProps} />
            <CodeButton {...externalProps} />
            <UnorderedListButton {...externalProps} />
            <CodeBlockButton {...externalProps} />
          </>
        )}
      </Toolbar>
      <Editor editorState={editorState} onChange={onEditorChange} plugins={plugins} />
    </div>
  );
};

export default EditorViewer;
