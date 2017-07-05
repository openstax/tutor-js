import React from 'react';

import {
  Column,
  TutorCoachSunset,
} from './common';
import CourseBranding from '../../branding/course';
import SuperTrainingWheel from './super-training-wheel';

function LookingForCoachContent() {
  return (
    <TutorCoachSunset>
      <Column className="view-analytics">
        <p>
          Get started with OpenStax Tutor Beta's advanced analytics and assignable
          homework from your My Courses page.
        </p>
      </Column>
    </TutorCoachSunset>
  );
}

export { LookingForCoachContent };

export default class LookingForCoach extends React.PureComponent {
  render () {
    return (
      <SuperTrainingWheel {...this.props} className='has-forest-background'>
        <LookingForCoachContent/>
      </SuperTrainingWheel>
    );
  }
}
