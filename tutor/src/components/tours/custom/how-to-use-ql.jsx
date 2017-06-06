import React from 'react';
import {
  ValueProp,
  ColumnContent,
  Column,
  SuperTrainingWheel
} from './common';

export default class HowToUseQL extends React.PureComponent {

  render () {
    return (
      <SuperTrainingWheel {...this.props}>
        <ValueProp className="question-library">
          <h1 className="heading">
            How to use the Question Library
          </h1>
          <h2 className="sub-heading">
            View and manage assignment questions here, or let us do the work.
          </h2>
          <ColumnContent>
            <Column className="machine-learning">
              <p>
                When you assign a reading or homework, OpenStax Tutor will add personalized and spaced practice questions.
              </p>
            </Column>
            <Column className="question-details">
              <p>
                If you want to see the questions OpenStax Tutor might use, view them in the Question Library.
              </p>
            </Column>
            <Column className="exclude-question">
              <p>
                If you see any that should never be used, exclude them here.  Just remember to do so before you publish those assignments.
              </p>
            </Column>
          </ColumnContent>
        </ValueProp>
      </SuperTrainingWheel>
    );
  }
}
