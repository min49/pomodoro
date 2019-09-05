import React from 'react';
import {Link} from 'react-router-dom';

import PasswordChangeForm from '../components/PasswordChangeForm';

function Settings(props) {
  const {isAuthenticated, tasks} = props;

  if (!isAuthenticated) {
    return <div>Please login or Register.</div>
  }

  return (
    <>
      <section>
        <h2>Tasks</h2>
        <ul>
          {tasks.map(el => <li key={el._id}><Link to={`/settings/task/${el._id}`}>{el.name}</Link></li>)}
        </ul>
        <Link to='/settings/task/new'>Add Task</Link>
      </section>
      <section>
        <PasswordChangeForm isAuthenticated={isAuthenticated}/>
      </section>
    </>
  );
}

export default Settings;