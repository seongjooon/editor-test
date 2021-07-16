import { useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  componentAddImage,
  componentAddVideo,
  componentUpdateImage,
  componentUpdateVideo,
  componentDelete,
  componentAddCharacter,
  componentAddTeacherView,
  componentAddStudentView,
} from '../../redux/modules/component/actions';
import { Btn } from '../OrmCrudTest';

const ImageComponent = ({ selectors, modelId }) => {
  const dispatch = useDispatch();

  const videoComponentDummy = {
    create: {
      loop: false,
      asset: 49,
      width: 100,
      height: 100,
      title: 'test video component',
      x: 100,
      y: 100,
    },
    update: {
      loop: false,
      asset: 49,
      width: 200,
      height: 200,
      id: modelId.componentUpdateVideo,
      title: 'test video component updated',
      x: 100,
      y: 100,
    },
  };

  const imageComponentDummy = {
    create: {
      c2Data: null,
      behaviors: [],
      asset: 48,
      width: 650,
      height: 650,
      title: 'test image component',
      x: 100,
      y: 100,
    },
    update: {
      c2Data: null,
      behaviors: [],
      asset: 48,
      width: 350,
      height: 350,
      id: modelId.componentUpdateImage,
      title: 'test image component update',
      x: 200,
      y: 200,
    },
  };

  const characterDummy = {
    width: 298,
    height: 138,
    x: 960,
    y: 382,
    angle: 0,
    opacity: 1,
    visible: true,
    lock: false,
    dragable: false,
    global: false,
    blendMode: 0,
    userInteraction: true,
    zIndex: 1,
    imageComponent: 25,
    videoComponent: null,
    onMouseClick: 2,
    onMouseOver: null,
    type: 'character',
    title: 'test character',
  };

  const studentViewDummy = {
    width: 298,
    height: 138,
    x: 960,
    y: 382,
    angle: 0,
    opacity: 1,
    visible: true,
    lock: false,
    dragable: false,
    global: false,
    blendMode: 0,
    userInteraction: true,
    zIndex: 1,
    imageComponent: 25,
    videoComponent: null,
    onMouseClick: 2,
    onMouseOver: null,
    type: 'character',
    title: 'test character',
  };

  const teacherViewDummy = {
    width: 298,
    height: 138,
    x: 960,
    y: 382,
    angle: 0,
    opacity: 1,
    visible: true,
    lock: false,
    dragable: false,
    global: false,
    blendMode: 0,
    userInteraction: true,
    zIndex: 1,
    imageComponent: 25,
    videoComponent: null,
    onMouseClick: 2,
    onMouseOver: null,
    type: 'character',
    title: 'test character',
  };

  return (
    <div>
      <hr></hr>
      <h3>Component</h3>
      <Btn
        onClick={() => {
          dispatch(componentAddImage(imageComponentDummy.create));
        }}
      >
        add image
      </Btn>
      <Btn
        onClick={() => {
          dispatch(componentAddVideo(videoComponentDummy.create));
        }}
      >
        add video
      </Btn>
      <Btn
        onClick={() => {
          dispatch(componentAddCharacter({ width: 100, height: 200, x: 10, y: 10 }));
        }}
      >
        add character
      </Btn>
      <Btn
        onClick={() => {
          dispatch(componentAddStudentView({ width: 100, height: 200, x: 10, y: 10 }));
        }}
      >
        add studentview
      </Btn>
      <Btn
        onClick={() => {
          dispatch(componentAddTeacherView({ width: 100, height: 200, x: 10, y: 10 }));
        }}
      >
        add teacherview
      </Btn>
      <br></br>
      <Btn
        onClick={() => {
          dispatch(componentUpdateImage(imageComponentDummy.update));
        }}
      >
        update image
      </Btn>
      <Btn
        onClick={() => {
          dispatch(componentUpdateVideo(videoComponentDummy.update));
        }}
      >
        update video
      </Btn>
      <Btn
        onClick={() => {
          dispatch(componentDelete({ id: modelId.componentDeleteImage }));
        }}
      >
        delete image
      </Btn>
      <Btn
        onClick={() => {
          dispatch(componentDelete({ id: modelId.componentDeleteVideo }));
        }}
      >
        delete video
      </Btn>
      {/* {JSON.stringify(selectors.allComps)} */}
      {/* <hr></hr> */}
      {/* <h3>ImageComponent</h3> */}
      {/* {JSON.stringify(selectors.allImageComps)} */}
      {/* <hr></hr> */}
      {/* <h3>VideoComponent</h3> */}
      {/* {JSON.stringify(selectors.allVideoComps)} */}
    </div>
  );
};

export default ImageComponent;
