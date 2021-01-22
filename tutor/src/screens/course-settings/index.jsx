import PropTypes from 'prop-types';
import React from 'react';
import { observable, computed, action } from 'mobx';
import { observer } from 'mobx-react';
import moment from 'moment-timezone';
import styled from 'styled-components';
import Courses from '../../models/courses-map';
import CoursePage from '../../components/course-page';
import Tabs from '../../components/tabs';
import CourseBreadcrumb from '../../components/course-breadcrumb';
import StudentAccess from './student-access';
import RenameCourseLink from './rename-course';
import Timezone from './timezone';
import './styles.scss';

const df = (d) => moment(d).format('MM/DD/YYYY');

const StyledCourseSettings = styled(CoursePage)`
  &&& .body-wrapper {
    padding: 0 40px;
    .body {
      padding-top: 10px;
    }
  }
`;

export default
@observer
class CourseSettings extends React.Component {

  static propTypes = {
    params: PropTypes.shape({
      courseId: PropTypes.string.isRequired,
    }).isRequired,
  }

  @observable tabIndex;

  @computed get course() {
    return Courses.get(this.props.params.courseId);
  }

  @action.bound onTabSelect(tabIndex) {
    this.tabIndex = tabIndex;
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
          {course.timezone}
          <Timezone course={course} />
        </div>
      </div>
    );
  }

  titleBreadcrumbs(course) {
    return <CourseBreadcrumb course={course} currentTitle="Course Settings" noBottomMargin />;
  }

  render() {
    const { course, tabIndex } = this;
    return (
      <StyledCourseSettings
        className="settings"
        title=""
        course={course}
        titleBreadcrumbs={this.titleBreadcrumbs(course)}
        titleAppearance="light"
        controlBackgroundColor='white'
      >
        {/* <div className="course-settings-title">
          {course.name}
          <RenameCourseLink course={this.course} />
        </div>
        <h4 className="course-settings-term">
          {course.termFull}
        </h4> */}
        <Tabs
          tabs={['STUDENT ACCESS', 'DATES AND TIME']}
          onSelect={this.onTabSelect}
        />
        {tabIndex ? this.renderDates() : this.renderAccess()}
      </StyledCourseSettings>
    );
  }
}
