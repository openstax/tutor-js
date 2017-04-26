import React from 'react';

import { observer } from 'mobx-react';
import { computed } from 'mobx';
import { isEmpty, merge, map } from 'lodash';
import { Col, Row, Grid } from 'react-bootstrap';
import classnames from 'classnames';

import { ReactHelpers } from 'shared';

import Courses from '../../models/courses-map';
import User from '../../models/user';
import CourseModel from '../../models/course';
import AddCourse from './add-course';
import { CoursePreview, Course, CourseTeacher } from './course';

function wrapCourseItem(Item, course = {}) {
  return (
    <Col key={`course-listing-item-wrapper-${course.id}`} md={3} sm={6} xs={12}>
      <Item
        course={course}
      />
    </Col>
  );
}


function CourseListingNone() {
  return (
    <Row className="course-listing-none">
      <Col md={12}>
        <p>
          There are no current courses.
        </p>
      </Col>
    </Row>
  );
}

const CourseListingAdd = () => wrapCourseItem(AddCourse);

const DEFAULT_COURSE_ITEMS = {
  teacher: CourseTeacher,
  student: Course,
};


@observer
class CourseListingBase extends React.Component {

  static propTypes = {
    courses:    React.PropTypes.arrayOf( React.PropTypes.instanceOf(CourseModel) ).isRequired,
    items:      React.PropTypes.objectOf(React.PropTypes.element),
    className:  React.PropTypes.string,
    before:     React.PropTypes.element,
    after:      React.PropTypes.element,
  }

  @computed get items() {
    return merge({}, DEFAULT_COURSE_ITEMS, this.props.items);
  }

  renderCourse(course) {
    const Item = course.is_preview ? CoursePreview :
                 this.items[User.verifiedRoleForCourse(course)];
    return Item ? wrapCourseItem(Item, course) : null;
  }

  render() {
    const { courses, className, before, after } = this.props;

    const sectionClasses = classnames('course-listing-section', className);

    return (
      <Row className={sectionClasses}>
        {before}
        {map(courses, (course) => this.renderCourse(course))}
        {after}
      </Row>
    );
  }
}

@observer
class CourseListingTitle extends React.Component {
  static propTypes = {
    title: React.PropTypes.string.isRequired,
    main: React.PropTypes.bool,
  }

  static defaultProps = {
    main: false,
  }

  render() {
    const { title } = this.props;
    return (
      <Row className="course-listing-title">
        <Col md={12}>
          <h1>{title}</h1>
        </Col>
      </Row>
    );
  }
}

@observer
export class CourseListingCurrent extends React.PureComponent {

  render () {
    const baseName = ReactHelpers.getBaseName(this);
    const courses = Courses.currentAndFuture.array;

    return (
      <div className={baseName}>
        <Grid>
          <CourseListingTitle title="Current Courses" main={true} />
          {isEmpty(courses) ? <CourseListingNone /> : undefined}
          <CourseListingBase
            className={`${baseName}-section`}
            courses={courses}
            after={User.isConfirmedFaculty ? <CourseListingAdd /> : undefined} />
        </Grid>
      </div>
    );
  }
}

@observer
class CourseListingBasic extends React.PureComponent {
  static propTypes = {
    title:    React.PropTypes.string.isRequired,
    baseName: React.PropTypes.string.isRequired,
    courses:  React.PropTypes.arrayOf( React.PropTypes.instanceOf(CourseModel) ).isRequired,
  }

  render() {
    const { courses, baseName, title } = this.props;
    if (isEmpty(courses)) { return null; }

    return (
      (
        <div className={baseName}>
          <Grid>
            <CourseListingTitle title={title} />
            <CourseListingBase className={`${baseName}-section`} courses={courses} />
          </Grid>
        </div>
      )
    );
  }
}

@observer
export class CourseListingPast extends React.PureComponent {
  render() {
    return (
      <CourseListingBasic
        courses={Courses.completed.array}
        baseName={ReactHelpers.getBaseName(this)}
        title="Past Courses"
      />
    );
  }
}


@observer
export class CourseListingFuture extends React.PureComponent {
  render() {
    return (
      <CourseListingBasic
        courses={Courses.future.array}
        baseName={ReactHelpers.getBaseName(this)}
        title="Future Courses"
      />
    );
  }
}
