import { useDispatch } from 'react-redux';
import { assetCreate, assetUpdate } from '../../redux/modules/asset/actions';
import { Btn } from '../OrmCrudTest';

const dummyData = {
  create: {
    src: 'assetSrc',
    sourceType: null,
    assetType: null,
    createDate: '2000-11-11',
    title: 'test asset',
    fileSize: 12345,
  },
  update: {
    id: 53,
    src: 'assetSrc updated',
    sourceType: null,
    assetType: null,
    createDate: '2000-11-11',
    title: 'test asset updated',
    fileSize: 12345,
  },
};

const Asset = ({ selectors }) => {
  const dispatch = useDispatch();

  const onCreate = () => {
    dispatch(assetCreate(dummyData.create));
  };
  const onUpdate = () => {
    dispatch(assetUpdate(dummyData.update));
  };
  const onDelete = () => {};

  return (
    <div>
      <hr></hr>
      <h3>Asset</h3>
      <Btn onClick={onCreate}>create</Btn>
      <Btn onClick={onUpdate}>update</Btn>
      {/* {JSON.stringify(selectors.asset)} */}
    </div>
  );
};

//@ts-ignore
export default Asset;
