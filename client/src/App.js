import React, {useState} from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import {ThemeProvider} from 'styled-components';

import {theme} from './theme';
import Navbar from "./components/Navbar";
import Pomodoro from "./pages/Pomodoro";
import Login from "./pages/Login";
import Stats from "./pages/Stats";

function App({initialUser}) {
  const [isAuthenticated, setIsAuthenticated] = useState(!!initialUser);
  const [currentUser, setCurrentUser] = useState(initialUser ? initialUser : '');

  function loginSuccessful(username) {
    console.log(`log in success. Setting IsAuthenticated true`);
    setIsAuthenticated(true);
    setCurrentUser(username);
  }

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Navbar isAuthenticated={isAuthenticated} currentUser={currentUser}/>
        <Route exact path="/" render={
          props => <Pomodoro {...props} isAuthenticated={isAuthenticated}/>
        }/>
        <Route path="/login" render={
          props => <Login {...props} isAuthenticated={isAuthenticated} loginSuccessful={loginSuccessful}/>
        }/>
        <Route path="/stats" render={
          props => <Stats {...props} isAuthenticated={isAuthenticated}/>
        }/>
      </Router>
    </ThemeProvider>
  );
}

export default App;
