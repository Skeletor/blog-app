
import { Button, Card, Input, Form } from 'antd'
import { useForm, Controller } from 'react-hook-form'
import { Redirect } from 'react-router-dom'
import { setUserIntoStorage, validateEmail } from '../../service/helpers'
import { useDispatch } from 'react-redux'

import ServerDataHandler from '../../service/server-data-handler'
import { setUser } from '../../store/reducers/auth-reducer'

import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import './profile-page.css'


const ProfilePage = (props) => {
    const { control, handleSubmit, formState: { errors } } = useForm({ mode: 'onSubmit' });

    const dispatch = useDispatch()
    
    const onSubmit = data => {
        const user = {
            email: data.Email,
            username: data.Username,
            image: data.AvatarUrl
        }

        ServerDataHandler.updateUser(user)
            .then(response => {
                if (response.errors)
                    for (const key in response.errors)
                        toast.error(`${key}: ${response.errors[key]}`)
                else {
                    const { user } = response
                    setUserIntoStorage(user)
                    dispatch(setUser(user))

                    toast.success('Profile data has been updated.')
                }
            })
            .catch(reason => toast.error(reason.toString()))
    }

    const validateUsername = (value) => value.trim() === '' ? 'Must not be empty' : true

    const { isLogged, user } = props
    if (!isLogged)
        return <Redirect to='/sign-in' />

    return (
        <>
            <Card className='profile-form'>
                <Form onFinish={ handleSubmit(onSubmit) } layout='vertical'>
                    <h3 className='profile-form__header'>Edit profile</h3>
                    <Form.Item label='Username'>
                        <Controller control={ control }
                                        name='Username'
                                        render={ ({ field }) => <Input {...field} /> }
                                        rules={{ required: true, validate: validateUsername }}
                                        defaultValue={ user.username } />
                    </Form.Item>
                    { errors?.Username?.message && <div className='form__error'>{ errors.Username.message }</div>}

                    <Form.Item label='Email'>
                        <Controller control={ control }
                                        name='Email'
                                        render={ ({ field }) => <Input {...field} /> }
                                        rules={{ required: true, validate: validateEmail }}
                                        defaultValue={ user.email } />
                    </Form.Item>
                    { errors?.Email?.message && <div className='form__error'>{ errors.Email.message }</div>}

                    <Form.Item label='New password'>
                        <Controller control={ control }
                                        name='NewPassword'
                                        render={ ({ field }) => <Input.Password {...field} /> }
                                        rules={{ required: true, minLength: { value: 6, message: 'Min 6' }, maxLength: { value: 40, message: 'Max 40' }}} />
                    </Form.Item>
                    { errors?.NewPassword?.message && <div className='form__error'>{ errors.NewPassword.message }</div>}

                    <Form.Item label='Avatar image (url)'>
                        <Controller control={ control }
                                        name='AvatarUrl'
                                        render={ ({ field }) => <Input {...field} /> }
                                        defaultValue={ user.image } />
                    </Form.Item>

                    <Form.Item className='profile-form__submit-button'>
                        <Button htmlType='submit'>Save</Button>
                    </Form.Item>
                </Form>
            </Card>
            <ToastContainer />
        </>
    )
}

export default ProfilePage