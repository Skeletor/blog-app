
import Article from '../article/article'
import { getUniqueId } from '../../service/helpers'

import './article-list.css'

const ArticleList = (props) => {

    const { articles } = props

    const articlesCollection = articles.map((item) => {

        return (
            <li className='articles__item' key={ getUniqueId('article') }>
                <Article article={ item } />
            </li>
        )
    })

    return (
        <ul className='articles'>
            { articlesCollection }
        </ul>
    )
}

export default ArticleList