import React, {useState} from 'react';
import axios from 'axios';
import {Redirect} from 'react-router-dom';
import {Form, Message} from 'semantic-ui-react';

import config from '../config';
import GridContainer from "../components/GridContainer";

function Login(props) {
  const {isAuthenticated, loginSuccessful} = props;
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  function login(e) {
    authenticate(username, password);
    e.preventDefault();
  }

  function authenticate(username, password) {
    console.log('in authenticate');
    axios.post(
      `${config.API_ROOT}/login`,
      {username, password},
      {withCredentials: true}
    ).then((res) => {
      if (res.status === 200) {
        loginSuccessful(res.data.username);
      }
    }).catch(err => {
      if (err && err.response && err.response.status === 401) {
        setErrorMessage('Incorrect Username or password');
      } else {
        setErrorMessage(err);
      }
    });
  }

  if (isAuthenticated) {
    return <Redirect to='/'/>
  } else {
    return (
      <GridContainer title='Log in'>
        <Form onSubmit={login} error={!!errorMessage}>
          <Form.Field required>
            <label htmlFor="username">Username</label>
            <input type="text" id="username" onChange={e => setUsername(e.target.value)}
                   value={username} required/>
          </Form.Field>

          <Form.Field required>
            <label htmlFor="password">Password</label>
            <input type="password" id="password" onChange={e => setPassword(e.target.value)}
                   value={password} required/>
          </Form.Field>

          {errorMessage && <Message error>{errorMessage}</Message>}

          <Form.Button primary type='submit'>Log in</Form.Button>
        </Form>
      </GridContainer>
    )
  }
}

export default Login;