import React from 'react';
import Chat from '../../models/chat';

import Icon from '../icon';

export default class PendingVerification extends React.PureComponent {

  componentDidMount() {
    Chat.setElementVisiblity(this.onlineChatButton);
  }

  renderChat() {
    if (!Chat.isEnabled) { return null; }

    return (
      <button
        className="chat btn"
        ref={btn => this.onlineChatButton = btn}
        style={{ display: 'none' }}
        onClick={Chat.start}
      >
        <Icon type='comment' /><span>VERIFY NOW VIA CHAT</span>
      </button>
    );
  }

  render() {
    return (
      <div className="my-courses pending-faculty-verification container">
        <h2>My Courses</h2>
        <div className="courses">
          <div className="locked-card">
            <Icon type="ban" />
            <h4>Pending faculty verification</h4>
          </div>
          <div className="explain">
            <h3>Almost done!</h3>
            <p className="lead">
              We’re manually verifying that you’re an instructor and we’ll email you in 3-4 business days when your account is ready.
            </p>
            {this.renderChat()}
          </div>
        </div>
      </div>
    );
  }
}
