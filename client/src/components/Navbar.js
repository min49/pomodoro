import React, {useState} from "react";
import {Link} from 'react-router-dom';
import {Menu} from 'semantic-ui-react';

import Logout from "./Logout";

function Navbar(props) {
  const {isAuthenticated, currentUser, loggedOut} = props;
  const [activeItem, setActiveItem] = useState('');

  function handleItemClick(e, {name}) {
    setActiveItem(name);
  }

  function menuItemLink(name, to) {
    return <Menu.Item
      name={name}
      active={activeItem === name}
      as={Link}
      to={to}
      onClick={handleItemClick}
    />
  }

  if (isAuthenticated) {
    return (
      <Menu>
        <Menu.Menu position='right'>
          <Menu.Item header>Hello {currentUser}!</Menu.Item>
          {menuItemLink('home', '/')}
          {menuItemLink('stats', '/stats')}
          {menuItemLink('settings', '/settings')}
          <Menu.Item
            name='logOut'
            active={activeItem === 'logOut'}
            loggedOut={loggedOut}
            as={Logout}
          />
        </Menu.Menu>
      </Menu>
    );
  } else {
    return (
      <Menu>
        <Menu.Menu position='right'>
          {menuItemLink('home', '/')}
          {menuItemLink('register', '/register')}
          {menuItemLink('logIn', '/login')}
        </Menu.Menu>
      </Menu>
    );
  }
}

export default Navbar;
