import { pageAdd, pageDelete, pageUpdateTitle } from '../../redux/modules/page/actions';
import { pageGroupAdd, pageGroupDelete, pageGroupUpdateTitle } from '../../redux/modules/pageGroup/actions';
import { Btn } from '../OrmCrudTest';

const Page = ({ selectors, dispatch, modelId }) => {

  const dummyData = {
    page: {
      create: {
        title: 'test page',
        clearGlobalComponent: false,
        transparent: true,
        ownTexture: false,
        fadeType: 'None',
        bgImage: 35,
        bgSound: 36,
        bgSoundProperty: {
          stopNextScene: true,
          allowMixed: true,
          isMusic: true,
          loop: false,
          volume: 3,
        },
        onLoadStart: null,
        thumbnail: '',
        zIndex: 1,
        matchings: [],
        drawingSize: 0,
        drawingInit: 0,
        pageSync: 1,
      },
      update: {
        title: 'test page updated',
        clearGlobalComponent: false,
        transparent: true,
        ownTexture: false,
        fadeType: 'None',
        bgImage: 35,
        bgSound: 36,
        bgSoundProperty: {
          stopNextScene: true,
          allowMixed: true,
          isMusic: true,
          loop: false,
          volume: 3,
        },
        onLoadStart: null,
        thumbnail: '',
        zIndex: 1,
        matchings: [],
        drawingSize: 0,
        drawingInit: 0,
        pageSync: 1,
        id: modelId.pageUpdate,
      },
    },
    pageGroup: {
      create: {
        zIndex: 0,
        pageGroupTitle: 'test pagegroup',
        pageTitle: 'test pagetitle from pagegroup'
      },
      update: {
        title: 'test pagegroup updated',
        zIndex: 0,
        id: modelId.pageGroupUpdate,
      },
    },
  };

  return (
    <div>
      {/* {JSON.stringify(selectors.allPages)} */}
      <hr></hr>
      <h3>Page Group</h3>
      <Btn
        onClick={() => {
          dispatch(pageGroupAdd(dummyData.pageGroup.create));
        }}
      >
        create
      </Btn>
      <Btn
        onClick={() => {
          dispatch(pageGroupUpdateTitle(dummyData.pageGroup.update));
        }}
      >
        update
      </Btn>
      <Btn
        onClick={() => {
          dispatch(pageGroupDelete({ id: modelId.pageGroupDelete }));
        }}
      >
        delete
      </Btn>
      <br></br>
      <hr></hr>
      <h3>Page</h3>
      <Btn
        onClick={() => {
          dispatch(pageAdd(dummyData.page.create));
        }}
      >
        create
      </Btn>
      <Btn
        onClick={() => {
          dispatch(pageUpdateTitle({title: 'page title updated', id: modelId.pageUpdate}));
        }}
      >
        update
      </Btn>
      <Btn
        onClick={() => {
          dispatch(pageDelete({ id: modelId.pageDelete }));
        }}
      >
        delete
      </Btn>
      <br></br>
      {/* {JSON.stringify(selectors.allPageGroups)} */}
    </div>
  );
};

export default Page;
