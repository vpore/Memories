import React, { useState, useEffect } from 'react';
import { Avatar, Button, Paper, Container, Typography, Grid } from '@material-ui/core';
import useStyles from './styles';
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import { useHistory } from 'react-router-dom';
import Input from './Input';
import {useDispatch} from 'react-redux';
import {GoogleLogin} from 'react-google-login';
import Icon from './icon';
import {gapi} from 'gapi-script';
import {signup, signin} from '../../actions/auth';

const Auth = () => {

  const initialState = {firstName: '', lastName:'', email:'', password: '', confirmPassword:''};

  const classes = useStyles();
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState(initialState);
  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    function start() {
      gapi.client.init({
        clientId: "477301163217-91ln4d45e5jajm2ug21g004gbn73h17u.apps.googleusercontent.com",
        scope: 'email',
      });
    }

    gapi.load('client:auth2', start);
  }, []);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if(isSignUp){
      dispatch(signup(formData, history));
    }
    else{
      dispatch(signin(formData, history));
    }
  }
  const handleShowPassword = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  }
  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
    console.log(formData);
  }
  const switchMode = () => {
    setIsSignUp((prevIsSignUp) => !prevIsSignUp);
    handleShowPassword(false);
  }
  const googleSuccess = async (res) => {
    const result = res?.profileObj;
    const token = res?.tokenId;

    try {
      dispatch({type: 'AUTH', data: {result, token}});
      history.push('/');
    } 
    catch (error) {
      console.log(error);
    }
  }
  const googleFailure = (err) => {
    console.log(err);
    console.log('Google Sign In was unsuccessful. Try again later');
  }

  return (
    <>
      <Container component="main" maxWidth="xs">
        <Paper className={classes.paper} elevation={3}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography variant="h5">
            {isSignUp ? "Sign Up" : "Sign In"}
          </Typography>
          <form className={classes.form} onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              {isSignUp && (
                <>
                  <Input
                    name="firstName"
                    label="First Name"
                    handleChange={handleChange}
                    autoFocus
                    half
                  />
                  <Input
                    name="lastName"
                    label="Last Name"
                    handleChange={handleChange}
                    half
                  />
                </>
              )}
              <Input
                name="email"
                label="Email"
                handleChange={handleChange}
                type="email"
              />
              <Input
                name="password"
                label="Password"
                handleChange={handleChange}
                type={showPassword ? "text" : "password"}
              />
              {isSignUp && (
                <Input
                  name="confirmPassword"
                  label="Repeat Password"
                  handleChange={handleChange}
                  type="password"
                />
              )}
            </Grid>

            <Button
              variant="contained"
              type="submit"
              fullWidth
              color="primary"
              className={classes.submit}
            >
              {isSignUp ? "Sign Up" : "Sign In"}
            </Button>

            <GoogleLogin
              clientId="477301163217-91ln4d45e5jajm2ug21g004gbn73h17u.apps.googleusercontent.com"
              plugin_name='chat'
              render={(renderProps) => (
                <Button
                  classNamae={classes.googleButton}
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={renderProps.onClick}
                  disabled={renderProps.disabled}
                  startIcon={<Icon />}
                >
                  Google Sign In
                </Button>
              )}
              onSuccess={googleSuccess}
              onFailure={googleFailure}
              cookiePolicy='single_host_origin'
            />

            <Grid container justify="flex-end">
              <Grid item>
                <Button onClick={switchMode}>
                  {isSignUp
                    ? "Already have an account? Sign In"
                    : "Dont have an account? Sign Up"}
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Container>
    </>
  );
}

export default Auth;