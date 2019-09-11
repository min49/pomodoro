import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {Container, Header, Table} from 'semantic-ui-react';

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

  function getTableRows(stats) {
    if (!stats) return null;

    let rows = [];
    for (let [date, statsOfDate] of stats) {
      rows.push(
        <Table.Row>
          <Table.Cell>{date}</Table.Cell>
          <Table.Cell>
            {statsOfDate.incompleteSessionCountOnDate + statsOfDate.completedSessionCountOnDate}
          </Table.Cell>
          <Table.Cell>{statsOfDate.completedSessionCountOnDate}</Table.Cell>
          <Table.Cell>{statsOfDate.completedTotalTimeOnDate}</Table.Cell>
        </Table.Row>);
    }
    return rows;
  }

  if (!isAuthenticated) {
    return <div>Please Login or Register</div>;
  } else {
    return (
      <Container>
        <Header as='h2'>Stats</Header>
        <Table celled>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Date</Table.HeaderCell>
              <Table.HeaderCell>Started</Table.HeaderCell>
              <Table.HeaderCell>Completed</Table.HeaderCell>
              <Table.HeaderCell>Completed Time</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          {getTableRows(stats)}
        </Table>
      </Container>

    );
  }
}

export default Stats;