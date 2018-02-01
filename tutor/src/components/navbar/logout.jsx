import React from 'react';
import { observer } from 'mobx-react';
import { MenuItem } from 'react-bootstrap';

import User from '../../models/user';

const LOGOUT_URL = '/accounts/logout';
const LOGOUT_URL_CC = '/accounts/logout?cc=true';

@observer
export default class LogoutLink extends React.PureComponent {

  static propTypes = {
    label: React.PropTypes.string,
    isConceptCoach: React.PropTypes.bool,
  }

  static defaultProps = {
    label: 'Log out',
  }

  onLinkClick(ev) {
    ev.currentTarget.querySelector('form').submit();
  }

  render() {
    return (
      <MenuItem className="logout" {...this.props} onClick={this.onLinkClick}>
        <form
          acceptCharset="UTF-8"
          action={this.props.isConceptCoach ? LOGOUT_URL_CC : LOGOUT_URL}
          className="-logout-form"
          method="post"
        >
          <input type="hidden" name="_method" value="delete" />
          <input type="hidden" name="authenticity_token" value={User.csrf_token} />
          <input type="submit" aria-label={this.props.label} value={this.props.label} />
        </form>
      </MenuItem>
    );
  }
}
