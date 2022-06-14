import React, { useState } from 'react';
import { Avatar, Button, Paper, Container, Typography, Grid } from '@material-ui/core';
import useStyles from './styles';
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";

const Auth = () => {
    const classes = useStyles();
    const isSignup = false;
    const [showPassword, setShowPassword] = useState(false);
    const handleSubmit = () => {

    }
    const handleShowPassword = () => {
        setShowPassword((prevShowPassword) => !prevShowPassword);
    }

    return(
        <>
            <Container component='main' maxWidth='xs'>
                <Paper className={classes.paper} elevation={3}>
                    <Avatar className={classes.avatar}>
                        <LockOutlinedIcon/>
                    </Avatar>
                    <Typography variant='h5'>{isSignup ? 'Sign Up' : 'Sign In'}</Typography>
                    <form className={classes.form} onSubmit={handleSubmit}>
                        <Grid container spacing={2}>
                            {
                                isSignup && (
                                    <>
                                        <Input name='firstName' label='First Name' handleChange={handleChange} autoFocus half/>
                                        <Input name='lastName' label='Last Name' handleChange={handleChange} half/>
                                    </>
                                )
                            }
                            <Input name='email' label='email' handleChange={handleChange} type='email'/>
                            <Input name='password' label='password' handleChange={handleChange} type={showPassword ? 'text' : 'password'}/>
                            {isSignup && <Input name='confirmPassword' label='Repeat Password' handleChange={handleChange} type='password'/>}
                        </Grid>
                        <Button variant='contained' type='submit' fullWidth color='primary' className={classes.submit}>
                            {isSignup ? 'Sign Up' : 'Sign In'}
                        </Button>
                    </form>
                </Paper>
            </Container>
        </>
    );
}

export default Auth;