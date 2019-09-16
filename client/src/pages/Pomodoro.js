import React, {useEffect, useRef, useState} from 'react';
import axios from 'axios';
import {Button, Card, Container, Dropdown, Icon} from 'semantic-ui-react';

import config from '../config';
import useInterval from '../customHooks/useInterval';
import {secondsToMinuteSecondString, secondsToRoundedMinutes, minutesToSeconds} from "../utils/timeConverter";
import {TimeDisplay, TimerLabel} from "../components/styled-elements";
import Features from "../components/Features";

const
  p = {
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
  },
  startPauseButtonTransition = new Map([
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
  ]),
  DEFAULT_TASK = {
    name: '',
    focusTime: 25,
    relaxTime: 5
  },
  ONE_SECOND = 1000;

function Pomodoro(props) {
  const {isAuthenticated, tasks} = props;

  const [currentTask, setCurrentTask] = useState({});
  // Time interval in tasks is stored in minutes
  // Convert to seconds to use in Pomodoro component
  const [timeInSecondsLeft, setTimeInSecondsLeft] = useState(0);
  const [phase, setPhase] = useState('');
  const [sessionId, setSessionId] = useState(null);
  const beepRef = useRef();

  // initial setting currentTask and reset on log out.
  useEffect(() => {
    if (isAuthenticated && tasks && tasks[0]) {
      if (!currentTask.name || currentTask.name === '') {
        const {name, focusTime, relaxTime} = tasks[0];
        setCurrentTask({name, focusTime, relaxTime});
        setPhase(p.INITIAL);
        setTimeInSecondsLeft(minutesToSeconds(focusTime));
      }
    } else {
      setCurrentTask(DEFAULT_TASK);
      setPhase(p.INITIAL);
      setTimeInSecondsLeft(minutesToSeconds(DEFAULT_TASK.focusTime));
    }
  }, [isAuthenticated, tasks, currentTask.name]);

  // tick
  useInterval(() => {
    const timeInSecondsLeftNow = timeInSecondsLeft - 1;
    if (timeInSecondsLeftNow === -1) {
      if (phase === p.FOCUS || phase === p.FOCUS_RESUMED) {
        setPhase(p.FOCUS_COMPLETED);
        phaseChangeActions(p.FOCUS_COMPLETED);
      } else {
        setPhase(p.RELAX_COMPLETED);
        phaseChangeActions(p.RELAX_COMPLETED);
      }
    } else {
      setTimeInSecondsLeft(timeInSecondsLeftNow);
    }
  }, getTickInterval());

  // play timer on session complete
  useEffect(() => {
    function playBeep() {
      stopBeep();
      beepRef.current.play();
    }

    function stopBeep() {
      beepRef.current.pause();
      beepRef.current.currentTime = 0;
    }

    if (phase === p.RELAX_COMPLETED || phase === p.FOCUS_COMPLETED) {
      const delay = ONE_SECOND * 60;
      playBeep();
      let id = setInterval(playBeep, delay);
      return () => clearInterval(id);
    } else {
      stopBeep();
    }
  }, [phase, beepRef]);

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

  function handleTaskChange(e, {value}) {
    const newTaskName = value;
    const newTask = tasks.find(t => t.name === newTaskName);

    if (newTask) {
      const {name, focusTime, relaxTime} = newTask;
      setCurrentTask({name, focusTime, relaxTime});
      setPhase(p.INITIAL);
      setTimeInSecondsLeft(minutesToSeconds(focusTime));
    }
  }

  function handleStartPauseButtonClick() {
    const nextPhase = startPauseButtonTransition.get(phase);
    setPhase(nextPhase ? nextPhase : p.INITIAL);
    phaseChangeActions(nextPhase);
  }

  function handleStopButtonClick() {
    setPhase(p.STOPPED);
    phaseChangeActions(p.STOPPED);
  }

  function phaseChangeActions(phase) {
    switch (phase) {
      case p.INITIAL:
        setSessionId(null);
        break;
      case p.STOPPED:
        setTimeInSecondsLeft(minutesToSeconds(currentTask.focusTime));
        if (isAuthenticated && sessionId) {
          axios.patch(
            `${config.API_ROOT}/api/pomodoro/sessions/stop`,
            {sessionId, remainingTime: secondsToRoundedMinutes(timeInSecondsLeft)},
            {withCredentials: true}
          ).then(() => {
            setPhase(p.INITIAL);
            setSessionId(null);
          });
        }
        break;
      case p.FOCUS:
        if (isAuthenticated) {
          axios.post(
            `${config.API_ROOT}/api/pomodoro/sessions/start`,
            {
              taskName: currentTask.name,
              duration: currentTask.focusTime
            },
            {withCredentials: true}
          ).then((response) => {
            if (response.status === 201 && response.data) {
              setSessionId(response.data._id);
            }
          });
        }
        break;
      case p.FOCUS_PAUSED:
        break;
      case p.FOCUS_RESUMED:
        break;
      case p.FOCUS_COMPLETED:
        setTimeInSecondsLeft(minutesToSeconds(currentTask.relaxTime));
        if (isAuthenticated && sessionId) {
          axios.patch(
            `${config.API_ROOT}/api/pomodoro/sessions/finish`,
            {sessionId},
            {withCredentials: true}
          ).then(() => {
            setSessionId(null);
          });
        }
        break;
      case p.RELAX:
        break;
      case p.RELAX_PAUSED:
        break;
      case p.RELAX_RESUMED:
        break;
      case p.RELAX_COMPLETED:
        setTimeInSecondsLeft(minutesToSeconds(currentTask.focusTime));
        break;
      default:
        break;
    }
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
      default:
        return null;
    }
  }

  function getStartPauseButtonContent() {
    switch (phase) {
      case p.FOCUS:
      case p.FOCUS_RESUMED:
      case p.RELAX:
      case p.RELAX_RESUMED:
        return <Icon name='pause'/>;
      default:
        return <Icon name='play'/>;
    }
  }

  return (
    <Container>


      <Card centered raised className='pomodoro'>
        <Card.Content textAlign="center">
          <TimerLabel>{getTimerLabel()}</TimerLabel>
        </Card.Content>

        <Card.Content textAlign="center">
          {
            tasks.length === 0
              ? null
              :
              <Dropdown
                defaultValue={tasks[0].name}
                onChange={handleTaskChange}
                options={
                  tasks.map(t => ({
                    key: t.name,
                    text: t.name,
                    value: t.name
                  }))
                }/>
          }
          <TimeDisplay id="time-left">{secondsToMinuteSecondString(timeInSecondsLeft)}</TimeDisplay>
        </Card.Content>

        <Card.Content textAlign="center">
          <Button icon primary id="start-pause" onClick={handleStartPauseButtonClick}>
            {getStartPauseButtonContent()}
          </Button>
          <Button icon id="stop" onClick={handleStopButtonClick}>
            <Icon name='stop'/>
          </Button>
        </Card.Content>
        <audio id="beep" ref={beepRef}
               src="https://docs.google.com/uc?export=download&id=177Le-I9Z4arIsILN9xicG7-GkGt09PdM"/>
      </Card>
      {isAuthenticated ? null : <Features/>}
    </Container>
  );
}

export default Pomodoro;