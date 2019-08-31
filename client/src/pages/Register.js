import React, {useState} from 'react';
import axios from 'axios';
import {Redirect} from 'react-router-dom';

import config from '../config';

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
      `${config.API_ROOT}/users/register`,
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

  return (
    <div>
      {
        isAuthenticated
          ? <Redirect to='/'/>
          : <form onSubmit={register}>
            <div>
              <label htmlFor='username'>Username</label>
              <input type='text' id='username' onChange={e => setUsername(e.target.value)}
                     value={username} required/>
            </div>

            <div>
              <label htmlFor='password'>Password</label>
              <input type='password' id='password' onChange={e => setPassword(e.target.value)}
                     value={password} required/>
            </div>

            <div>
              <label htmlFor='confirm-password'>Confirm Password</label>
              <input type='password' id='confirm-password' onChange={e => setConfirmPassword(e.target.value)}
                     value={confirmPassword} required/>
            </div>

            {errorMessage && <div>{errorMessage}</div>}

            <button type="submit">Register</button>
          </form>
      }
    </div>
  );
}

export default Register;