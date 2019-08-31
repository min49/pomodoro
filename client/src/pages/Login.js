import React, {useState} from 'react';
import axios from 'axios';
import {Redirect} from 'react-router-dom';

import config from '../config';

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

  return (
    <div>
      {
        isAuthenticated
          ? <Redirect to='/'/>
          : (<form onSubmit={login}>
            <div>
              <label htmlFor="username">Username</label>
              <input type="text" id="username" onChange={e => setUsername(e.target.value)}
                     value={username} required/>
            </div>

            <div>
              <label htmlFor="password">Password</label>
              <input type="password" id="password" onChange={e => setPassword(e.target.value)}
                     value={password} required/>
            </div>

            {errorMessage && <div>{errorMessage}</div>}

            <button type='submit'>Log in</button>
          </form>)
      }
    </div>
  )
}

export default Login;