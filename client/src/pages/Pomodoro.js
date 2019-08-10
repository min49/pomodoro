import React, {useState, useEffect} from 'react';
import {ThemeProvider} from 'styled-components';
import axios from 'axios';
import {Link} from 'react-router-dom';

import Timer from '../components/Timer';

import {Row} from '../components/styled-elements';
import {theme} from '../theme';
import config from '../config';

function Pomodoro(props) {
  const {isAuthenticated, currentUser} = props;
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    if (isAuthenticated) {
      axios.get(`${config.API_ROOT}/tasks`, {withCredentials: true})
        .then(response => setTasks(response.data));
    }
  }, [isAuthenticated]);


  return (
    <ThemeProvider theme={theme}>
      <div>
        <Row>
          {console.log(`currentUser in App: ${currentUser}`)}
          {currentUser
            ? <div>Hello {currentUser}!</div>
            : <Link to="/login">Log in</Link>
          }
        </Row>
        <Row>
          <Timer tasks={tasks}/>
        </Row>
        <Row>
          <Link to="/stats">Stats</Link>
        </Row>
      </div>
    </ThemeProvider>
  );
}

export default Pomodoro;