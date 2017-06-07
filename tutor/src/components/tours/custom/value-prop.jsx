import React from 'react';
import { computed } from 'mobx';
import Courses from '../../../models/courses-map';
import BasicCourseUX from '../../../models/course/basic-ux';

import classnames from 'classnames';

import {
  ValueProp,
  ColumnContent,
  Column,
  TutorBeta
} from './common';
import SuperTrainingWheel from './super-training-wheel';

function TutorValueColumns() {
  return (
    <ColumnContent>
      <Column className="spaced">
        <h3>Spaced practice</h3>
        <p>Help students remember what they previously learned</p>
      </Column>
      <Column className="personalized">
        <h3>Personalized questions</h3>
        <p>Help students improve where they need it most</p>
      </Column>
      <Column className="two-step">
        <h3>Two-step questions</h3>
        <p>Help students study more effectively</p>
      </Column>
      <Column className="low-cost">
        <h3>Low cost</h3>
        <p>{BasicCourseUX.formattedStudentCost} per course saves students money</p>
      </Column>
    </ColumnContent>
  );
}

function CCToTutor() {
  return (
    <ValueProp className="cc-to-tutor">
      <h1 className="heading">Welcome to <TutorBeta />!</h1>
      <h2 className="sub-heading">
        Concept Coach is ending, but a better tool is here.
        Here's what your students have to look forward to!
      </h2>
      <TutorValueColumns />
    </ValueProp>
  );
}

function CCSunsetMessage() {
  return (
    <ValueProp className="cc-sunset">
      <h1 className="heading">Looking for your Concept Coach courses?</h1>
      <ColumnContent>
        <Column className="thanks">
          Thanks for participating in the
          Concept Coach pilot! Read our
          blog post to find out what we learned and how we’re moving forward.
        </Column>
        <Column className="export-by">
          The last day to export your
          Concept Coach scores reports is October 1.
        </Column>
        <Column className="not-launched-yet">
          We haven’t launched OpenStax Tutor in your subject yet. We’ll let you know as soon as it’s available.
          Looking for your Concept Coach
        </Column>
      </ColumnContent>
    </ValueProp>
  );
}

function Welcome() {
  return (
    <ValueProp className="welcome-to-tutor">
      <h1 className="heading">Welcome to <TutorBeta />!</h1>
      <h2 className="sub-heading">
        Improve how your students learn with research-based
        technology -- for only {BasicCourseUX.formattedStudentCost}.
      </h2>
      <TutorValueColumns />
    </ValueProp>
  );
}


export default class ValuePropWrapper extends React.PureComponent {

  @computed get isCCteacherWithoutMigration() {
    const sunset = Courses.where((c) => c.isSunsetting);
    return (sunset.any && sunset.size === Courses.nonPreview.size);
  }

  render () {
    let component = null;
    let hasForestBackground = true;

    if (this.isCCteacherWithoutMigration) {
      component = <CCSunsetMessage onContinue={this.onContinue} />;
      hasForestBackground = false;
    } else if (Courses.conceptCoach.any) {
      component = <CCToTutor onContinue={this.onContinue} />;
    } else {
      component = <Welcome onContinue={this.onContinue} />;
    }

    const className = classnames({
      'has-forest-background': hasForestBackground
    });

    return (
      <SuperTrainingWheel
        {...this.props}
        className={className}
      >
        {component}
      </SuperTrainingWheel>
    );
  }
}
