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

    /*
     * statsByDate =
     *   sessionDate -> thisDateStats = {
     *                    completedSessionCountOnDate,
     *                    incompleteSessionCountOnDate,
     *                    completedTotalTimeOnDate,
     *                    tasksOnDate = taskName -> taskStats = {
     *                                                completed,
     *                                                incomplete,
     *                                                completedTime
     *                                              }
     *                  }
     */
    const statsByDate = new Map();
    for (let i = data.length - 1; i >= 0; i--) {
      const s = data[i];
      const sessionDate = new Date(s.startDatetime).toLocaleDateString();
      let thisDateStats = statsByDate.get(sessionDate);
      if (!thisDateStats) {
        thisDateStats = {
          completedSessionCountOnDate: 0,
          incompleteSessionCountOnDate: 0,
          completedTotalTimeOnDate: 0,
          tasksOnDate: new Map()
        };
        statsByDate.set(sessionDate, thisDateStats);
      }

      const taskName = s.task.name;
      const {tasksOnDate} = thisDateStats;
      let taskStats = tasksOnDate.get(taskName);
      if (!taskStats) {
        taskStats = {
          completed: 0,
          incomplete: 0,
          completedTime: 0
        };
        tasksOnDate.set(taskName, taskStats);
      }

      if (s.isCompleted) {
        thisDateStats.completedSessionCountOnDate += 1;
        thisDateStats.completedTotalTimeOnDate += s.duration;
        taskStats.completed += 1;
        taskStats.completedTime += s.duration;
      } else {
        thisDateStats.incompleteSessionCountOnDate += 1;
        taskStats.incomplete += 1;
      }
    }
    setStats(statsByDate);
  }

  function getHtmlForStats(stats) {
    if (!stats) return null;

    let output = [];
    for (let [date, statsOfDate] of stats) {
      let sessionsByTask = [];
      for (let [taskName, taskStats] of statsOfDate.tasksOnDate) {
        sessionsByTask.push(
          <div key={`${date}-${taskName}`}>
            {taskName} : {taskStats.incomplete} : {taskStats.completed} : {taskStats.completedTime}
          </div>
        );
      }

      output.push(
        <div key={`${date}`}>
          <h4>{date}</h4>
          {sessionsByTask}
          <div>
            <strong>Total</strong> :
            {statsOfDate.incompleteSessionCountOnDate} :
            {statsOfDate.completedSessionCountOnDate} :
            {statsOfDate.completedTotalTimeOnDate}
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