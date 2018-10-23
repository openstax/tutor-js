import React from 'react';


import {
  WelcomeToTutorMessage,
} from './common';
import SuperTrainingWheel from './super-training-wheel';


export default class StudentWelcomeToTutor extends React.Component {

  render () {
    return (
      <SuperTrainingWheel {...this.props}>
        <WelcomeToTutorMessage withoutCost>
          <p className="sub-heading">
            We use research-based technology to change the way you learn. Here's what to look out for:
          </p>
        </WelcomeToTutorMessage>
      </SuperTrainingWheel>
    );
  }
}
