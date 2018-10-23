import PropTypes from 'prop-types';
import React from 'react';
import { Nav, NavDropdown, MenuItem } from 'react-bootstrap';
import { get } from 'lodash';
import { observer } from 'mobx-react';
import { computed, observable, action } from 'mobx';
import classnames from 'classnames';

export default
@observer
class UserActionsMenu extends React.Component {

  static propTypes = {
    user: PropTypes.object.isRequired,
  };

  crsfToken = get(document.querySelector('meta[name=csrf-token]'), 'content')

  onLogoutClick = () => {
    this.refs.logoutForm.submit();
  }

  render() {
    const { user } = this.props;

    return (
      <Nav pullRight={true} navbar={true}>
        <NavDropdown eventKey={1} id="navbar-dropdown" title={user.username} ref="navDropDown">
          <MenuItem className="logout">
            <form
              ref="logoutForm"
              acceptCharset="UTF-8"
              action="/accounts/logout"
              className="-logout-form"
              method="post">
              <input type="hidden" name="_method" value="delete" />
              <input type="hidden" name="authenticity_token" value={this.crsfToken} />
              <input
                type="submit"
                aria-label="Log Out"
                value="Log Out"
                onClick={this.onLogoutClick} />
            </form>
          </MenuItem>
        </NavDropdown>
      </Nav>
    );
  }
};
