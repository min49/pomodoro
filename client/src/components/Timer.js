import React, {useState, useRef} from 'react';
import {Button, TimeDisplay, TimerLabel, TimerWrapper} from "./styled-elements";

import useInterval from '../customHooks/useInterval';

function Timer(props) {
  const {tasks} = props;

  const [currentTask, setCurrentTask] = useState({
    name: '',
    focusTime: 25,
    relaxTime: 5
  });
  const [timeLeft, setTimeLeft] = useState(25);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const beepRef = useRef();

  useInterval(_tick, isRunning ? 1000 : null);

  if (currentTask.name === '' && tasks[0] !== undefined) {
    setCurrentTask({
      name: tasks[0].name,
      focusTime: tasks[0].focusTime,
      relaxTime: tasks[0].relaxTime
    });
    setTimeLeft(tasks[0].focusTime);
  }

  function _handleTaskChange(e) {
    const newTaskName = e.target.value;
    const newTask = tasks.find(t => t.name === newTaskName);

    if (newTask) {
      setIsRunning(false);

      const {name, focusTime, relaxTime} = newTask;
      console.log(`${name} , ${focusTime} , ${relaxTime}`);
      setCurrentTask({name, focusTime, relaxTime});
      setTimeLeft(focusTime);
    }
  }

  function _getMinuteSecondString(seconds) {
    const minute = Math.floor(seconds / 60).toString().padStart(2, '0');
    const second = (seconds % 60).toString().padStart(2, '0');
    return `${minute}:${second}`;
  }

  function _toggleIsRunning() {
    setIsRunning(!isRunning);
  }

  function _tick() {
    const timeLeftNow = timeLeft - 1;
    if (timeLeftNow < 0) {
      _changeSession();
    } else {
      if (timeLeftNow === 0) _playBeepFromStart();
      setTimeLeft(timeLeftNow);
    }
  }

  function _changeSession() {
    const nowIsBreak = !isBreak;
    setIsBreak(nowIsBreak);
    setTimeLeft(nowIsBreak ? currentTask.relaxTime : currentTask.focusTime);
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
          : <select style={{display: 'block', margin: 'auto'}} onChange={_handleTaskChange}>
            {tasks.map(t => <option key={t.name} value={t.name}>{t.name}</option>)}
          </select>
      }
      <TimerLabel id="timer-label">{_getTimerLabel()}</TimerLabel>

      <TimeDisplay id="time-left">{_getMinuteSecondString(timeLeft)}</TimeDisplay>
      <Button primary id="start_stop" onClick={_toggleIsRunning}>{isRunning ? 'Stop' : 'Start'}</Button>
      <audio id="beep" ref={beepRef}
             src="https://docs.google.com/uc?export=download&id=177Le-I9Z4arIsILN9xicG7-GkGt09PdM"/>
    </TimerWrapper>
  )
}

export default Timer;