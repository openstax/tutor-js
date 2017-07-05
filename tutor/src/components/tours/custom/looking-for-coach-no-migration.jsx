import React from 'react';

import {
  Column,
  TutorCoachSunset,
} from './common';
import CourseBranding from '../../branding/course';
import SuperTrainingWheel from './super-training-wheel';

export default class LookingForCoachNoMigration extends React.PureComponent {

  render () {
    return (
      <SuperTrainingWheel {...this.props} className='has-forest-background'>
        <TutorCoachSunset>
          <Column className="not-launched-yet">
            <p>We haven't launched<br/>
              OpenStax Tutor in your subject yet. We'll let you know as soon as it's available.</p>
          </Column>
        </TutorCoachSunset>
      </SuperTrainingWheel>
    );
  }
}
