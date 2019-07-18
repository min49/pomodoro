import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import axios from 'axios';

let initialUser = undefined;
axios.get('http://localhost:3003/api/pomodoro/users/current', {withCredentials: true})
  .then((res) => {
    if (res.data.isLoggedIn === true) {
      console.log(`index.js setting initialUser to ${res.data.username}`);
      initialUser = res.data.username;
    }
    ReactDOM.render(<App initialUser={initialUser}/>, document.getElementById('root'));
  })
  .catch(err => {
    console.log(err);
  });

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
