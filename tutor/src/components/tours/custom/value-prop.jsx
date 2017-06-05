import React from 'react';
import { action, computed } from 'mobx';
import Courses from '../../../models/courses-map';
import { Button } from 'react-bootstrap';
import classnames from 'classnames';
import BasicCourseUX from '../../../models/course/basic-ux';

function ValueProp({ className, children }) {
  return <div className={classnames('value-prop', className)}>{children}</div>;
}

function ColumnContent({ children }) {
  return <div className="column-content">{children}</div>;
}

function Column({ className, children }) {
  return <div className={classnames('column', className)}>{children}</div>;
}

function TutorBeta() {
  return (
    <span>OpenStax Tutor <span className="beta">beta</span></span>
  );
}
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

function CCToTutor({ onContinue }) {
  return (
    <ValueProp className="cc-to-tutor">
      <h1 className="heading">Welcome to <TutorBeta />!</h1>
      <h2 className="sub-heading">
        Concept Coach is ending, but a better tool is here.
        Here's what your students have to look forward to!
      </h2>
      <TutorValueColumns />
      <Button onClick={onContinue}>Continue</Button>
    </ValueProp>
  );
}

function CCSunsetMessage({ onContinue }) {
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
      <Button onClick={onContinue}>Continue</Button>
    </ValueProp>
  );
}

function Welcome({ onContinue }) {
  return (
    <ValueProp className="welcome-to-tutor">
      <h1 className="heading">Welcome to <TutorBeta />!</h1>
      <h2 className="sub-heading">
        Improve how your students learn with research-based
        technology -- for only {BasicCourseUX.formattedStudentCost}.
      </h2>
      <TutorValueColumns />
      <Button onClick={onContinue}>Continue</Button>
    </ValueProp>
  );
}


export default class ValuePropWrapper extends React.PureComponent {

  @action.bound
  onContinue() {
    this.props.ride.joyrideRef.next();
  }

  @computed get isCCteacherWithoutMigration() {
    const sunset = Courses.where((c) => c.isSunsetting);
    return (sunset.any && sunset.size === Courses.nonPreview.size);
  }

  render () {
    if (this.isCCteacherWithoutMigration) {
      return <CCSunsetMessage onContinue={this.onContinue} />;
    }
    if (Courses.conceptCoach.any) {
      return <CCToTutor onContinue={this.onContinue} />;
    }
    return <Welcome onContinue={this.onContinue} />;
  }
}
