import React from 'react';
import {Button, TimeDisplay, TimerLabel, TimerWrapper} from "./styled-elements";

function Timer(props) {
  const {timerLabel, reset, timeLeft, startStop} = props;

  function getMinuteSecondString(seconds) {
    const minute = Math.floor(seconds / 60).toString().padStart(2, '0');
    const second = (seconds % 60).toString().padStart(2, '0');
    return `${minute}:${second}`;
  }

  return (
    <TimerWrapper>
      <TimerLabel id="timer-label">{timerLabel}</TimerLabel>
      <TimeDisplay id="time-left">{getMinuteSecondString(timeLeft)}</TimeDisplay>
      <Button primary id="start_stop" onClick={startStop}>Start/Stop</Button>
      <Button id="reset" onClick={reset}>Reset</Button>
    </TimerWrapper>
  );
}

export default Timer;