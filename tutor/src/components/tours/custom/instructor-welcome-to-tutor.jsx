import React from 'react';
import CourseUX from '../../../models/course/ux';

import {
  WelcomeToTutorMessage,
} from './common';


function InstructorWelcomeToTutor(props) {
  return (
    <WelcomeToTutorMessage {...props} className="has-forest-background">
      <h2 className="sub-heading">
        Improve how your students learn with research-based
        technology — for only {CourseUX.formattedStudentCost}.
      </h2>
    </WelcomeToTutorMessage>
  );
}

export default InstructorWelcomeToTutor;
