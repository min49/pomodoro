import React, {useRef, useState} from 'react';
import {ThemeProvider} from 'styled-components';

import useInterval from './customHooks/useInterval';

import BreakSetter from './components/BreakSetter';
import SessionSetter from './components/SessionSetter';
import Timer from './components/Timer';

import {Row} from './components/styled-elements';
import {theme} from './theme';


function App() {
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


export default App;
