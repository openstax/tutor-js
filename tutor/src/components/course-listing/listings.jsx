import _ from 'lodash';
import React from 'react';

import { Col, Row, Grid } from 'react-bootstrap';

import TutorLink from '../link';
import classnames from 'classnames';

import Router from '../../helpers/router';

import { wrapCourseDropComponent } from './course-dnd';

import { CourseStore } from '../../flux/course';
import { CurrentUserStore } from '../../flux/current-user';
import { ReactHelpers } from 'shared';

import CourseData from '../../helpers/course-data';
import IconAdd from '../icons/add';

import { Course, CourseTeacher, CoursePropType } from './course';

function wrapCourseItem(Item, course) {
  let courseDataProps, courseIsTeacher, courseSubject;
  if (course == null) { course = {}; }
  const { id } = course;
  const courseName = id || 'new';
  if (id) {
    courseDataProps = CourseData.getCourseDataProps(id);
    courseSubject = CourseStore.getSubject(id);
    courseIsTeacher = CourseStore.isTeacher(id);
  }
  return (
    <Col key={`course-listing-item-wrapper-${courseName}`} md={3} sm={6} xs={12}>
      <Item
        course={course}
        courseSubject={courseSubject}
        courseIsTeacher={courseIsTeacher}
        courseDataProps={courseDataProps} />
    </Col>
  );
}

@wrapCourseDropComponent
class AddCourseArea extends React.Component {

  static propTypes = {
    isHovering: React.PropTypes.bool,
    connectDropTarget: React.PropTypes.func.isRequired,
  }

  static contextTypes = {
    router: React.PropTypes.object,
  }

  onDrop(course) {
    const url = Router.makePathname('createNewCourse', { sourceId: course.id });
    this.context.router.transitionTo(url);
  }

  render() {
    return (
      this.props.connectDropTarget(
        <div className="course-listing-add-zone">
          <TutorLink
            to="createNewCourse"
            className={classnames({ 'is-hovering': this.props.isHovering })}>
            <div>
              <IconAdd />
              <span>
                Add a course
              </span>
            </div>
          </TutorLink>
        </div>
      )
    );
  }
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

const CourseListingAdd = () => wrapCourseItem(AddCourseArea);


const DEFAULT_COURSE_ITEMS = {
  teacher: CourseTeacher,
  student: Course,
};

class CourseListingBase extends React.Component {

  static propTypes = {
    courses:    React.PropTypes.arrayOf(CoursePropType.isRequired).isRequired,
    items:      React.PropTypes.objectOf(React.PropTypes.element),
    className:  React.PropTypes.string,
    before:     React.PropTypes.element,
    after:      React.PropTypes.element,
  }

  getItems() {
    return (
        _.merge({}, DEFAULT_COURSE_ITEMS, this.props.items)
    );
  }

  render() {
    const { courses, className, before, after } = this.props;
    const items = this.getItems();

    const sectionClasses = classnames('course-listing-section', className);

    return (
      <Row className={sectionClasses}>
        {before}
        {_.map(courses, (course) => {
           const Item = items[CurrentUserStore.getCourseVerifiedRole(course.id)]
           if (Item) { return wrapCourseItem(Item, course); }
         })}
        {after}
      </Row>
    );
  }
}

class CourseListingTitle extends React.Component {
  static propTypes = {
    title: React.PropTypes.string.isRequired,
    main: React.PropTypes.bool
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

class CourseListingCurrent extends React.Component {

  static propTypes = {
    courses:  React.PropTypes.arrayOf(CoursePropType.isRequired).isRequired
  }

  render() {
    const { courses } = this.props;
    const baseName = ReactHelpers.getBaseName(this);

    return (
      <div className={baseName}>
        <Grid>
          <CourseListingTitle title="Current Courses" main={true} />
          {_.isEmpty(courses) ? <CourseListingNone /> : undefined}
          <CourseListingBase
            className={`${baseName}-section`}
            courses={courses}
            after={CurrentUserStore.isTeacher() ? <CourseListingAdd /> : undefined} />
        </Grid>
      </div>
    );
  }
}

const CourseListingBasic = React.createClass({
  displayName: 'CourseListingBasic',
  propTypes: {
    title:    React.PropTypes.string.isRequired,
    baseName: React.PropTypes.string.isRequired,
    courses:  React.PropTypes.arrayOf(CoursePropType.isRequired).isRequired
  },
  render() {
    const {courses, baseName, title} = this.props;

    if (_.isEmpty(courses)) {
      return (
          null
      );
    } else {
      return (
          (
            <div className={baseName}>
              <BS.Grid>
                <CourseListingTitle title={title} />
                <CourseListingBase className={`${baseName}-section`} courses={courses} />
              </BS.Grid>
            </div>
          )
      );
    }
  }
});

const CourseListingPast = React.createClass({
  displayName: 'CourseListingPast',
  propTypes: {
    courses:  React.PropTypes.arrayOf(CoursePropType.isRequired).isRequired
  },
  render() {
    const baseName = ReactHelpers.getBaseName(this);
    return (
        <CourseListingBasic {...this.props} baseName={baseName} title="Past Courses" />
    );
  }
});

const CourseListingFuture = React.createClass({
  displayName: 'CourseListingFuture',
  propTypes: {
    courses:  React.PropTypes.arrayOf(CoursePropType.isRequired).isRequired
  },
  render() {
    const baseName = ReactHelpers.getBaseName(this);
    return (
        <CourseListingBasic {...this.props} baseName={baseName} title="Future Courses" />
    );
  }
});

export { CourseListingPast, CourseListingCurrent, CourseListingFuture };
