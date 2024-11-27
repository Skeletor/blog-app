
import { setPage } from '../../store/reducers/page-reducer'
import { useDispatch, useSelector } from 'react-redux'

import { Pagination as AntdPagination } from 'antd'

import './pagination.css'

const Pagination = (props) => {

    const { pageSize, total } = props
    const page = useSelector(state => state.pageReducer.page)

    const dispatch = useDispatch()

    return (
        <AntdPagination className='pagination'
                        align='center' 
                        defaultCurrent={ page }
                        total={ total }
                        showSizeChanger={ false }
                        pageSize={ pageSize }
                        onChange={ (page) => dispatch(setPage(page)) } />
    )
}

export default Pagination