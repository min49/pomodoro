import React, {useState} from 'react';
import axios from 'axios';
import {BrowserRouter as Router, Route} from 'react-router-dom';

import Pomodoro from "./pages/Pomodoro";
import Login from "./pages/Login";
import Stats from "./pages/Stats";

import config from './config';

function App({initialUser}) {
  const [isAuthenticated, setIsAuthenticated] = useState(!!initialUser);
  const [currentUser, setCurrentUser] = useState(initialUser ? initialUser : '');

  function authenticate(username, password) {
    console.log('in authenticate');
    axios.post(
      `${config.API_ROOT}/login`,
      {
        username,
        password
      },
      {withCredentials: true}
    ).then((res) => {
      if (res.status === 200) {
        loginSuccessful(username);
      }
    }).catch(err => {
      if (err && err.response && err.response.status === 401) {
        console.log('Incorrect Username or password');
      } else {
        console.log(err);
      }
    });
  }

  function loginSuccessful(username) {
    console.log(`log in success. Setting IsAuthenticated true`);
    setIsAuthenticated(true);
    setCurrentUser(username);
  }

  return (
    <Router>
      <Route exact path="/" render={
        props => <Pomodoro {...props} isAuthenticated={isAuthenticated} currentUser={currentUser}/>
      }/>
      <Route path="/login" render={
        props => <Login {...props} isAuthenticated={isAuthenticated} authenticate={authenticate}/>
      }/>
      <Route path="/stats" render={
        props => <Stats {...props} isAuthenticated={isAuthenticated} />
      }/>
    </Router>
  );
}

export default App;
