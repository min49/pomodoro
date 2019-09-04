import React from 'react';

function Task(props) {
  const {isAuthenticated, tasks, match} = props;
  const {taskId} = match.params;
  const task = tasks.find(e => e._id.toString() === taskId);

  console.log('tasks');
  console.log(tasks);

  return (
    <div>
      <ul>
        <li>{task.name}</li>
        <li>{task.focusTime}</li>
        <li>{task.relaxTime}</li>
      </ul>
    </div>
  );
}

export default Task;