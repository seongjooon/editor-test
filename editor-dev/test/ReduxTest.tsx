import { useState, useEffect } from 'react';
import axios from 'axios';
import { bookLoad } from '@/redux/modules/book/actions';
import { selectBooks } from '@/redux/modules/book/selectors';
import { selectAssets } from '@/redux/modules/asset/selectors';
import { selectComponents } from '@/redux/modules/component/selectors';
import { selectEvents } from '@/redux/modules/event/selectors';
import { selectEventGroups } from '@/redux/modules/eventGroup/selectors';
import { selectPages } from '@/redux/modules/page/selectors';
import { selectPageGroups } from '@/redux/modules/pageGroup/selectors';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Box } from '@material-ui/core';

const ReduxTest = () => {
    const selectors = useSelector(state => ({
        //@ts-ignore
        _selectBooks: selectBooks(state),
        //@ts-ignore
        _selectAssets: selectAssets(state),
        //@ts-ignore
        _selectComponents: selectComponents(state),
        //@ts-ignore
        _selectEvents: selectEvents(state),
        //@ts-ignore
        _selectEventGroups: selectEventGroups(state),
        //@ts-ignore
        _selectPages: selectPages(state),
        //@ts-ignore
        _selectPageGroups: selectPageGroups(state)
    }))

    const dispatch = useDispatch();

    useEffect(() => {
        const fetchBaseApi = async () => {
            const res = await axios.post('https://dev-papi.minischool.co.kr/v3/book/findBookInfo', {
                book_id: 2926,
                class_key: '1nA1vPmPfVaxS1Xrtv6A',
                token: 'b31b5f5f5ff04d6387da75ac19dd1db6'
            });

            const baseData = JSON.parse(res.data.result.raw_data);
            console.log('## res', baseData)

            dispatch(bookLoad(baseData))
        }

        fetchBaseApi();
    }, [])

    return (
        <div>
            <h1>Redux View</h1>
            {Object.keys(selectors).map((selector, index) => {
                return <ShowLogButton key={index} selector={selectors[selector]}>show data {selector}</ShowLogButton>
            })}
        </div>
    )
}

const ShowLogButton = ({ selector, children }) => {
    return (
        <Box component="div" m={1}>
            <Button variant="contained" color="primary" onClick={() => { console.log(selector) }}>{children}</Button>
        </Box>
    )
}



export default ReduxTest;