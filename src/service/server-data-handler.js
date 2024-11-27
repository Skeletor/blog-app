
import { getApiKeyFromStorage, setApiKeyIntoStorage } from "./helpers"

export default class ServerDataHandler {
    static _baseUrl = 'https://blog-platform.kata.academy/api'
    static _api = getApiKeyFromStorage()

    // -------------------------------------------------
    // Like, dislike articles
    static likeArticle = async (bool, slug) => await bool ? this.putLikeOnArticle(slug) : this.removeLikeFromArticle(slug)
    static putLikeOnArticle = async (slug) => await this.post(`/articles/${slug}/favorite`)
    static removeLikeFromArticle = async (slug) => await this.delete(`/articles/${slug}/favorite`)
    // -------------------------------------------------

    // -------------------------------------------------
    // Get, create, update, delete articles
    static getArticles = async (page = 1) => await this.get(`/articles?limit=${this.getPageSize()}&offset=${this.getPageSize() * (page - 1)}`)
    static createArticle = async (article) => await this.post(`/articles`, { article })
    static updateArticle = async (article, slug) => await this.put(`/articles/${slug}`, { article })
    static deleteArticle = async (slug) => await this.delete(`/articles/${slug}`)
    // -------------------------------------------------

    // -------------------------------------------------
    // Register, login, update
    static registerNewUser = async (user) => await this.post(`/users`, { user })
    static logIn = async (user) => await this.post('/users/login', { user })
    static updateUser = async (user) => await this.put('/user', { user })
    // -------------------------------------------------

    // -------------------------------------------------
    // Get, post, put, delete
    static get = async (url, body) => await this.send(url, 'GET', body)
    static post = async (url, body) => await this.send(url, 'POST', body)
    static put = async (url, body) => await this.send(url, 'PUT', body)
    static delete = async (url, body) => await this.send(url, 'DELETE', body)
    // -------------------------------------------------

    static async send(url, method, body) {
        const data = await fetch(this._baseUrl + url, {
            method,
            headers: {
                Authorization: `Token ${this._api}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        })

        const json = await data.json()

        this._api = json?.user?.token || this._api
        setApiKeyIntoStorage(this._api || null)

        return json
    }

    static getPageSize = () => 5
}
