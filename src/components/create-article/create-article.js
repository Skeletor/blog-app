
import { Button, Card, Input, Form, Flex } from 'antd'
import { useForm, Controller } from 'react-hook-form'
import { useState } from 'react'
import { Redirect } from 'react-router-dom/cjs/react-router-dom'

import ServerDataHandler from '../../service/server-data-handler'
import { getUniqueId } from '../../service/helpers'

import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import './create-article.css'

const MAX_TAGS = 10

const CreateArticle = (props) => {

    const { control, handleSubmit } = useForm();
    const { TextArea } = Input

    const { article = {}, isLogged } = props

    const { body, description, title, slug } = article
    let { tagList } = article
    if (!Array.isArray(tagList) || tagList.length === 0)
        tagList = ['']

    const [tagListState, setTagListState] = useState(tagList)

    const tagListElement = tagListState.slice(0, MAX_TAGS).map((item, index) => {
        const uid = getUniqueId()   // иначе багуется и не может удалить первый элемент, если ключу ставить значение {index}

        const flexStyle = {
            height: '40px',
            gap: '15px',
            marginBottom: '10px'
        }

        const tagInput = <Input onChange={ (e) => tagListState[index] = e.target.value } defaultValue={ item } />

        const deleteButton = <Button className='create-article-form__button'
                                     danger 
                                     onClick={() => { 
            const updated = [...tagListState]
            updated.splice(index, 1)
            setTagListState(updated)
        }}>Delete</Button>

        const addButton = <Button className='create-article-form__add-button create-article-form__button'
                                  onClick={() => {
            const updated = [...tagListState, '']
            setTagListState(updated)
        }}>Add</Button>

        if (tagListState.length === 1)
            return (<Flex style={ flexStyle } key={ uid }>
                { tagInput }
                { addButton }
        </Flex>)

        if ((index === tagListState.length - 1) && tagListState.length < MAX_TAGS)
            return (<Flex style={ flexStyle } key={ uid }>
                { tagInput }
                { deleteButton }
                { addButton }
        </Flex>)

        return (<Flex style={ flexStyle } key={ uid }>
            { tagInput }
            { deleteButton }
        </Flex>)
    })

    const onSubmit = (data) => {
        let properTagList = []
        tagListState.forEach((item) => {
            const tag = item.trim()
            if (tag !== '')
                properTagList.push(tag)
        })
        
        const articleToSend = {
            title: data.Title,
            description: data.ShortDescription,
            body: data.Text,
            tagList: properTagList
        }

        const isCreatingArticle = Object.keys(article).length === 0
        if (isCreatingArticle)
            ServerDataHandler.createArticle(articleToSend)
                .then(() => {
                    const { history } = props
                    history.push('/')
                    window.location.reload()
                })
                .catch((err) => toast.error(err.toString()))
        else
            ServerDataHandler.updateArticle(articleToSend, slug)
                .then(() => {
                    toast.success('Article has been updated.')
                })
                .catch((err) => toast.error(err.toString()))
    }

    const onError = (err) => {
        for (const key in err)
            toast.error(`${key}: ${err[key].message}`)
    }

    const textValidate = (text) => text.trim() === '' ? 'Must not be empty' : true

    if (!isLogged)
        return <Redirect to='/sign-in' />

    return (
        <>
            <Card className='create-article-form'>
                <h3 className='create-article-form__header'>{ Object.keys(article).length === 0 ? 'Create new article' : 'Edit article' }</h3>
                <Form onFinish={ handleSubmit(onSubmit, onError) } layout='vertical'>
                    <Form.Item label='Title'>
                        <Controller control={ control }
                                    name='Title'
                                    render={ ({ field }) => <Input {...field} defaultValue={ title } /> }
                                    rules={{ required: 'Required', validate: textValidate }} />
                    </Form.Item>
                    <Form.Item label='Short description'>
                        <Controller control={ control }
                                    name='ShortDescription'
                                    render={ ({ field }) => <Input {...field} defaultValue={ description } /> }
                                    rules={{ required: 'Required', validate: textValidate }} />
                    </Form.Item>
                    <Form.Item label='Text'>
                        <Controller control={ control }
                                    name='Text'
                                    render={ ({ field }) => <TextArea {...field} rows={ 5 } defaultValue={ body } /> }
                                    rules={{ required: 'Required', validate: textValidate }} />
                    </Form.Item>
                    <Form.Item label='Tags'>
                        { tagListElement }
                    </Form.Item>
                    <Form.Item >
                        <Button className='create-article-form__send-button create-article-form__button' htmlType='submit'>Send</Button>
                    </Form.Item>
                </Form>
            </Card>
            <ToastContainer />
        </>
    )
}

export default CreateArticle