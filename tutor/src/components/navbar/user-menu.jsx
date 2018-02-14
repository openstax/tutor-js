import React from 'react';
import { Dropdown, MenuItem } from 'react-bootstrap';
import { observer } from 'mobx-react';
import { observable, action } from 'mobx';

import User from '../../models/user'
import AccountLink from './account-link';
import LogOut from './logout';

@observer
export default class UserMenu extends React.Component {

  @observable isOpen;
  @action.bound onMouseEnter() { this.isOpen = true; }
  @action.bound onMouseLeave() { this.isOpen = false; }
  @action.bound onToggle(isOpen) { this.isOpen = isOpen; }

  render() {
    return (
      <Dropdown
        id="user-menu"
        pullRight
        className="user-menu"
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
        onToggle={this.onToggle}
        open={this.isOpen}
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
