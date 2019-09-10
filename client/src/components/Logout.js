import React from "react";
import axios from 'axios';
import {withRouter} from 'react-router-dom';
import {Button} from 'semantic-ui-react';

import config from '../config';

function Logout(props) {
  const {loggedOut, className} = props;

  function logout(e) {
    axios.get(
      `${config.API_ROOT}/logout`,
      {withCredentials: true}
    ).then(() => {
      loggedOut();
      props.history.push('/');
    })
  }

  return <Button className={className} onClick={logout}>Log out</Button>;
}

export default withRouter(Logout);