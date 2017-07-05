import React from 'react';
import CourseUX from '../../../models/course/ux';

import {
  ValueProp,
  TutorValueColumns,
} from './common';
import CourseBranding from '../../branding/course';
import SuperTrainingWheel from './super-training-wheel';

export default class WelcomeToTutor extends React.PureComponent {

  render () {
    return (
      <SuperTrainingWheel {...this.props} className='has-forest-background'>
        <ValueProp className="welcome-to-tutor">
          <h1 className="heading">Welcome to <CourseBranding />!</h1>
          <h2 className="sub-heading">
            Improve how your students learn with research-based
            technology — for only {CourseUX.formattedStudentCost}.
          </h2>
          <TutorValueColumns />
        </ValueProp>
      </SuperTrainingWheel>
    );
  }
}
