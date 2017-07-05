import React from 'react';

import {
  WelcomeToTutorMessage,
} from './common';
import SuperTrainingWheel from './super-training-wheel';

function WelcomeToTutorWithCoachContent() {
  return (
    <WelcomeToTutorMessage>
      <h2 className="sub-heading">
        Concept Coach is ending, but a better tool is here.
        Here's what your students have to look forward to!
      </h2>
    </WelcomeToTutorMessage>
  );
}

export { WelcomeToTutorWithCoachContent };

export default class WelcomeToTutorWithCoach extends React.PureComponent {

  render () {
    return (
      <SuperTrainingWheel {...this.props} className='has-forest-background'>
        <WelcomeToTutorWithCoachContent/>
      </SuperTrainingWheel>
    );
  }
}
