import React from 'react';
import Chat from '../../models/chat';
import TutorLink from '../link';
import IconAdd from '../icons/add';

import { Icon } from 'shared';

export default class PendingVerification extends React.Component {

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
        <Icon type='comments' /><span>Verify now via chat</span>
      </button>
    );
  }

  render() {
    return (
      <div className="my-courses pending-faculty-verification container">
        <h2>My Courses</h2>
        <div className="courses">
          <div className="locked-card">
            <div className="disabled-create-zone">
              <div className="mock-tutor-link">
                <div>
                  <IconAdd />
                  <span>
                    CREATE A COURSE
                  </span>
                </div>
              </div>
            </div>
            <div className="overlay">
              <i className="pending-verification-icon"></i>
              <h4>Pending faculty verification</h4>
            </div>
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
