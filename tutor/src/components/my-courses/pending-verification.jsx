import React from 'react';
import { Chat, currentUser } from '../../models';
import IconAdd from '../icons/add';
import { Icon } from 'shared';

// make poller be global so we'll only poll once even if multiple
// components are mounted somehoww
let POLLER = 0;

export default class PendingVerification extends React.Component {


    componentDidMount() {
        Chat.setElementVisiblity(this.onlineChatButton);
        if (!POLLER) {
            currentUser.fetch();
            POLLER = setInterval(currentUser.fetch, 3 * 60 * 1000); // poll every 3 minutes
        }
    }

    componentWillUnmount() {
        if (POLLER) {
            clearInterval(POLLER);
            POLLER = 0;
        }
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
                <Icon type='comments' /><span>Chat with support</span>
            </button>
        );
    }

    render() {
        return (
            <div className="my-courses pending-faculty-verification container" data-test-id="pending-verification">
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
                        <h3>Almost ready!</h3>
                        <p className="lead">
              If you received an email verifying your faculty status, we’re gathering resources for your account. Check back in a few minutes.
                        </p>
                        {this.renderChat()}
                    </div>
                </div>
            </div>
        );
    }
}
