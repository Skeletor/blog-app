import { combineReducers, configureStore } from '@reduxjs/toolkit'
import pageReducer from './reducers/page-reducer'
import articlesReducer from './reducers/articles-reducer'
import authReducer from './reducers/auth-reducer'

const rootReducer = combineReducers({
    pageReducer,
    articlesReducer,
    authReducer
})

export const store = configureStore({
    reducer: rootReducer,
})