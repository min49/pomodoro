import React from "react";
import {Link} from 'react-router-dom';

import {NavbarItem} from "./styled-elements";
import Logout from "./Logout";

function Navbar(props) {
  const {isAuthenticated, currentUser, loggedOut} = props;

  return (
    <div className="navbar">
      {isAuthenticated
        ?
        <div>
          <span>Hello {currentUser}!</span>
          <NavbarItem><Link to="/">Home</Link></NavbarItem>
          <NavbarItem><Link to="/stats">Stats</Link></NavbarItem>
          <NavbarItem><Link to="/setting">Setting</Link></NavbarItem>
          <NavbarItem><Logout loggedOut={loggedOut}/></NavbarItem>
        </div>
        :
        <div>
          <NavbarItem><Link to="/">Home</Link></NavbarItem>
          <NavbarItem><Link to="/register">Register</Link></NavbarItem>
          <NavbarItem><Link to="/login">Log in</Link></NavbarItem>
        </div>
      }
    </div>);
}

export default Navbar;
