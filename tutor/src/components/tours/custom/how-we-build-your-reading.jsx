import React from 'react';
import {
  ValueProp,
  ColumnContent,
  Column
} from './common';
import SuperTrainingWheel from './super-training-wheel';

import TutorLink from '../../link'

export default class HowWeBuildYourReading extends React.PureComponent {

  render () {
    const { courseId } = this.props.step.ride.region

    return (
      <SuperTrainingWheel {...this.props}>
        <ValueProp className="build-reading">
          <h1 className="heading">
            How we build your reading assignment
          </h1>
          <h2 className="sub-heading">
            You select the chapters and sections, we do the rest.
          </h2>
          <ColumnContent>
            <Column className="machine-learning">
              <p>
                Select what you want your students to read, and OpenStax Tutor Beta picks the questions for you
              </p>
            </Column>
            <Column className="exclude-question">
              <p>
                You can manage questions in the<br/>
                <TutorLink to='viewQuestionsLibrary' params={{courseId}}>
                  Question Library
                </TutorLink> before you publish your assignment
              </p>
            </Column>
          </ColumnContent>
        </ValueProp>
      </SuperTrainingWheel>
    );
  }
}
