
export const getFormattedDate = (date) => {
    const dateObj = new Date(date)
    const month = dateObj.toLocaleString('default', { month: 'long' })
    const day = dateObj.getDate()
    const year = dateObj.getFullYear()

    return `${month} ${day}, ${year}`
}

export const getProperText = (text, length = 32) => {
    if (text === undefined)
        return ''

    const editedText = text.slice(0, length)
    if (editedText.length === length)
        return editedText.concat('...')

    return editedText
}

export const getApiKeyFromStorage = () => sessionStorage.getItem('API')
export const setApiKeyIntoStorage = (api) => sessionStorage.setItem('API', api)

export const getUserFromStorage = () => JSON.parse(sessionStorage.getItem('user'))
export const setUserIntoStorage = (user) => sessionStorage.setItem('user', JSON.stringify(user))

export const validateEmail = (email) => {
    const regExp = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i
    const result = regExp.test(email)
    return result || 'Invalid email'
}

export const getUniqueId = (prefix = 'id') => prefix.toString() + Math.random().toString(16).slice(2)