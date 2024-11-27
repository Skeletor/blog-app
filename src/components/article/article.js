
import { Avatar, Card, Flex, Tag } from 'antd'
import Icon, { HeartOutlined, HeartFilled } from '@ant-design/icons'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import { useDispatch } from 'react-redux'

import { getFormattedDate, getProperText } from '../../service/helpers'

import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import ServerDataHandler from '../../service/server-data-handler'
import { updateArticle } from '../../store/reducers/articles-reducer'

import './article.css'

const Article = (props) => {

    const { article } = props
    const { author, createdAt, favorited, favoritesCount, slug, title, description, tagList } = article
    const { username, image } = author

    const [likeState, setLikeState] = useState(favorited)
    const [likeCountState, setLikeCountState] = useState(favoritesCount)
    const dispatch = useDispatch()

    const likeComponent = likeState ? <Icon className='card__like-button card__like-button--filled' component={ HeartFilled }></Icon>
                                    : <Icon className='card__like-button' component={ HeartOutlined }></Icon>

    const tagListComponent = tagList.map((item, index) => {
        return <Tag key={ index }>{ item }</Tag>
    })

    const dateToDisplay = getFormattedDate(createdAt)
    const titleToDisplay = getProperText(title)
    const descriptionToDisplay = getProperText(description, 128)

    return (
        <>
            <Card className='card'>
                <Flex justify='space-between'>
                    <Flex className='card__content' vertical>
                        <Flex gap={ 12 }>
                            <Link className='card__content-title' to={ `/articles/${slug}` }>
                                { titleToDisplay }
                            </Link>
                            <div className='card__content-likes' onClick={() => {
                                ServerDataHandler.likeArticle(!likeState, slug)
                                    .then((resp) => {
                                        const { article } = resp
                                        setLikeState(article.favorited)
                                        setLikeCountState(article.favoritesCount)
                                        dispatch(updateArticle(article))
                                    })
                                    .catch((err) => toast.error(err.toString()))
                            }}>
                                { likeComponent }
                                <span className='card__info'>{ likeCountState }</span>
                            </div>
                        </Flex>
                    </Flex>
                    <Flex className='card__info' gap={ 12 }>
                        <Flex vertical justify='center'>
                            <span className='card__info-name'>{ username }</span>
                            <span className='card__info-date'>{ dateToDisplay }</span>
                        </Flex>
                        <Avatar className='card__info-avatar' size={ 46 } src={ image } />
                    </Flex>
                </Flex>
                <Flex className='card__tags'>
                    { tagListComponent }
                </Flex>
                <span className='card__description card__info'>{ descriptionToDisplay }</span>
            </Card>
            <ToastContainer />
        </>
    )
}

export default Article