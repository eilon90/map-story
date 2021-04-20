import { makeStyles, Typography, TextField, Button } from '@material-ui/core';
import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import {inject, observer} from 'mobx-react';

const Login = inject('UserStore')(observer((props) => {
    const {UserStore} = props;
    const useStyles = makeStyles(() => ({
        login: {
            display: 'flex',
            flexDirection: 'column',
            alignItems:'center'
        },
        title: {
            marginTop: '3%',
            fontWeight: 'bold'
        },
        register: {
            marginTop: '3%',
            fontWeight: 'bold'
        },
        textField: {
            marginBottom: '3%',
            width: '60%'
        },
        button: {
            marginTop: '4%',
            width: '40%'
        },
        errorText: {
            marginTop: '3%',
            fontWeight: 'bold'
        }
    }))
    const classes = useStyles();
    const history = useHistory();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);

    const type = e => {
        switch(e.target.name) {
            case 'email': setEmail(e.target.value);
            break;
            case 'password': setPassword(e.target.value);
            break;
        }
    }

    const login = async () => {
        if (!email) {
            setEmail('');
            setPassword('');
            setEmailError(true);
            setPasswordError(false);
            setError('Please enter your email');
            return
        } else if (!password) {
            setEmail('');
            setPassword('');
            setEmailError(false);
            setPasswordError(true);
            setError('Please enter your password');
            return
        }
        const verify = await UserStore.login(email, password);
        if (verify ==="ok"){
            await UserStore.fetchUser();
            history.push('/');
        } else {
            setEmail('');
            setPassword('');
            setError(verify);
        }
    }  

    return (
        <div className = {classes.login}>
            <Typography className = {classes.title}>Log in</Typography>
            <Button className = {classes.register} color = 'primary' component = {Link} to = '/register'>Create a new account</Button>
            {!emailError ? <TextField className = {classes.textField} label = "Email" name = "email" value = {email} onChange = {type} /> : <TextField value = {email} label = "Enter your Email" error name = "email" onChange = {type} />}
            {!passwordError ? <TextField className = {classes.textField} type = 'password' label = "Enter your Password" value = {password} name = "password" onChange = {type} /> : <TextField value = {password} error label = "Enter your Password" name = "password" onChange = {type} />}
            <Button className = {classes.button} variant = 'contained' color = 'primary' onClick={login}>Log in</Button>
            {error && <Typography className = {classes.errorText} style={{color: 'red'}}>{error}</Typography>}
        </div>
    )
}))

export default Login;