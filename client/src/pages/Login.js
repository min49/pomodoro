import React, {useState} from 'react';
import axios from 'axios';
import {Redirect} from 'react-router-dom';
import {Form, Message} from 'semantic-ui-react';

import config from '../config';
import FormContainer from "../components/FormContainer";
import Reaptcha from 'reaptcha';

function Login(props) {
  const {isAuthenticated, loginSuccessful} = props;
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [recaptchaResponse, setRecaptchaResponse] = useState(null);
  let reaptchaRef = null;

  function login(e) {
    e.preventDefault();

    if (!recaptchaResponse) {
      alert('Please click the reCAPTCHA checkbox.');
      return;
    }

    authenticate(username, password);
  }

  function authenticate(username, password) {
    console.log('in authenticate');
    axios.post(
      `${config.API_ROOT}/api/pomodoro/login`,
      {
        username,
        password,
        'g-recaptcha-response': recaptchaResponse
      },
      {withCredentials: true}
    ).then((res) => {
      if (res.status === 200) {
        loginSuccessful(res.data.username);
      }
    }).catch(err => {
      if (err && err.response && err.response.status === 401) {
        setErrorMessage('Incorrect Username or password');
      } else if (err && err.response && err.response.data && err.response.data.errorMessage) {
        setErrorMessage(err.response.data.errorMessage);
      } else {
        setErrorMessage('Error submitting login.');
        console.error('Error submitting login:');
        console.error(err);
      }
    });
    // reset reCaptcha after form submit, so it is ready to
    // check and resubmit if there's an error returned.
    reaptchaRef.reset();
    setRecaptchaResponse(null);
  }

  if (isAuthenticated) {
    return <Redirect to='/'/>
  } else {
    return (
      <FormContainer title='Log in'>
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

          <Reaptcha
            sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY}
            ref={e => (reaptchaRef = e)}
            onVerify={(gResponse) => setRecaptchaResponse(gResponse)}
            onExpire={() => setRecaptchaResponse(null)}
          />

          <Form.Button primary type='submit'>Log in</Form.Button>
        </Form>
      </FormContainer>
    )
  }
}

export default Login;