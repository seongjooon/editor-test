import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { bookCreate, bookUpdate } from '../../redux/modules/book/actions';
import { Btn } from '../OrmCrudTest';

const Book = ({ selectors, dispatch, modelId }) => {

  const dummyData = {
    book: {
      create: {
        selectedPageGroupId: 0,
        selectedPageId: 2,
        selectedEventGroupId: null,
        info: {
          bookId: 2993,
          title: 'Test Book for crudTest',
          description: '123',
          coverImageUrl: null,
          endMovieUrl: '',
          targetDevice: 'pc',
        },
        canvasProperty: {
          backgroundColor: 'rgb(255,255,255)',
          width: 1920,
          height: 1080,
          selectionColor: 'blue',
          selectionLineWidth: 2,
          screenOrientation: 'landscape',
          baseRatio: {
            width: 1920,
            height: 1080,
          },
          marginLength: 1360,
          initialSize: {
            width: 889,
            height: 500,
          },
        },
        pageCount: 1,
        componentCount: 2,
        assetCount: 5,
      },
      update: {
        selectedPageGroupId: 0,
        selectedPageId: 2,
        selectedEventGroupId: null,
        info: {
          bookId: 2993,
          title: 'Test Book for crudTest updated',
          description: '123',
          coverImageUrl: null,
          endMovieUrl: '',
          targetDevice: 'pc',
        },
        canvasProperty: {
          backgroundColor: '12228234892342364789236748923784',
          width: 1920,
          height: 1080,
          selectionColor: 'blue',
          selectionLineWidth: 2,
          screenOrientation: 'landscape',
          baseRatio: {
            width: 1920,
            height: 1080,
          },
          marginLength: 1360,
          initialSize: {
            width: 889,
            height: 500,
          },
        },
        id: 1,
        pageCount: 1,
        componentCount: 2,
        assetCount: 5,
      },
    },
  };
  
  return (
    <div>
      <hr></hr>
      <h3>Book</h3>
      <Btn
        onClick={() => {
          dispatch(bookCreate(dummyData.book.create));
        }}
      >
        book create
      </Btn>
      <Btn
        onClick={() => {
          dispatch(bookUpdate(dummyData.book.update));
        }}
      >
        book update
      </Btn>
      <br></br>
      {/* {JSON.stringify(selectors.books)} */}
    </div>
  );
};

export default Book;
