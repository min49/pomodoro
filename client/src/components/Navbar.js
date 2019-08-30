import React from "react";
import {Link} from 'react-router-dom';

import {NavbarItem} from "./styled-elements";

function Navbar(props) {
  const {isAuthenticated, currentUser} = props;

  return (
    <div className="navbar">
      {isAuthenticated
        ?
        <div>
          <span>Hello {currentUser}!</span>
          <NavbarItem><Link to="/stats">Stats</Link></NavbarItem>
          <NavbarItem><Link to="/setting">Setting</Link></NavbarItem>
          <NavbarItem><Link to="/logout">Log out</Link></NavbarItem>
        </div>
        :
        <div>
          <NavbarItem><Link to="/register">Register</Link></NavbarItem>
          <NavbarItem><Link to="/login">Log in</Link></NavbarItem>
        </div>
      }
    </div>);
}

export default Navbar;
