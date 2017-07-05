import React from 'react';
import { observable, action, computed } from 'mobx';
import { observer } from 'mobx-react';
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

function CCToTutor(props) {
  return (
    <SuperTrainingWheel {...props} >
      <ValueProp className="cc-to-tutor">
        <h1 className="heading">Welcome to <CourseBranding />!</h1>
        <h2 className="sub-heading">
          Concept Coach is ending, but a better tool is here.
          Here's what your students have to look forward to!
        </h2>
        <TutorValueColumns />
      </ValueProp>
    </SuperTrainingWheel>
  );
}



function GoneAway() {
  return (
    <Column className="not-launched-yet">
      <p>We haven’t launched<br/>
        OpenStax Tutor in your subject yet. We’ll let you know as soon as it’s available.</p>
    </Column>
  );
}


function GetStarted() {
  return (
    <Column className="view-analytics">
      <p>
        Get started with OpenStax Tutor Beta's advanced analytics and assignable
        homework from your My Courses page.
      </p>
    </Column>
  );
}

function CCSunsetMessage(props) {
  const MigrateMessage = props.canMigrate ? GetStarted : GoneAway;
  return (
    <SuperTrainingWheel {...props} className='has-forest-background'>
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
          <MigrateMessage />
        </ColumnContent>
      </ValueProp>
    </SuperTrainingWheel>
  );
}

function Welcome(props) {
  return (
    <SuperTrainingWheel {...props} >
      <ValueProp className="welcome-to-tutor">
        <h1 className="heading">Welcome to <CourseBranding />!</h1>
        <h2 className="sub-heading">
          Improve how your students learn with research-based
          technology — for only {CourseUX.formattedStudentCost}.
        </h2>
        <TutorValueColumns />
      </ValueProp>
    </SuperTrainingWheel>
  );
}

@observer
class CourseValueProp extends React.PureComponent {

  @computed get isCCteacherWithoutMigration() {
    const sunset = Courses.where((c) => c.isSunsetting);
    return (sunset.any && sunset.size === Courses.nonPreview.size);
  }

  @observable showCCGoAway = false;

  @action.bound onCCToTutorContinue() {

    this.showCCGoAway = true;
  }

  render () {
    if (this.isCCteacherWithoutMigration) {
      return <CCSunsetMessage {...this.props} />;
    } else if (Courses.conceptCoach.any) {
      if (this.showCCGoAway) {
        return <CCSunsetMessage canMigrate {...this.props} />;
      } else {
        return <CCToTutor {...this.props} onClick={this.onCCToTutorContinue} />;
      }
    } else {
      return <Welcome {...this.props} />;
    }
  }
}

export default CourseValueProp;

//
// export default class ValuePropWrapper extends React.PureComponent {
//
//   @computed get isCCteacherWithoutMigration() {
//     const sunset = Courses.where((c) => c.isSunsetting);
//     return (sunset.any && sunset.size === Courses.nonPreview.size);
//   }
//
//   render () {
//     let hasForestBackground = true;
//
//     if (this.isCCteacherWithoutMigration) {
//       hasForestBackground = false;
//     }
//
//     const className = classnames({
//       'has-forest-background': hasForestBackground,
//     });
//
//     return (
//       <SuperTrainingWheel
//         {...this.props}
//         className={className}
//       >
//         <CourseValueProp />
//       </SuperTrainingWheel>
//     );
//   }
// }
