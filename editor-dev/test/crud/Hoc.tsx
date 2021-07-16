import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { bookLoad } from '../../redux/modules/book/actions';
import axios from 'axios';

const Hoc = (WrappedComponent) => {
  const dispatch = useDispatch();

  
  const Component = props => {
    return (
      <div>
        <h1>HOC</h1>
        <WrappedComponent {...props}/>
      </div>
    );
  };

  return Component;
}


export default Hoc;