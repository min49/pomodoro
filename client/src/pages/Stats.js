import React, {useState, useEffect} from 'react';
import axios from 'axios';

import config from '../config';

function Stats(props) {
  const {isAuthenticated} = props;
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    if (isAuthenticated) {
      axios.get(`${config.API_ROOT}/sessions`, {withCredentials: true})
        .then(response => setSessions(response.data));
    }
  }, [isAuthenticated]);

  return (
    isAuthenticated
      ? <div>
        {sessions.map(s =>
          <pre>{
            JSON.stringify(s, null, "  ")
          }</pre>)}

      </div>
      : <div> Please Login or Register.</div>
  );
}

export default Stats;