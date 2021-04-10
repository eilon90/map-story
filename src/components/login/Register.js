import { makeStyles, Typography, TextField, Button } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import {inject, observer} from 'mobx-react';

const Register = inject('UserStore', 'MapStore')(observer((props) => {
    const {UserStore, MapStore} = props;
    const useStyles = makeStyles(() => ({
        register: {
            display: 'flex',
            flexDirection: 'column',
            alignItems:'center'
        },
        title: {
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

    const [userName, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [password, setPassword] = useState(''); 
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('')

    const register = async () => {
        if (password !== confirmPassword) {
            setError('Passwords must match!');
            return;
        }
        if (!userName || !email || !firstName || !lastName || !password) {
            setError('You must fill in all fields!');
            return;
        }
        const newUser = {
            userName: userName,
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: password,
        }
        const verify = await UserStore.registerUser(newUser);
        if (verify === "ok"){
            await UserStore.fetchUser();
            history.push('/');
        } 
        else {
            setUserName('');
            setEmail('');
            setFirstName('');
            setLastName('');
            setPassword('');
            setConfirmPassword('');
            setError(verify);
        }
    }

    return (
        <div className = {classes.register}>
            <Typography className = {classes.title} variant = 'h6'>Create a new account</Typography>
            <TextField className = {classes.textField} value = {userName} onChange = {e => setUserName(e.target.value)} label="User name" />
            <TextField className = {classes.textField} value=  {firstName} onChange = {e => setFirstName(e.target.value)} label="First name" />
            <TextField className = {classes.textField} value = {lastName} onChange = {e => setLastName(e.target.value)} label="Last name" />
            <TextField className = {classes.textField} value = {email} onChange = {e => setEmail(e.target.value)} label="Email" />
            <TextField className = {classes.textField} value = {password} type = 'password' onChange = {e => setPassword(e.target.value)} label="Password" />
            <TextField className = {classes.textField} value = {confirmPassword} type = 'password' onChange = {e => setConfirmPassword(e.target.value)} label="Confirm password" />
            <Button className = {classes.button} variant = 'contained' color = 'primary' onClick  = {register}>Register</Button>
            {error && <Typography className = {classes.errorText} style={{color: 'red'}}>{error}</Typography>}
        </div>
    )
}))

export default Register;