import PropTypes from 'prop-types';
import React from 'react';
import { isEmpty } from 'lodash';
import classnames from 'classnames';

class MessageList extends React.Component {
  static defaultProps = {
    alertType: 'danger',
    messagesType: 'errors',
    forceBullets: false,
  };

  static propTypes = {
    messages: PropTypes.array.isRequired,
    alertType: PropTypes.string,
    messagesType: PropTypes.string,
    forceBullets: PropTypes.bool,
    liClassName: PropTypes.string,
  };

  getUlClassName = () => {
    return classnames('message-list', this.props.messagesType,
      { 'list-unstyled': (this.props.messages.length === 1) && !this.props.forceBullets }
    );
  };

  render() {
    if (isEmpty(this.props.messages)) { return null; }

    return (
      <div className={`alert alert-${this.props.alertType}`}>
        <ul className={this.getUlClassName()}>
          {this.props.messages.map((msg, i) =>
            <li className={this.props.liClassName} key={i}>
              {msg}
            </li>)}
        </ul>
      </div>
    );
  }
}


export default MessageList;
