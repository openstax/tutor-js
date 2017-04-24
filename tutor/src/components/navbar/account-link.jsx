import React from 'react';

import User from '../../models/user';
import { observer } from 'mobx-react';

@observer
export default class AccountLink extends React.PureComponent {

  static propTypes = {
    onClick: React.PropTypes.func,
  }

  render() {
    const { profile_url } = User;
    if (!profile_url) { return null; }
    return (
      <li role="presentation">
        <a href={profile_url} target="_blank">
          My Account
        </a>
      </li>
    );
  }
}
