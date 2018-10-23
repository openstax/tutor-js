import PropTypes from 'prop-types';
import React from 'react';
import { MenuItem } from 'react-bootstrap';
import User from '../../models/user';
import { observer } from 'mobx-react';

export default
@observer
class AccountLink extends React.Component {

  static propTypes = {
    onClick: PropTypes.func,
  }

  render() {
    const { profile_url } = User;
    if (!profile_url) { return null; }
    return (
      <MenuItem {...this.props} href={profile_url} target="_blank">
        My Account
      </MenuItem>
    );
  }
};
