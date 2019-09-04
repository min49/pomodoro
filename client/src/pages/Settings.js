import React from 'react';
import {Link} from 'react-router-dom';

function Settings(props) {
  const {isAuthenticated, tasks} = props;

  if (!isAuthenticated) {
    return <div>Please login or Register.</div>
  }

  return (
    <section>
      <h2>Tasks</h2>
      <ul>
        {tasks.map(el => <li><Link to={`/settings/task/${el._id}`}>{el.name}</Link></li>)}
      </ul>
    </section>
  );
}

export default Settings;