import React from 'react';
import { action } from 'mobx';

import { Tooltip } from 'react-joyride';

import {
  ValueProp,
  ColumnContent,
  Column,
  TutorBeta
} from './common';


export default class HowToUsePreview extends React.PureComponent {


  @action.bound
  onHide() {
    this.props.ride.joyrideRef.next()
  }

  render () {
    const step = this.props.step;
    step.text = <ValueProp className="course-preview">
      <h1 className="heading">What can you do in a preview course?</h1>
      <h2 className="sub-heading">Test drive all the features, but your work will stay in here.</h2>
      <ColumnContent>
        <Column className="all-features">
          <p>Try out all features</p>
        </Column>
        <Column className="view-analytics">
          <p>View analytics with student sample data</p>
        </Column>
        <Column className="view-textbook-questions">
          <p>See the textbook and questions</p>
        </Column>
        <Column className="cant-save-work">
          <p>
            Work you do here won't<br/>
            be saved
          </p>
        </Column>
      </ColumnContent>
    </ValueProp>

    return (
      <Tooltip
        {...this.props}
        step={step}
        buttons={{
          primary: 'Continue'
        }}
      />

    );
  }
}
