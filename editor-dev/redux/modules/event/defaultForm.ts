import Languages from '../../../languages';

export const ACTION = {
  FADE_IN_COMPONENT: 'component/fadeIn',
  FADE_OUT_COMPONENT: 'component/fadeOut',
  FLY_IN_COMPONENT: 'component/flyIn',
  FLY_OUT_COMPONENT: 'component/flyOut',
  MOVE_COMPONENT: 'component/moveTo',
  MOVE_SIZE_COMPONENT: 'component/moveToWithSize',
  SCALE_COMPONENT: 'component/scale',
  ROTATE_COMPONENT: 'component/rotate',
  CHANGE_IMAGE: 'component/changeImage',
  RUN_BEHAVIOR: 'component/runBehavior',
  STOP_BEHAVIOR: 'component/stopBehavior',
  USER_INTERACTION: 'component/userInteraction',
  CHANGE_INVISIBLE_CHARACTER: 'character/invisible',
  PLAY_SOUND: 'sound/play',
  STOP_SOUND: 'sound/stop',
  GOTO_PAGE: 'page/goto',
  URI_REDIRECT: 'uri/redirect',
  CHANGE_INVISIBLE_STUDENT: 'student/invisible',
  CHANGE_INVISIBLE_TEACHER: 'teacher/invisible',
  MATCHING: 'component/matching',
  DRAWING_CONTROLLER: 'drawing/controller',
  DRAWING_CLEAR: 'drawing/clear',
  VOICE_HELPER_SHOW: 'voiceHelper/show',
  VOICE_HELPER_SPEAK: 'voiceHelper/speak',
  VOICE_HELPER_DISAPPEAR: 'voiceHelper/disappear',
};

export const langCodes = {
  FADE_IN_COMPONENT: 30041,
  FADE_OUT_COMPONENT: 30042,
  FLY_IN_COMPONENT: 30043,
  FLY_OUT_COMPONENT: 30044,
  MOVE_COMPONENT: 30045,
  MOVE_SIZE_COMPONENT: 30266,
  SCALE_COMPONENT: 30046,
  ROTATE_COMPONENT: 30047,
  CHANGE_IMAGE: 30048,
  RUN_BEHAVIOR: 30049,
  STOP_BEHAVIOR: 30050,
  USER_INTERACTION: 30288,
  CHANGE_INVISIBLE_CHARACTER: 30289,
  PLAY_SOUND: 30290,
  STOP_SOUND: 30054,
  GOTO_PAGE: 30053,
  URI_REDIRECT: 30233,
  CHANGE_INVISIBLE_STUDENT: 30052,
  CHANGE_INVISIBLE_TEACHER: 30057,
  MATCHING: 30053,
  DRAWING_CONTROLLER: 30055,
  DRAWING_CLEAR: 30056,
  VOICE_HELPER_SHOW: 30021,
  VOICE_HELPER_SPEAK: 30209,
  VOICE_HELPER_DISAPPEAR: 30210,
};

export const customName = Languages.getString(30057);

export const EVENT_ACTION = [
  [
    {
      action: ACTION.FADE_IN_COMPONENT,
      name: Languages.getString(langCodes[ACTION.FADE_IN_COMPONENT]),
      customName,
      target: [],
      property: {
        duration: 1,
        delay: 0,
      },
    },
    {
      action: ACTION.FADE_OUT_COMPONENT,
      name: Languages.getString(langCodes[ACTION.FADE_OUT_COMPONENT]),
      customName,
      target: [],
      property: {
        duration: 1,
        delay: 0,
      },
    },
  ],
  [
    {
      action: ACTION.FLY_IN_COMPONENT,
      name: Languages.getString(langCodes[ACTION.FLY_IN_COMPONENT]),
      customName,
      target: [],
      property: {
        flyType: null, // 0: 아래에서 1:왼쪽 아래에서 2:왼쪽에서 3:왼쪽 위에서 4: 위에서 5: 오른쪽 위에서 6: 오른쪽에서 7:오른쪽 아래에서
        effect: 0,
        duration: 1,
        delay: 0,
      },
    },
    {
      action: ACTION.FLY_OUT_COMPONENT,
      name: Languages.getString(langCodes[ACTION.FLY_OUT_COMPONENT]),
      customName,
      target: [],
      property: {
        flyType: null, // 0: 아래에서 1:왼쪽 아래에서 2:왼쪽에서 3:왼쪽 위에서 4: 위에서 5: 오른쪽 위에서 6: 오른쪽에서 7:오른쪽 아래에서
        effect: 0,
        duration: 1,
        delay: 0,
      },
    },
  ],
  [
    {
      action: ACTION.MOVE_COMPONENT,
      name: Languages.getString(langCodes[ACTION.MOVE_COMPONENT]),
      customName,
      target: [],
      property: {
        x: 100,
        y: 100,
        effect: 0,
        duration: 1,
        delay: 0,
      },
    },
    {
      action: ACTION.MOVE_SIZE_COMPONENT,
      name: Languages.getString(langCodes[ACTION.MOVE_SIZE_COMPONENT]),
      customName,
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
  ],
  [
    {
      action: ACTION.SCALE_COMPONENT,
      name: Languages.getString(langCodes[ACTION.SCALE_COMPONENT]),
      customName,
      target: [],
      property: {
        scale: 1,
        effect: 0,
        duration: 1,
        delay: 0,
      },
    },
  ],
  [
    {
      action: ACTION.ROTATE_COMPONENT,
      name: Languages.getString(langCodes[ACTION.ROTATE_COMPONENT]),
      customName,
      target: [],
      property: {
        angle: 90,
        direction: 0,
        effect: 0,
        duration: 1,
        delay: 0,
      },
    },
  ],
  [
    {
      action: ACTION.CHANGE_IMAGE,
      name: Languages.getString(langCodes[ACTION.CHANGE_IMAGE]),
      customName,
      target: [],
      property: {
        delay: 0,
      },
      asset: null,
    },
  ],
  [
    {
      action: ACTION.RUN_BEHAVIOR,
      name: Languages.getString(langCodes[ACTION.RUN_BEHAVIOR]),
      customName,
      target: [],
      property: {
        behaviors: [0],
        delay: 0,
      },
    },
    {
      action: ACTION.STOP_BEHAVIOR,
      name: Languages.getString(langCodes[ACTION.STOP_BEHAVIOR]),
      customName,
      target: [],
      property: {
        behaviors: [0],
        delay: 0,
      },
    },
  ],
  [
    {
      action: ACTION.PLAY_SOUND,
      name: Languages.getString(langCodes[ACTION.PLAY_SOUND]),
      customName,
      asset: null,
      target: [],
      property: {
        active: true,
        loop: false,
        delay: 0,
        volume: 4,
      },
    },
    {
      action: ACTION.STOP_SOUND,
      name: Languages.getString(langCodes[ACTION.STOP_SOUND]),
      customName,
      asset: null,
      target: [],
      property: {
        type: 0, // 0: all, 1: bgSound, 2: selected sound
        assets: [],
      },
    },
    {
      action: ACTION.GOTO_PAGE,
      name: Languages.getString(langCodes[ACTION.GOTO_PAGE]),
      customName,
      property: {
        pageGroupId: null,
        pageId: null,
        pageTarget: 0,
      },
    },
  ],
  [
    {
      action: ACTION.URI_REDIRECT,
      name: Languages.getString(langCodes[ACTION.URI_REDIRECT]),
      customName,
      property: {
        uri: '',
        back: false,
      },
    },
  ],
  [
    {
      action: ACTION.CHANGE_INVISIBLE_CHARACTER,
      name: Languages.getString(langCodes[ACTION.CHANGE_INVISIBLE_CHARACTER]),
      customName,
      property: {
        visible: false,
      },
    },
    {
      action: ACTION.CHANGE_INVISIBLE_STUDENT,
      name: Languages.getString(langCodes[ACTION.CHANGE_INVISIBLE_STUDENT]),
      customName,
      property: {
        visible: false,
      },
    },
    {
      action: ACTION.CHANGE_INVISIBLE_TEACHER,
      name: Languages.getString(langCodes[ACTION.CHANGE_INVISIBLE_TEACHER]),
      customName,
      property: {
        visible: false,
      },
    },
  ],
  [
    {
      action: ACTION.DRAWING_CONTROLLER,
      name: Languages.getString(langCodes[ACTION.DRAWING_CONTROLLER]),
      customName,
      property: {
        color: '#000000',
        opacity: 0.7,
        size: 'medium', // big, medium, small
      },
    },
    {
      action: ACTION.DRAWING_CLEAR,
      name: Languages.getString(langCodes[ACTION.DRAWING_CLEAR]),
    },
  ],
  [
    {
      action: ACTION.MATCHING,
      name: Languages.getString(langCodes[ACTION.MATCHING]),
      customName,
      property: {
        name: '', // 정답 이름
        assignOperator: '', // 할당 연산자
        compareOperator: '', // 비교 연산자
        value: 0, // 변경되는 값
        initial: 0, // 초기값
        compareValue: 0, // 비교값
      },
    },
  ],
  [
    {
      action: ACTION.VOICE_HELPER_SHOW,
      name: Languages.getString(langCodes[ACTION.VOICE_HELPER_SHOW]),
      customName,
      property: {
        delay: 0,
        position: null,
      },
    },
    {
      action: ACTION.VOICE_HELPER_SPEAK,
      name: Languages.getString(langCodes[ACTION.VOICE_HELPER_SPEAK]),
      customName,
      property: {
        character: null,
        disappearAfterSpeak: false,
        category: null,
        script: null,
        delay: 0,
        volume: 4,
      },
    },
    {
      action: ACTION.VOICE_HELPER_DISAPPEAR,
      name: Languages.getString(langCodes[ACTION.VOICE_HELPER_DISAPPEAR]),
      customName,
      property: {
        delay: 0,
      },
    },
  ],
];
