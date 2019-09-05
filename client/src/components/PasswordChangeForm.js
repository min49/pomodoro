import React, {useState} from 'react';
import axios from 'axios';
import {Redirect} from 'react-router-dom';

import config from '../config';

function PasswordChangeForm(props) {
  const {isAuthenticated} = props;
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  function submitPasswordChange(e) {
    e.preventDefault();
    if (!passwordIsInvalid()) {
      setErrorMessage('New Password and Confirm New Password do not match.');
      return;
    }

    axios.patch(
      `${config.API_ROOT}/users/changepassword`,
      {currentPassword, newPassword},
      {withCredentials: true}
    ).then(res => {
      if (res.status === 200) {
        if (res.data.status === 'success') {
          alert('Password successfully changed.');
          setCurrentPassword('');
          setNewPassword('');
          setConfirmNewPassword('');
        } else {
          setErrorMessage(res.data.message);
        }
      }
    }).catch(() => {
      setErrorMessage('An error occurred. Please try again later.');
    });
  }

  function passwordIsInvalid() {
    return (newPassword && newPassword === confirmNewPassword);
  }

  if (!isAuthenticated) {
    return <Redirect to='/'/>
  }
  return <>
    <h2>Change Password</h2>
    <form onSubmit={submitPasswordChange}>
      <div>
        <label htmlFor='current-password'>Current Password</label>
        <input type='password' id='current-password' onChange={e => setCurrentPassword(e.target.value)}
               value={currentPassword} required/>
      </div>

      <div>
        <label htmlFor='new-password'>New Password</label>
        <input type='password' id='new-password' onChange={e => setNewPassword(e.target.value)}
               value={newPassword} required/>
      </div>

      <div>
        <label htmlFor='confirm-new-password'>Confirm New Password</label>
        <input type='password' id='confirm-new-password' onChange={e => setConfirmNewPassword(e.target.value)}
               value={confirmNewPassword} required/>
      </div>

      {errorMessage && <div>{errorMessage}</div>}

      <button type='submit'>Submit</button>
    </form>
  </>;
}

export default PasswordChangeForm;