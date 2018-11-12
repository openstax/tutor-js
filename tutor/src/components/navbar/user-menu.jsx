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
        className="user-menu"
      >
        <Dropdown.Toggle
          id="user-menu"
          variant="link"
          aria-label="Account settings"
        >
          <span className="initials">{User.initials}</span>
        </Dropdown.Toggle>
        <Dropdown.Menu alignRight>
          <AccountLink />
          <LogOut />
        </Dropdown.Menu>
      </Dropdown>
    );
  }

};
