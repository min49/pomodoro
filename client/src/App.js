import React, {useRef, useState} from 'react';
import {ThemeProvider} from 'styled-components';
import axios from 'axios';
import {BrowserRouter as Router, Route, Link, Redirect} from 'react-router-dom';

import useInterval from './customHooks/useInterval';

import BreakSetter from './components/BreakSetter';
import SessionSetter from './components/SessionSetter';
import Timer from './components/Timer';

import {Row} from './components/styled-elements';
import {theme} from './theme';

function App({currentUser}) {
  const [breakLength, setBreakLength] = useState(_minuteToSeconds(5));
  const [sessionLength, setSessionLength] = useState(_minuteToSeconds(25));
  const [timeLeft, setTimeLeft] = useState(_minuteToSeconds(25));
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const beepRef = useRef();

  function incBreakLength() {
    _withinLengthLimit(setBreakLength, breakLength, _minuteToSeconds(1));
  }

  function decBreakLength() {
    _withinLengthLimit(setBreakLength, breakLength, _minuteToSeconds(-1));
  }

  function incSessionLength() {
    if (!isRunning) {
      _withinLengthLimit(setTimeLeft, timeLeft, _minuteToSeconds(1));
    }
    _withinLengthLimit(setSessionLength, sessionLength, _minuteToSeconds(1));
  }

  function decSessionLength() {
    if (!isRunning) {
      _withinLengthLimit(setTimeLeft, timeLeft, _minuteToSeconds(-1));
    }
    _withinLengthLimit(setSessionLength, sessionLength, _minuteToSeconds(-1));
  }

  function toggleIsRunning() {
    setIsRunning(!isRunning);
  }

  function reset() {
    _stopBeep();
    setTimeLeft(_minuteToSeconds(25));
    setBreakLength(_minuteToSeconds(5));
    setSessionLength(_minuteToSeconds(25));
    setIsRunning(false);
    setIsBreak(false);
  }

  useInterval(_tick, isRunning ? 1000 : null);


  function _minuteToSeconds(minute) {
    return minute * 60;
  }

  function _withinLengthLimit(setFunction, value, change) {
    const MAX_LENGTH = 3600;
    const MIN_LENGTH = 60;
    const newValue = value + change;
    if (MIN_LENGTH <= newValue && newValue <= MAX_LENGTH) {
      setFunction(newValue);
    }
  }

  function _tick() {
    const timeLeftNow = timeLeft - 1;
    if (timeLeftNow < 0) {
      _changeSessionTo(!isBreak);
    } else {
      if (timeLeftNow === 0) _playBeepFromStart();
      setTimeLeft(timeLeftNow);
    }
  }

  function _changeSessionTo(nowIsBreak) {
    setIsBreak(nowIsBreak);
    setTimeLeft(nowIsBreak ? breakLength : sessionLength);
  }

  function _getTimerLabel() {
    return isBreak ? 'Break' : 'Work';
  }

  function _playBeepFromStart() {
    _stopBeep();
    beepRef.current.play();
  }

  function _stopBeep() {
    beepRef.current.pause();
    beepRef.current.currentTime = 0;
  }

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
          <Timer timeLeft={timeLeft} reset={reset} startStop={toggleIsRunning} timerLabel={_getTimerLabel()}/>
        </Row>
        <Row>
          <BreakSetter length={breakLength} inc={incBreakLength} dec={decBreakLength}/>
          <SessionSetter length={sessionLength} inc={incSessionLength} dec={decSessionLength}/>
        </Row>
        <audio id="beep" ref={beepRef}
               src="https://docs.google.com/uc?export=download&id=177Le-I9Z4arIsILN9xicG7-GkGt09PdM"/>
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
      'http://localhost:3003/api/pomodoro/login',
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
      <Route exact path="/" render={props => <App {...props} currentUser={currentUser}/>}/>
      <Route path="/login" render={props => <LoginComponent {...props} isAuthenticated={isAuthenticated}
                                                            authenticate={authenticate}/>}/>
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
