import React from 'react';
import { computed } from 'mobx';
import Courses from '../../../models/courses-map';
import CourseUX from '../../../models/course/ux';

import classnames from 'classnames';

import {
  ValueProp,
  ColumnContent,
  Column,
} from './common';
import CourseBranding from '../../branding/course';
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
        <p>{CourseUX.formattedStudentCost} per course saves students money</p>
      </Column>
    </ColumnContent>
  );
}

function CCToTutor() {
  return (
    <ValueProp className="cc-to-tutor">
      <h1 className="heading">Welcome to <CourseBranding />!</h1>
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
          <p>Thanks for participating in the<br/>
            Concept Coach pilot! Read our<br/>
            <a
              target="_blank"
              href="https://openstax.org/blog/concept-coach-ending-greater-tools-are-coming"
            >blog post</a> to find out what we learned and how we’re moving forward.</p>
        </Column>
        <Column className="export-by">
          <p>The last day to export your<br/>
            Concept Coach scores reports is October 1.</p>
        </Column>
        <Column className="not-launched-yet">
          <p>We haven’t launched<br/>
            OpenStax Tutor in your subject yet. We’ll let you know as soon as it’s available.</p>
        </Column>
      </ColumnContent>
    </ValueProp>
  );
}

function Welcome() {
  return (
    <ValueProp className="welcome-to-tutor">
      <h1 className="heading">Welcome to <CourseBranding />!</h1>
      <h2 className="sub-heading">
        Improve how your students learn with research-based
        technology -- for only {CourseUX.formattedStudentCost}.
      </h2>
      <TutorValueColumns />
    </ValueProp>
  );
}

class CourseValueProp extends React.PureComponent {

  @computed get isCCteacherWithoutMigration() {
    const sunset = Courses.where((c) => c.isSunsetting);
    return (sunset.any && sunset.size === Courses.nonPreview.size);
  }

  render () {
    if (this.isCCteacherWithoutMigration) {
      return <CCSunsetMessage onContinue={this.onContinue} />;
    } else if (Courses.conceptCoach.any) {
      return <CCToTutor onContinue={this.onContinue} />;
    } else {
      return <Welcome onContinue={this.onContinue} />;
    }
  }
}

export { CourseValueProp };
export default class ValuePropWrapper extends React.PureComponent {

  @computed get isCCteacherWithoutMigration() {
    const sunset = Courses.where((c) => c.isSunsetting);
    return (sunset.any && sunset.size === Courses.nonPreview.size);
  }

  render () {
    let hasForestBackground = true;

    if (this.isCCteacherWithoutMigration) {
      hasForestBackground = false;
    }

    const className = classnames({
      'has-forest-background': hasForestBackground,
    });

    return (
      <SuperTrainingWheel
        {...this.props}
        className={className}
      >
        <CourseValueProp/>
      </SuperTrainingWheel>
    );
  }
}
