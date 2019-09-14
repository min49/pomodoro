import React, {useState} from 'react';
import axios from 'axios';
import {Redirect} from 'react-router-dom';
import {Button, Confirm, Divider} from 'semantic-ui-react';

import config from '../config';
import TaskForm from '../components/TaskForm';
import FormContainer from "../components/FormContainer";

function EditTask(props) {
  const {isAuthenticated, tasks, refreshTasks, match} = props;
  const {taskId} = match.params;
  const task = tasks.find(e => e._id.toString() === taskId);

  const name = (task ? task.name : '');
  const focusTime = (task ? task.focusTime : '');
  const relaxTime = (task ? task.relaxTime : '');
  const [done, setDone] = useState(false);
  const [cancelled, setCancelled] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [shouldShowConfirm, setShouldShowConfirm] = useState(false);

  function submitAction(data) {
    axios.patch(
      `${config.API_ROOT}/api/pomodoro/tasks/edit`,
      {taskId, ...data},
      {withCredentials: true}
    ).then(res => {
      if (res.status === 200) {
        refreshTasks();
        setDone(true);
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

  function deleteAction() {
    axios.delete(
      `${config.API_ROOT}/api/pomodoro/tasks/delete`,
      {
        data: {taskId},
        withCredentials: true
      }
    ).then(res => {
      if (res.status === 200) {
        refreshTasks();
        setDone(true);
      }
    }).catch(err => {
      if (err && err.response && err.response.data.errorMessage) {
        setErrorMessage(err.response.data.errorMessage);
      } else {
        setErrorMessage('An error occurred. Please try again later.');
      }
    });
  }

  if (!isAuthenticated) {
    return <Redirect to='/'/>;
  } else if (cancelled || done) {
    return <Redirect to='/settings'/>;
  } else if (!task) {
    return <div>Loading...</div>;
  } else {
    return (
      <FormContainer title='Edit Task'>
        <TaskForm name={name} focusTime={focusTime} relaxTime={relaxTime} errorMessage={errorMessage}
                  submitAction={submitAction} cancelAction={cancelAction}/>
        <Divider/>
        <Button basic compact negative onClick={() => setShouldShowConfirm(true)}>
          Delete Task
        </Button>
        <Confirm
          open={shouldShowConfirm}
          content={`Are you sure you want to delete task: ${name}?`}
          onCancel={() => setShouldShowConfirm(false)}
          onConfirm={deleteAction}
        />
      </FormContainer>
    );
  }
}

export default EditTask;