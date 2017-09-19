import React from 'react';
import { observable, computed, action } from 'mobx';
import { observer } from 'mobx-react';

import Courses from '../../models/courses-map';
import CoursePage from '../course-page';

import Tabs from '../tabs';

import StudentAccess from './student-access';
import RenameCourseLink from './rename-course';
import Timezone from './timezone';
import moment from 'moment-timezone';

const df = (d) => moment(d).format('MM/DD/YYYY');

@observer
export default class CourseSettings extends React.PureComponent {

  static propTypes = {
    params: React.PropTypes.shape({
      courseId: React.PropTypes.string.isRequired,
    }).isRequired,
  }

  @observable tabIndex;

  @computed get course() {
    return Courses.get(this.props.params.courseId);
  }

  @action.bound onTabSelect(tabIndex) {
    this.tabIndex = tabIndex;
  }

  renderControls() {

    return (
      <div className="controls">
        <div className="sub-title">
          {this.course.name}
          <RenameCourseLink course={this.course} />
        </div>
        <Tabs
          tabs={['dates and time', 'student access']}
          onSelect={this.onTabSelect}
        />
      </div>
    );
  }

  renderAccess() {
    return (
      <StudentAccess course={this.course} />
    );
  }

  renderDates() {
    const { course } = this;
    return (
      <div className="dates-and-times">
        <div>
          Term: {course.termFull}
        </div>
        <div>
          Starts: {df(course.bounds.start)} Ends: {df(course.bounds.end)}
        </div>
        <div>
          {course.time_zone} <Timezone course={course} />
        </div>
      </div>
    );
  }

  render() {
    const { course, tabIndex } = this;
    return (
      <CoursePage
        className="settings"
        title="Settings"
        course={course}
        controls={this.renderControls()}
      >
        {tabIndex ? this.renderAccess() : this.renderDates()}
      </CoursePage>
    );
  }
}
