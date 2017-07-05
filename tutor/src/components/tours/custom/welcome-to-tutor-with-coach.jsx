import React from 'react';

import {
  ValueProp,
  TutorValueColumns,
} from './common';
import CourseBranding from '../../branding/course';
import SuperTrainingWheel from './super-training-wheel';

export default class WelcomeToTutorWithCoach extends React.PureComponent {

  render () {
    return (
      <SuperTrainingWheel {...this.props} className='has-forest-background'>
        <ValueProp className="cc-to-tutor">
          <h1 className="heading">Welcome to <CourseBranding />!</h1>
          <h2 className="sub-heading">
            Concept Coach is ending, but a better tool is here.
            Here's what your students have to look forward to!
          </h2>
          <TutorValueColumns />
        </ValueProp>
      </SuperTrainingWheel>
    );
  }
}
