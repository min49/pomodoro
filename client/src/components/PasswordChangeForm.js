import React, {useState} from 'react';
import axios from 'axios';
import {Redirect} from 'react-router-dom';
import {Form, Message} from 'semantic-ui-react';

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
  return (
    <Form onSubmit={submitPasswordChange} error={!!errorMessage}>
      <Form.Field required>
        <label htmlFor='current-password'>Current Password</label>
        <input type='password' id='current-password' onChange={e => setCurrentPassword(e.target.value)}
               value={currentPassword} required/>
      </Form.Field>

      <Form.Field required>
        <label htmlFor='new-password'>New Password</label>
        <input type='password' id='new-password' onChange={e => setNewPassword(e.target.value)}
               value={newPassword} required/>
      </Form.Field>

      <Form.Field required>
        <label htmlFor='confirm-new-password'>Confirm New Password</label>
        <input type='password' id='confirm-new-password' onChange={e => setConfirmNewPassword(e.target.value)}
               value={confirmNewPassword} required/>
      </Form.Field>

      {errorMessage && <Message error>{errorMessage}</Message>}

      <Form.Button type='submit'>Submit</Form.Button>
    </Form>
  );
}

export default PasswordChangeForm;