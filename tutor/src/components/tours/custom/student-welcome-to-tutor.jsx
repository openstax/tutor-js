import React from 'react';
import { WelcomeToTutorMessage } from './common';

const StudentWelcomeToTutor = () => {
  return (
    <WelcomeToTutorMessage withoutCost>
      <p className="sub-heading">
        We use research-based technology to change the way you learn. Here's what to look out for:
      </p>
    </WelcomeToTutorMessage>
  );
};

export default StudentWelcomeToTutor;
