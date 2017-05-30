import React from 'react';
import Chat from '../../models/chat';

import Icon from '../icon';

export default class PendingVerification extends React.PureComponent {

  componentDidMount() {
    Chat.setElementVisiblity(this.onlineChatImg, this.offlineChatImg);
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

            <img
              id='liveagent_button_online_573U0000000k9cB'
              ref={img => this.onlineChatImg = img}
              style={{ display: 'none', border: '0', cursor: 'pointer' }}
              onClick={Chat.start}
              src="https://openstax.secure.force.com/support/resource/1491006720000/chat_online_button"
            />

            <img
              id='liveagent_button_offline_573U0000000k9cB'
              ref={img => this.offlineChatImg = img}
              style={{ display: 'none', border: '0' }}
              src="https://openstax.secure.force.com/support/resource/1481851646000/chat_offline_button"
            />

          </div>
        </div>
      </div>
    );
  }
}
