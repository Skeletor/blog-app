
import { createSlice } from "@reduxjs/toolkit";
import ServerDataHandler from "../../service/server-data-handler";

const articleSlice = createSlice({
    name: 'articleSlice',
    initialState: {
        articles: [],
        article: null,
        totalArticles: 0,
        isLoading: false,
        hasError: false
    },
    reducers: {
        setTotalArticles(state, action) {
            state.totalArticles = action.payload
        },
        setArticles(state, action) {
            state.articles = action.payload
        },
        updateArticle(state, action) {
            const article = action.payload
            const { slug } = article
            let foundIndex = 0

            state.articles.find((item, index) => {
                foundIndex = index
                return item?.slug === slug
            })

            state.articles.splice(foundIndex, 1, article)
        },
        setIsLoading(state, action) {
            state.isLoading = action.payload
        },
        setError(state) {
            state.hasError = true
        }
    },
})

export const requestArticles = (page = 1) => async (dispatch) => {
    const { setTotalArticles, setArticles, setIsLoading, setError } = articleSlice.actions

    dispatch(setIsLoading(true))
    const data = await ServerDataHandler.getArticles(page)
                                        .catch(() => dispatch(setError()))

    const { articles, articlesCount } = data

    dispatch(setArticles(articles))
    dispatch(setTotalArticles(articlesCount))
    dispatch(setIsLoading(false))
}

export default articleSlice.reducer
export const { updateArticle } = articleSlice.actions