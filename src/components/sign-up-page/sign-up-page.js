
import { Button, Card, Input, Form, Checkbox } from 'antd'
import { Link, Redirect } from 'react-router-dom'
import { useForm, Controller } from 'react-hook-form'

import ServerDataHandler from '../../service/server-data-handler'
import { setUser } from '../../store/reducers/auth-reducer'
import { setUserIntoStorage, validateEmail } from '../../service/helpers'

import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { useDispatch } from 'react-redux'

import './sign-up-page.css'


const SignUpPage = (props) => {
    const { control, handleSubmit, formState: { errors } } = useForm();
    const dispatch = useDispatch()

    const { isLogged } = props
    if (isLogged)
        return <Redirect to='/' />
    
    const onSubmit = data => {
        const user = {
            username: data.FormUsername,
            email: data.FormEmail,
            password: data.FormPassword
        }

       ServerDataHandler.registerNewUser(user).then(response => {
        if (response.errors)
            for (const key in response.errors)
                toast.error(`${key}: ${response.errors[key]}`)
        
        else {
            const { user } = response
            setUserIntoStorage(user)
            dispatch(setUser(user))
        }
       })
       .catch(reason => toast.error(reason.toString()))
    }

    const validateRepeatPassword = (value) => {
        const passwordItem = document.getElementById('signinform-password')
        const password = passwordItem.value
        return password.trim() === '' ? 'Must not be empty' : password !== value ? 'Passwords dont match' : true
    }
  
    return (
        <>
            <Card className='sign-up-form'>
                <Form onFinish={ handleSubmit(onSubmit) } layout='vertical'>
                    <h3 className='sign-up-form__header'>Create new account</h3>
                    <Form.Item label='Username'>
                        <Controller control={ control }
                                    name='FormUsername'
                                    render={ ({ field }) => <Input {...field} /> }
                                    rules={{ required: 'Required', minLength: { value: 3, message: 'Min 3'}, maxLength: { value: 20, message: 'Max 20' } }} />
                    </Form.Item>
                    { errors?.FormUsername && <div className='form__error'>{ errors.FormUsername.message }</div> }

                    <Form.Item label='Email'>
                        <Controller control={ control }
                                    name='FormEmail'
                                    render={ ({ field }) => <Input {...field} />}
                                    rules={{ required: 'Required', validate: validateEmail }} />
                    </Form.Item>
                    { errors?.FormEmail && <div className='form__error'>{ errors.FormEmail.message }</div> }

                    <Form.Item label='Password'>
                        <Controller control={ control }
                                    name='FormPassword'
                                    render={ ({ field }) => <Input.Password id='signinform-password' {...field} />}
                                    rules={{ required: 'Required', minLength: { value: 6, message: 'Min 6' }, maxLength: { value: 40, message: 'Max 40' } }} />
                    </Form.Item>
                    { errors?.FormPassword && <div className='form__error'>{ errors.FormPassword.message }</div> }

                    <Form.Item label='Repeat password'>
                        <Controller control={ control }
                                    name='FormRepeatPassword'
                                    render={ ({ field }) => <Input.Password {...field} />}
                                    rules={{ required: true, validate: validateRepeatPassword }} />
                    </Form.Item>
                    { errors?.FormRepeatPassword && <div className='form__error'>{ errors.FormRepeatPassword.message }</div> }

                    <Form.Item>
                        <Controller control={ control }
                                    name='FormAgree'
                                    render={ ({ field: { onChange } }) => <Checkbox onChange={ onChange } >I agree to the processing of my personal information</Checkbox> }
                                    rules={{ required: 'Must be checked' }} />
                    </Form.Item>
                    { errors?.FormAgree && <div className='form__error'>{ errors.FormAgree.message }</div> }

                    <Form.Item className='sign-up-form__submit-button'>
                        <Button htmlType='submit'>Create</Button>
                    </Form.Item>
                </Form>
                <div className='sign-up-form__to-sign-in'>
                    <span>Already have an account? {<Link to='/sign-in'>Sign in</Link>}.</span>
                </div>
            </Card>
            <ToastContainer />
        </>
    )
}

export default SignUpPage