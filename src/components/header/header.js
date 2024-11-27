
import { Avatar, Button, Flex } from 'antd'
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setUser } from '../../store/reducers/auth-reducer'
import { setApiKeyIntoStorage, setUserIntoStorage } from '../../service/helpers'

import './header.css'

const Header = (props) => {
    const { isLogged, user } = props
    const username = user?.username
    const image = user?.image

    const dispatch = useDispatch()
    const logOutHandler = () => {
        setUserIntoStorage(null)
        dispatch(setUser(null))
        setApiKeyIntoStorage(null)
        window.location.reload()
    }

    const component = isLogged ? (<>
        <Link to='/new-article'>
            <Button className='header__text header__create-article-button'>Create article</Button>
        </Link>
        <Link to='/profile'>
            <span className='header__username'>{ username }</span>
            <Avatar size={ 46 } src={ image } />
        </Link>
        <Button className='header__text header__big-button header__log-out-button' onClick={ logOutHandler }>Log Out</Button>
    </>)
    : (<>
        <Link to='/sign-in'>
            <Button className='header__text header__big-button' type='text'>Sign In</Button>
        </Link>
        <Link to='/sign-up'>
            <Button className='header__sign-up-button header__text header__big-button'>Sign Up</Button>
        </Link>
    </>)

    return (
        <Flex className='header__main-flex header__text' justify='space-between'>
            <Link className='header__text' to='/'>RealWorld Blog</Link>
            <Flex gap={ 18 } style={{ alignItems: 'center' }} >
                { component }
            </Flex>
        </Flex>
    )
}

export default Header