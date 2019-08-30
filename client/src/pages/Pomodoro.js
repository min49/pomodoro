import React, {useState, useEffect} from 'react';
import axios from 'axios';

import Timer from '../components/Timer';

import {Row} from '../components/styled-elements';
import config from '../config';

function Pomodoro(props) {
  const {isAuthenticated} = props;
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    if (isAuthenticated) {
      axios.get(`${config.API_ROOT}/tasks`, {withCredentials: true})
        .then(response => setTasks(response.data));
    }
  }, [isAuthenticated]);


  return (
    <Row>
      <Timer tasks={tasks}/>
    </Row>
  );
}

export default Pomodoro;