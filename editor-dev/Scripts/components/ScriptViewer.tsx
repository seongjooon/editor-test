import { IScriptViewerProps, ScriptType } from 'src/types/Scripts';
import { makeStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import AddOutlinedIcon from '@material-ui/icons/AddOutlined';

const useStyles = makeStyles(() => ({
  scriptTitleStyle: {
    display: 'flex',
    alignItems: 'center',
    height: '2rem',
    '&:hover': {
      borderBottom: '1px solid #33A9FF',
    },
  },
  scriptWrapperStyle: {
    height: '4rem',
    display: 'flex',
    alignItems: 'center',
    paddingLeft: '2.15rem',
  },
  btnStyle: {
    minWidth: '0',
    width: '1.5rem',
    height: '1.5rem',
  },
}));

const ScriptViewer: React.FC<IScriptViewerProps> = ({ scripts, selectedScriptId, active, onScriptClick, createScript, deleteScript }) => {
  const classes = useStyles();
  return (
    <div className={classes.scriptWrapperStyle}>
      {scripts.map((script: ScriptType, index: number) => {
        const isSelected = script.id === selectedScriptId;
        return (
          <div
            key={index}
            className={classes.scriptTitleStyle}
            onClick={() => onScriptClick(script.id)}
            style={
              active && {
                borderBottom: isSelected && '1px solid #33A9FF',
                fontWeight: isSelected ? 'bold' : 'normal',
              }
            }
          >
            대본 {index + 1}
            <Button className={classes.btnStyle} onClick={() => deleteScript(script.id)}>
              <CloseIcon fontSize="small" />
            </Button>
          </div>
        );
      })}
      {/* <Button className={classes.btnStyle} onClick={createScript}>
        <AddOutlinedIcon />
      </Button> */}
    </div>
  );
};

export default ScriptViewer;
