import React from 'react';
import { Dropdown } from 'react-bootstrap';
import { observer } from 'mobx-react';

import User from '../../models/user';
import AccountLink from './account-link';
import LogOut from './logout';

export default
@observer
class UserMenu extends React.Component {

  render() {
    return (
      <Dropdown

        pullRight
        className="user-menu"
      >
        <Dropdown.Toggle
          id="user-menu"
          aria-label="Account settings"
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

};
