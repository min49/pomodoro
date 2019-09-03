import React from 'react';

function Settings(props) {
  const {isAuthenticated, tasks} = props;

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