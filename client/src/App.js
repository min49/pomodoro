import React, {useState, useEffect} from 'react';
import {ThemeProvider} from 'styled-components';
import axios from 'axios';
import {BrowserRouter as Router, Route, Link, Redirect} from 'react-router-dom';

import Timer from './components/Timer';

import {Row} from './components/styled-elements';
import {theme} from './theme';
import config from './config';

function App(props) {
  const {isAuthenticated, currentUser} = props;
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    if (isAuthenticated) {
      axios.get(`${config.API_ROOT}/tasks`, {withCredentials: true})
        .then(response => setTasks(response.data));
    }
  }, [isAuthenticated]);


  return (
    <ThemeProvider theme={theme}>
      <div>
        <Row>
          {console.log(`currentUser in App: ${currentUser}`)}
          {currentUser
            ? <div>Hello {currentUser}!</div>
            : <Link to="/login">Log in</Link>
          }
        </Row>
        <Row>
          <Timer tasks={tasks}/>
        </Row>
      </div>
    </ThemeProvider>
  );
}

function AppWrapper({initialUser}) {
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
        props => <App {...props} isAuthenticated={isAuthenticated} currentUser={currentUser}/>
      }/>
      <Route path="/login" render={
        props => <LoginComponent {...props} isAuthenticated={isAuthenticated} authenticate={authenticate}/>
      }/>
    </Router>
  );
}

function LoginComponent({isAuthenticated, authenticate}) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const login = (e) => {
    authenticate(username, password); //, loginSuccessful);
    e.preventDefault();
  };

  return (
    <div>
      {
        isAuthenticated
          ? <Redirect to='/'/>
          : (<form>
            <label htmlFor="username">Username</label>
            <input type="text" id="username" onChange={e => setUsername(e.target.value)} value={username}/>

            <label htmlFor="password">Password</label>
            <input type="password" id="password" onChange={e => setPassword(e.target.value)} value={password}/>
            <button onClick={login}>Log in</button>
          </form>)
      }
    </div>
  )
}

export default AppWrapper;
