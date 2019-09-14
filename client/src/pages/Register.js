import React, {useState} from 'react';
import axios from 'axios';
import {Redirect} from 'react-router-dom';
import {Form, Message} from 'semantic-ui-react';

import config from '../config';
import FormContainer from "../components/FormContainer";

function Register(props) {
  const {isAuthenticated, loginSuccessful} = props;
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  function register(e) {
    e.preventDefault();
    if (!passwordIsValid()) {
      setErrorMessage('Password and Confirm Password do not match.');
      return;
    }

    axios.post(
      `${config.API_ROOT}/api/pomodoro/users/register`,
      {username, password},
      {withCredentials: true}
    ).then((res) => {
      if (res.status === 200) {
        loginSuccessful(res.data.username);
      }
    }).catch(err => {
      if (err && err.response) {
        setErrorMessage(err.response.data.errorMessage);
      } else {
        setErrorMessage('An error occurred during Registration. Please try again later.');
      }
    });
  }

  function passwordIsValid() {
    return (password && password === confirmPassword);
  }

  if (isAuthenticated) {
    return <Redirect to='/'/>
  } else {
    return (
      <FormContainer title='Register'>
        <Form onSubmit={register} error={!!errorMessage}>
          <Form.Field required>
            <label htmlFor='username'>Username</label>
            <input type='text' id='username' onChange={e => setUsername(e.target.value)}
                   value={username} required/>
          </Form.Field>

          <Form.Field required>
            <label htmlFor='password'>Password</label>
            <input type='password' id='password' onChange={e => setPassword(e.target.value)}
                   value={password} required/>
          </Form.Field>

          <Form.Field required>
            <label htmlFor='confirm-password'>Confirm Password</label>
            <input type='password' id='confirm-password' onChange={e => setConfirmPassword(e.target.value)}
                   value={confirmPassword} required/>
          </Form.Field>

          {errorMessage && <Message error>{errorMessage}</Message>}

          <Form.Button primary type="submit">Register</Form.Button>
        </Form>
      </FormContainer>
    );
  }
}

export default Register;