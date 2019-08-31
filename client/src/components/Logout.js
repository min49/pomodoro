import React from "react";
import axios from 'axios';
import {withRouter} from 'react-router-dom';

import config from '../config';

function Logout(props) {
  const {loggedOut} = props;

  function logout(e) {
    axios.get(
      `${config.API_ROOT}/logout`,
      {withCredentials: true}
    ).then(() => {
      loggedOut();
      props.history.push('/');
    })
  }

  return <a href="#" onClick={logout}>Log out</a>;
}

export default withRouter(Logout);