import { makeStyles, Theme } from '@material-ui/core/styles';
import { Button, Box, FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';

const useStyles = makeStyles((theme: Theme) => ({
  wrapperStyle: {
    display: 'flex',
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

const ScriptMoveViewer = () => {
  const classes = useStyles();
  return (
    <Box className={classes.wrapperStyle}>
      <Box>원하는 곳에 @ 를 입력하여 이벤트를 추가하세요.</Box>
      <InfoOutlinedIcon />
      <Box>대본 이동 이벤트</Box>
      <FormControl variant="filled" className={classes.formControl}>
        <Select>
          <MenuItem>없음</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
};

export default ScriptMoveViewer;
