import React, {useState, useEffect} from 'react';
import axios from 'axios';

import config from '../config';

function Stats(props) {
  const {isAuthenticated} = props;
  const [stats, setStats] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      axios.get(`${config.API_ROOT}/sessions`, {withCredentials: true})
        .then(processSessions);
    }
  }, [isAuthenticated]);

  function processSessions(response) {
    const {data} = response;
    console.log(data);

    /*
     * statsByDate =
     *   sessionDate -> thisDateStats = {
     *                    completedSessionCountOnDate,
     *                    incompleteSessionCountOnDate,
     *                    tasksOnDate = taskName -> sessionCounts = {
     *                                                completed,
     *                                                incomplete
     *                                              }
     *                  }
     */
    const statsByDate = new Map();
    for (const s of data) {
      const sessionDate = new Date(s.startDatetime).toLocaleDateString();
      let thisDateStats = statsByDate.get(sessionDate);
      if (!thisDateStats) {
        thisDateStats = {
          completedSessionCountOnDate: 0,
          incompleteSessionCountOnDate: 0,
          tasksOnDate: new Map()
        };
        statsByDate.set(sessionDate, thisDateStats);
      }

      const taskName = s.task.name;
      const {tasksOnDate} = thisDateStats;
      let sessionCounts = tasksOnDate.get(taskName);
      if (!sessionCounts) {
        sessionCounts = {
          completed: 0,
          incomplete: 0
        };
        tasksOnDate.set(taskName, sessionCounts);
      }

      if (s.isCompleted) {
        thisDateStats.completedSessionCountOnDate += 1;
        sessionCounts.completed += 1;
      } else {
        thisDateStats.incompleteSessionCountOnDate += 1;
        sessionCounts.incomplete += 1;
      }
    }
    console.log(statsByDate);
    setStats(statsByDate);
  }

  function getHtmlForStats(stats) {
    if (!stats) return null;

    let output = [];
    for (let [date, statsOfDate] of stats) {
      let sessionsByTask = [];
      for (let [taskName, sessionCount] of statsOfDate.tasksOnDate) {
        sessionsByTask.push(
          <div key={`${date}-${taskName}`}>
            {taskName} : {sessionCount.completed} : {sessionCount.incomplete}
          </div>
        );
      }

      output.push(
        <div key={`${date}`}>
          <h4>{date}</h4>
          {sessionsByTask}
          <div>
            <strong>Total</strong> :
            {statsOfDate.completedSessionCountOnDate} :
            {statsOfDate.incompleteSessionCountOnDate}
          </div>
        </div>
      );
    }
    return output;
  }


  return (
    isAuthenticated
      ? <div>{getHtmlForStats(stats)}</div>
      : <div> Please Login or Register.</div>
  );
}

export default Stats;