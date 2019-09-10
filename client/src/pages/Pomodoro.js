import React, {useEffect, useRef, useState} from 'react';
import axios from 'axios';

import config from '../config';
import useInterval from '../customHooks/useInterval';
import {secondsToMinuteSecondString} from "../utils/timeConverter";
import {Button, Row, TimeDisplay, TimerLabel, TimerWrapper} from "../components/styled-elements";

function Pomodoro(props) {
  const {tasks} = props;

  const ONE_SECOND = 1000;
  const p = {
    INITIAL: 'initial',
    FOCUS: 'focus',
    FOCUS_PAUSED: 'focus_paused',
    FOCUS_RESUMED: 'focus_resumed',
    FOCUS_COMPLETED: 'focus_completed',
    RELAX: 'relax',
    RELAX_PAUSED: 'relax_paused',
    RELAX_RESUMED: 'relax_resumed',
    RELAX_COMPLETED: 'relax_completed',
    STOPPED: 'stopped'
  };

  const startPauseButtonTransition = new Map([
    [p.INITIAL, p.FOCUS],
    [p.STOPPED, p.FOCUS],
    [p.FOCUS, p.FOCUS_PAUSED],
    [p.FOCUS_RESUMED, p.FOCUS_PAUSED],
    [p.FOCUS_PAUSED, p.FOCUS_RESUMED],
    [p.FOCUS_COMPLETED, p.RELAX],
    [p.RELAX, p.RELAX_PAUSED],
    [p.RELAX_RESUMED, p.RELAX_PAUSED],
    [p.RELAX_PAUSED, p.RELAX_RESUMED],
    [p.RELAX_COMPLETED, p.FOCUS]
  ]);

  const DEFAULT_TASK = {
    name: '',
    focusTime: 25,
    relaxTime: 5
  };

  const [currentTask, setCurrentTask] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [phase, setPhase] = useState('');
  const [sessionId, setSessionId] = useState('');
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

  // tick
  useInterval(() => {
    const timeLeftNow = timeLeft - 1;
    if (timeLeftNow === -1) {
      if (phase === p.FOCUS || phase === p.FOCUS_RESUMED) {
        setPhase(p.FOCUS_COMPLETED);
      } else {
        setPhase(p.RELAX_COMPLETED);
      }
    } else {
      setTimeLeft(timeLeftNow);
    }
  }, getTickInterval());

  // make api call to create/complete session on session start/stop
  useEffect(() => {
    if (phase === p.FOCUS) {
      axios.post(
        `${config.API_ROOT}/sessions/start`,
        {
          taskName: currentTask.name,
          duration: currentTask.focusTime
        },
        {withCredentials: true}
      ).then((response) => {
        if (response.status === 201 && response.data) {
          setSessionId(response.data._id);
        }
      })
    } else if (phase === p.FOCUS_COMPLETED) {
      if (sessionId) {
        axios.patch(
          `${config.API_ROOT}/sessions/finish`,
          {sessionId},
          {withCredentials: true}
        )
      }
    } else if (phase === p.STOPPED) {
      if (sessionId) {
        axios.patch(
          `${config.API_ROOT}/sessions/stop`,
          {sessionId, remainingTime: timeLeft},
          {withCredentials: true}
        ).then(() => {
          setPhase(p.INITIAL);
        });
      }
    }
  }, [phase]);

  // reset timer on session complete or stop
  useEffect(() => {
    if (phase === p.STOPPED || phase === p.RELAX_COMPLETED) {
      setTimeLeft(currentTask.focusTime);
    } else if (phase === p.FOCUS_COMPLETED) {
      setTimeLeft(currentTask.relaxTime);
    }
  }, [phase]);

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

  function playBeep() {
    stopBeep();
    beepRef.current.play();
  }

  function stopBeep() {
    beepRef.current.pause();
    beepRef.current.currentTime = 0;
  }

  function getTickInterval() {
    switch (phase) {
      case p.FOCUS:
      case p.FOCUS_RESUMED:
      case p.RELAX:
      case p.RELAX_RESUMED:
        return ONE_SECOND;
      default:
        return null;
    }
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
    const nextPhase = startPauseButtonTransition.get(phase);
    setPhase(nextPhase ? nextPhase : p.INITIAL);
  }

  function handleStopButtonClick() {
    setPhase(p.STOPPED);
  }

  function getTimerLabel() {
    switch (phase) {
      case p.INITIAL:
      case p.STOPPED:
        return `Let's Start!`;
      case p.FOCUS:
      case p.FOCUS_PAUSED:
      case p.FOCUS_RESUMED:
        return 'Focus';
      case p.FOCUS_COMPLETED:
        return 'Good Job!';
      case p.RELAX:
      case p.RELAX_PAUSED:
      case p.RELAX_RESUMED:
        return 'Relax';
      case p.RELAX_COMPLETED:
        return 'Time to Work!';
    }
  }

  function getStartPauseButtonText() {
    switch (phase) {
      case p.FOCUS:
      case p.FOCUS_RESUMED:
      case p.RELAX:
      case p.RELAX_RESUMED:
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

        <TimeDisplay id="time-left">{secondsToMinuteSecondString(timeLeft)}</TimeDisplay>
        <Button primary id="start-pause" onClick={handleStartPauseButtonClick}>{getStartPauseButtonText()}</Button>
        <Button id="stop" onClick={handleStopButtonClick}>Stop</Button>
        <audio id="beep" ref={beepRef}
               src="https://docs.google.com/uc?export=download&id=177Le-I9Z4arIsILN9xicG7-GkGt09PdM"/>
      </TimerWrapper>
    </Row>
  );
}

export default Pomodoro;