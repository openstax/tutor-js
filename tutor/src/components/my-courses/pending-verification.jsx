import React from 'react';

import Icon from '../icon';

export default function PendingVerification() {
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
            We're manually verifying that you’re an instructor and we'll email you in 3-4 business days when your account is ready.
          </p>
          <p>CHAT GOES HERE</p>
        </div>
      </div>
    </div>
  );
}
