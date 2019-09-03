import React, {useState, useEffect} from 'react';
import axios from 'axios';

import config from '../config';

function Settings(props) {
  const {isAuthenticated} = props;
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    if (isAuthenticated) {
      axios.get(`${config.API_ROOT}/tasgks`, {withCredentials: true})
        .then(response => setTasks(response.data));
    } else {
      setTasks([]);
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return <div>Please login or Register.</div>
  }

  return (
    <ul>
      {tasks.map(el => <li>{el.name}</li>)}
    </ul>
  );
}

export default Settings;