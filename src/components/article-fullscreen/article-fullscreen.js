
import { Avatar, Button, Card, Flex, Tag, Popconfirm } from 'antd'
import Icon, { HeartOutlined, HeartFilled } from '@ant-design/icons'
import Markdown from 'markdown-to-jsx'
import { useState } from 'react'
import { useDispatch } from 'react-redux'

import ServerDataHandler from '../../service/server-data-handler'
import { getFormattedDate, getProperText } from '../../service/helpers'
import { updateArticle } from '../../store/reducers/articles-reducer'

import { Link } from 'react-router-dom/cjs/react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import './article-fullscreen.css'


const ArticleFullscreen = (props) => {
   
    const { article = {}, user } = props

    const { author = {}, body, description, createdAt, favoritesCount, favorited, tagList, slug, title } = article
    const { username, image } = author

    const [likeState, setLikeState] = useState(favorited)
    const [likeCountState, setLikeCountState] = useState(favoritesCount)
    const dispatch = useDispatch()

    const isArticleOwner = !!user && user.username === username
    const articleActionsComponent = isArticleOwner ? <Flex className='card--fullscreen__article-actions'>
        <Popconfirm title='Delete the article?'
                    placement='right'
                    onConfirm={() => {
                        ServerDataHandler.deleteArticle(slug)
                            .finally(() => {
                                const { history } = props
                                history.push('/')
                                window.location.reload()
                            })
                    }}>
            <Button danger>Delete</Button>
        </Popconfirm>
        <Link to={`/articles/${slug}/edit`}>
            <Button className='card--fullscreen__edit-article-button'>Edit</Button>
        </Link>
    </Flex> : null

    const likeComponent = likeState ? <Icon className='card__like-button card__like-button--filled' component={ HeartFilled }></Icon>
                                    : <Icon className='card__like-button' component={ HeartOutlined }></Icon>

    const dateToDisplay = getFormattedDate(createdAt)

    const tagComponent = tagList.map((item, index) => <Tag key={ index } className='card--fullscreen__tag-item'>{ getProperText(item) }</Tag>)

    return (
        <>
            <Card className='card--fullscreen'>
                <Flex justify='space-between'>
                    <Flex className='card--fullscreen__content' vertical>
                        <Flex gap={ 12 }>
                            <span className='card--fullscreen__content-title'>
                                { title }
                            </span>
                            <div className='card--fullscreen__content-likes' onClick={() => {
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
                                <span className='card--fullscreen__info'>{ likeCountState }</span>
                            </div>
                        </Flex>
                        <Flex className='card--fullscreen__tag-list'>
                            { tagComponent }
                        </Flex>
                    </Flex>
                    <Flex className='card--fullscreen__info' gap={ 12 }>
                        <Flex vertical >
                            <span className='card--fullscreen__info-name'>{ username }</span>
                            <span className='card--fullscreen__info-date'>{ dateToDisplay }</span>
                        </Flex>
                        <Avatar className='card--fullscreen__info-avatar' src={ image } size={ 46 } />
                    </Flex>
                </Flex>
                <Flex className='card--fullscreen__description-article-actions' justify='space-between'>
                    <span className='card--fullscreen__description card--fullscreen__info'>{ description }</span>
                    { articleActionsComponent }
                </Flex>
                <div className='card--fullscreen__main-body'>
                    <Markdown>{ body }</Markdown>
                </div>
            </Card>
            <ToastContainer />
        </>
    )
}

export default ArticleFullscreen