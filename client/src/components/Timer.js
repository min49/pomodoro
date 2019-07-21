import React, {useState, useRef} from 'react';
import {Button, TimeDisplay, TimerLabel, TimerWrapper} from "./styled-elements";

import useInterval from '../customHooks/useInterval';

function Timer(props) {
  const [breakLength, setBreakLength] = useState(_minuteToSeconds(5));
  const [sessionLength, setSessionLength] = useState(_minuteToSeconds(25));
  const [timeLeft, setTimeLeft] = useState(_minuteToSeconds(25));
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const beepRef = useRef();

  const {tasks} = props;

  function _getMinuteSecondString(seconds) {
    const minute = Math.floor(seconds / 60).toString().padStart(2, '0');
    const second = (seconds % 60).toString().padStart(2, '0');
    return `${minute}:${second}`;
  }

  function _toggleIsRunning() {
    setIsRunning(!isRunning);
  }

  function _reset() {
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
    return isBreak ? 'Break' : 'Focus';
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
    <TimerWrapper>
      {
        tasks.length === 0
          ? null
          : <select>
            {tasks.map(t => <option value={t.name}>{t.name}</option>)}
          </select>
      }
      <TimerLabel id="timer-label">{_getTimerLabel()}</TimerLabel>

      <TimeDisplay id="time-left">{_getMinuteSecondString(timeLeft)}</TimeDisplay>
      <Button primary id="start_stop" onClick={_toggleIsRunning}>Start/Stop</Button>
      <Button id="reset" onClick={_reset}>Reset</Button>
      <audio id="beep" ref={beepRef}
             src="https://docs.google.com/uc?export=download&id=177Le-I9Z4arIsILN9xicG7-GkGt09PdM"/>
    </TimerWrapper>
  )
}

export default Timer;


