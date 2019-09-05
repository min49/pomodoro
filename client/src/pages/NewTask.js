import React, {useState} from 'react';
import axios from 'axios';
import {Redirect} from 'react-router-dom';

import config from '../config';
import TaskForm from "../components/TaskForm";

function NewTask(props) {
  const {isAuthenticated, refreshTasks} = props;

  const [saved, setSaved] = useState(false);
  const [cancelled, setCancelled] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  function submitAction(data) {
    axios.post(
      `${config.API_ROOT}/tasks/new`,
      data,
      {withCredentials: true}
    ).then(res => {
      if (res.status === 201) {
        refreshTasks();
        setSaved(true);
      }
    }).catch(err => {
      if (err && err.response && err.response.data.errorMessage) {
        setErrorMessage(err.response.data.errorMessage);
      } else {
        setErrorMessage('An error occurred. Please try again later.');
      }
    });
  }

  function cancelAction() {
    setCancelled(true);
  }

  if (!isAuthenticated) {
    return <Redirect to='/'/>;
  } else if (cancelled || saved) {
    return <Redirect to='/settings'/>;
  } else {
    return <TaskForm errorMessage={errorMessage} submitAction={submitAction} cancelAction={cancelAction}/>
  }
}

export default NewTask;