
import { Button, Card, Input, Form } from 'antd'
import { Link, Redirect } from 'react-router-dom'
import { useForm, Controller } from 'react-hook-form'

import ServerDataHandler from '../../service/server-data-handler'
import { setUser } from '../../store/reducers/auth-reducer'
import { setUserIntoStorage } from '../../service/helpers'

import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { useDispatch } from 'react-redux'

import './sign-in-page.css'


const SignInPage = (props) => {
    const { control, handleSubmit } = useForm();
    const dispatch = useDispatch()
    
    const { isLogged } = props
    if (isLogged)
        return <Redirect to='/' />

    const onSubmit = data => {
        const user = {
            email: data.Email,
            password: data.Password
        }

        ServerDataHandler.logIn(user)
            .then(response => {
                if (response.errors)
                    for (const key in response.errors)
                        toast.error(`${key}: ${response.errors[key]}`)
                else {
                    const { user } = response
                    setUserIntoStorage(user)
                    dispatch(setUser(user))

                    const { history } = props
                    history.push('/')
                    window.location.reload()
                }
            })
            .catch(reason => toast.error(reason.toString()))
    }

    return (
        <>
            <Card className='sign-in-form'>
                <Form onFinish={ handleSubmit(onSubmit) } layout='vertical'>
                    <h3 className='sign-in-form__header'>Sign In</h3>
                    <Form.Item label='Email'>
                        <Controller control={ control }
                                        name='Email'
                                        render={ ({ field }) => <Input {...field} /> } />
                    </Form.Item>

                    <Form.Item label='Password'>
                        <Controller control={ control }
                                        name='Password'
                                        render={ ({ field }) => <Input.Password {...field} /> } />
                    </Form.Item>

                    <Form.Item className='sign-in-form__login-button'>
                        <Button htmlType='submit'>Login</Button>
                    </Form.Item>
                </Form>
                <div className='sign-in-form__to-sign-up'>
                    <span>Don't have an account? {<Link to='/sign-up'>Sign up</Link>}.</span>
                </div>
            </Card>
            <ToastContainer />
        </>
    )
}

export default SignInPage
