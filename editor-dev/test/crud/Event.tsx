import { useDispatch } from 'react-redux';
import { Btn } from '../OrmCrudTest';
import { eventAdd, eventDelete, eventUpdate } from '../../redux/modules/event/actions';
import { eventGroupAdd, eventGroupDelete, eventGroupUpdateTitle } from '../../redux/modules/eventGroup/actions';
import Languages from '../../languages';
import { EVENT_ACTION } from '../../redux/modules/event/defaultForm';
import { useEffect } from 'react';

const Event = ({ selectors, modelId }) => {
  const dispatch = useDispatch();
  Languages.getLanguagePack();
  useEffect(() => {
    console.log('@@@@@@@@@@@');
  }, []);

  const dummyData = {
    event: {
      create: {
        action: 'component/moveToWithSize',
        name: Languages.getString(30266),
        customName: 'cusptom',
        target: [],
        property: {
          x: 100,
          y: 100,
          width: 100,
          height: 100,
          effect: 0,
          duration: 1,
          delay: 0,
        },
      },
      update: {
        asset: null,
        zIndex: 0,
        action: 'component/fadeIn',
        name: '나타나기',
        property: {
          delay: 0,
          duration: 1,
        },
        customName: 'sampleEvent1 updated',
        id: modelId.eventUpdateId,
      },
    },
    eventGroup: {
      create: {
        egSync: true,
        zIndex: 0,
        title: 'sampleEventGroup new',
      },
      update: {
        egSync: true,
        zIndex: 0,
        title: 'sampleEventGroup new updated',
        id: modelId.eventGroupUpdateId,
      },
    },
  };

  return (
    <div>
      {/* {JSON.stringify(selectors.allEvents)} */}
      <hr></hr>
      <h3>EventGroup</h3>
      <Btn
        onClick={() => {
          dispatch(eventGroupAdd(dummyData.eventGroup.create));
        }}
      >
        eventgroup create
      </Btn>
      <Btn
        onClick={() => {
          dispatch(eventGroupUpdateTitle(dummyData.eventGroup.update));
        }}
      >
        eventgroup update
      </Btn>
      <Btn
        onClick={() => {
          dispatch(eventGroupDelete({ id: 2 }));
        }}
      >
        eventgroup delete
      </Btn>
      <br></br>
      <hr></hr>
      <h3>Event</h3>
      <Btn
        onClick={() => {
          dispatch(eventAdd(dummyData.event.create));
        }}
      >
        create
      </Btn>
      <Btn
        onClick={() => {
          dispatch(eventUpdate(dummyData.event.update));
        }}
      >
        update
      </Btn>
      <Btn
        onClick={() => {
          dispatch(eventDelete({ id: 3 }));
        }}
      >
        delete
      </Btn>
      <br></br>
      {/* {JSON.stringify(selectors.allEventGroups)} */}
    </div>
  );
};

export default Event;
