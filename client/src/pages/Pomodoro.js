import React, {useState, useEffect, useRef} from 'react';

import useInterval from '../customHooks/useInterval';
import {Button, Row, TimeDisplay, TimerLabel, TimerWrapper} from "../components/styled-elements";

function Pomodoro(props) {
  const {tasks} = props;

  const ONE_SECOND = 1000;
  const p = {
    INITIAL: 'initial',
    FOCUS: 'focus',
    FOCUS_PAUSED: 'focus_paused',
    FOCUS_COMPLETED: 'focus_completed',
    RELAX: 'relax',
    RELAX_PAUSED: 'relax_paused',
    RELAX_COMPLETED: 'relax_completed'
  };
  const DEFAULT_TASK = {
    name: '',
    focusTime: 25,
    relaxTime: 5
  };

  const [currentTask, setCurrentTask] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [phase, setPhase] = useState('');
  const beepRef = useRef();

  // set Current task after complete loading tasks
  useEffect(() => {
    if ((!currentTask.name || currentTask.name === '') && tasks && tasks[0]) {
      const {name, focusTime, relaxTime} = tasks[0];
      setCurrentTask({name, focusTime, relaxTime});
    } else {
      setCurrentTask(DEFAULT_TASK);
    }
  }, [tasks]);

  // set phase and timer on task change
  useEffect(() => {
    setPhase(p.INITIAL);
    setTimeLeft(currentTask.focusTime);
  }, [currentTask]);

  useInterval(tick, getTickInterval());

  // play timer on session complete
  useEffect(() => {
    if (phase === p.RELAX_COMPLETED || phase === p.FOCUS_COMPLETED) {
      const delay = ONE_SECOND * 60;
      playBeep();
      let id = setInterval(playBeep, delay);
      return () => clearInterval(id);
    } else {
      stopBeep();
    }
  }, [phase]);

  // reset timer on session complete or stop
  useEffect(() => {
    if (phase === p.INITIAL || phase === p.RELAX_COMPLETED) {
      setTimeLeft(currentTask.focusTime);
    } else if (phase === p.FOCUS_COMPLETED) {
      setTimeLeft(currentTask.relaxTime);
    }
  }, [phase]);

  function tick() {
    const timeLeftNow = timeLeft - 1;
    if (timeLeftNow === -1) {
      if (phase === p.FOCUS) {
        setPhase(p.FOCUS_COMPLETED);
      } else {
        setPhase(p.RELAX_COMPLETED);
      }
    } else {
      setTimeLeft(timeLeftNow);
    }
  }

  function playBeep() {
    stopBeep();
    beepRef.current.play();
  }

  function stopBeep() {
    beepRef.current.pause();
    beepRef.current.currentTime = 0;
  }

  function getTickInterval() {
    const shouldTick = (phase === p.FOCUS || phase === p.RELAX);
    return shouldTick ? ONE_SECOND : null;
  }

  function handleTaskChange(e) {
    const newTaskName = e.target.value;
    const newTask = tasks.find(t => t.name === newTaskName);

    if (newTask) {
      const {name, focusTime, relaxTime} = newTask;
      setCurrentTask({name, focusTime, relaxTime});
    }
  }

  function handleStartPauseButtonClick() {
    let nextPhase = p.INITIAL;
    switch (phase) {
      case (p.INITIAL):
        nextPhase = p.FOCUS;
        break;
      case (p.FOCUS) :
        nextPhase = p.FOCUS_PAUSED;
        break;
      case (p.FOCUS_PAUSED):
        nextPhase = p.FOCUS;
        break;
      case (p.FOCUS_COMPLETED):
        nextPhase = p.RELAX;
        break;
      case (p.RELAX):
        nextPhase = p.RELAX_PAUSED;
        break;
      case (p.RELAX_PAUSED):
        nextPhase = p.RELAX;
        break;
      case (p.RELAX_COMPLETED):
        nextPhase = p.FOCUS;
        break;
      default:
        nextPhase = p.INITIAL;
    }
    setPhase(nextPhase);
  }

  function handleStopButtonClick() {
    setPhase(p.INITIAL);
  }

  function _getMinuteSecondString(seconds) {
    const minute = Math.floor(seconds / 60).toString().padStart(2, '0');
    const second = (seconds % 60).toString().padStart(2, '0');
    return `${minute}:${second}`;
  }

  function getTimerLabel() {
    switch (phase) {
      case p.INITIAL:
        return `Let's Start!`;
      case p.FOCUS:
      case p.FOCUS_PAUSED:
        return 'Focus';
      case p.FOCUS_COMPLETED:
        return 'Good Job!';
      case p.RELAX:
      case p.RELAX_PAUSED:
        return 'Relax';
      case p.RELAX_COMPLETED:
        return 'Time to Work!';
    }
  }

  function getStartPauseButtonText() {
    switch (phase) {
      case p.FOCUS:
      case p.RELAX:
        return 'Pause';
      default:
        return 'Start';
    }
  }

  return (
    <Row>
      <TimerWrapper>
        {
          tasks.length === 0
            ? null
            : <select style={{display: 'block', margin: 'auto'}} onChange={handleTaskChange}>
              {tasks.map(t => <option key={t.name} value={t.name}>{t.name}</option>)}
            </select>
        }
        <TimerLabel id="timer-label">{getTimerLabel()}</TimerLabel>

        <TimeDisplay id="time-left">{_getMinuteSecondString(timeLeft)}</TimeDisplay>
        <Button primary id="start-pause" onClick={handleStartPauseButtonClick}>{getStartPauseButtonText()}</Button>
        <Button id="stop" onClick={handleStopButtonClick}>Stop</Button>
        <audio id="beep" ref={beepRef}
               src="https://docs.google.com/uc?export=download&id=177Le-I9Z4arIsILN9xicG7-GkGt09PdM"/>
      </TimerWrapper>
    </Row>
  );
}

export default Pomodoro;