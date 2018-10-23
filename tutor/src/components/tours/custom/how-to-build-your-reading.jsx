import React from 'react';
import {
  ValueProp,
  ColumnContent,
  Column,
} from './common';
import CourseBranding from '../../branding/course';
import SuperTrainingWheel from './super-training-wheel';

import TutorLink from '../../link';

export default class HowToBuildYourReading extends React.Component {

  render () {
    const { courseId } = this.props.step.region;

    return (
      <SuperTrainingWheel {...this.props}>
        <ValueProp className="build-reading">
          <h1 className="heading">
            How to build a reading assignment
          </h1>
          <h2 className="sub-heading">
            You select the chapters and sections, we do the rest.
          </h2>
          <ColumnContent>
            <Column className="machine-learning">
              <p>
                Select what you want your students to read, and <CourseBranding/> picks the questions for you
              </p>
            </Column>
            <Column className="exclude-question">
              <p>
                You can manage questions in the<br/>
                <TutorLink to='viewQuestionsLibrary' params={{ courseId }}>
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
