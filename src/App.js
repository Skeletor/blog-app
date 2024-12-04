
import Header from './components/header/header';
import ArticleList from './components/article-list/article-list';
import ArticleFullscreen from './components/article-fullscreen/article-fullscreen';
import CreateArticle from './components/create-article/create-article';
import Pagination from './components/pagination/pagination';
import SignInPage from './components/sign-in-page/sign-in-page';
import SignUpPage from './components/sign-up-page/sign-up-page';
import ProfilePage from './components/profile-page/profile-page';
import { Spin } from 'antd'

import ServerDataHandler from './service/server-data-handler';
import { getUserFromStorage } from './service/helpers';

import { requestArticles } from './store/reducers/articles-reducer';

import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom'

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import './App.css';


const App = () => {

  const currentPage = useSelector(state => state.pageReducer.page)
  const articles = useSelector(state => state.articlesReducer.articles)
  const totalArticles = useSelector(state => state.articlesReducer.totalArticles)
  const hasError = useSelector(state => state.articlesReducer.hasError)
  const isLoading = useSelector(state => state.articlesReducer.isLoading)

  const user = useSelector(state => state.authReducer.user) || getUserFromStorage()
  const isLogged = !!user

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(requestArticles(currentPage))
  }, [currentPage])

  const errorComponent = <h2>Something went wrong with retieving the data. Reload the page.</h2>

  const loadingComponent = <div className='app__loading-spin'>
                            <Spin />
                           </div>

  const mainComponent = <Switch>
                          <Route path='/articles/' exact render={() =>
                              <>
                                <ArticleList articles={ articles } />
                                <Pagination pageSize={ ServerDataHandler.getPageSize() } total={ totalArticles } />
                              </>
                          } />

                          <Route path='/articles/:slug' exact render={(props) => {
                            const { slug } = props.match.params
                            const article = articles.find(item => item.slug === slug)
                            if (!article)
                              return <Redirect to='/articles/' />

                            return <ArticleFullscreen { ...props } article={ article } user={ user } /> }
                          } />

                          <Route path='/sign-in' render={(props) => {
                            return <SignInPage { ...props } isLogged={ isLogged } />
                          }} />

                          <Route path='/sign-up' render={(props) => {
                            return <SignUpPage {...props} isLogged={ isLogged } />
                          }} />

                          <Route path='/profile' render={(props) => {
                            return <ProfilePage {...props} isLogged={ isLogged } user={ user } />
                          }} />

                          <Route path='/new-article' render={(props) => {
                            return <CreateArticle {...props} isLogged={ isLogged } />
                          }} />

                          <Route path='/articles/:slug/edit' exact render={(props) => {
                            const { slug } = props.match.params
                            const article = articles.find(item => item.slug === slug)
                            return <CreateArticle {...props} isLogged={ isLogged } article={ article } />
                          }} />

                          <Redirect to='/articles/' />
                      </Switch>

  const renderComponent = () => {
    if (hasError)
      return errorComponent

    if (isLoading)
      return loadingComponent

    return mainComponent
  }

  return (
    <Router>
      <Header isLogged={ isLogged } user={ user } />
      { renderComponent() }
    </Router>
  );
}

export default App;
