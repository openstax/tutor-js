import React from 'react';
import CourseUX from '../../../models/course/ux';

import {
  WelcomeToTutorMessage,
} from './common';
import SuperTrainingWheel from './super-training-wheel';

function WelcomeToTutorContent() {
  return (
    <WelcomeToTutorMessage>
      <h2 className="sub-heading">
        Improve how your students learn with research-based
        technology — for only {CourseUX.formattedStudentCost}.
      </h2>
    </WelcomeToTutorMessage>
  );
}

export { WelcomeToTutorContent };

export default class InstructorWelcomeToTutor extends React.Component {

  render () {
    return (
      <SuperTrainingWheel {...this.props} className='has-forest-background'>
        <WelcomeToTutorContent/>
      </SuperTrainingWheel>
    );
  }
}
