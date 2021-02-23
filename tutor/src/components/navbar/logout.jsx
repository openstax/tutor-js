import PropTypes from 'prop-types';
import React from 'react';
import { observer } from 'mobx-react';
import { Dropdown } from 'react-bootstrap';

import User from '../../models/user';

const LOGOUT_URL = '/accounts/logout';
const LOGOUT_URL_CC = '/accounts/logout?cc=true';

@observer
export default
class LogoutLink extends React.Component {

  static propTypes = {
    label: PropTypes.string,
    isConceptCoach: PropTypes.bool,
  }

  static defaultProps = {
    label: 'Log out',
  }

  onLinkClick(ev) {
    ev.currentTarget.querySelector('form').submit();
  }

  render() {
    return (
      <Dropdown.Item aria-label="Log out" className="logout" {...this.props} onClick={this.onLinkClick}>
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
      </Dropdown.Item>
    );
  }
}
