import React from 'react';
import { Dropdown, MenuItem } from 'react-bootstrap';
import Icon from '../icon';
import User from '../../models/user'
import AccountLink from './account-link';
import LogOut from './logout';

export default class UserMenu extends React.Component {


  render() {
    return (
      <Dropdown
        id="user-menu"
        pullRight
        className="user-menu"
      >
        <Dropdown.Toggle
          useAnchor={true}
          noCaret
        >
          <span className="initials">{User.initials}</span>
        </Dropdown.Toggle>
        <Dropdown.Menu >
          <AccountLink bsRole="menu-item" />
          <LogOut bsRole="menu" />
        </Dropdown.Menu>
      </Dropdown>
    );
  }

}
