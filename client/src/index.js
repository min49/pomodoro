import React from 'react';
import * as ReactDOM from 'react-dom';
import axios from 'axios';

import './index.css';
import 'semantic-ui-less/semantic.less';
import App from './App';
import * as serviceWorker from './serviceWorker';
import config from './config';

let initialUser = undefined;
axios.get(`${config.API_ROOT}/api/pomodoro/users/current`, {withCredentials: true})
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
