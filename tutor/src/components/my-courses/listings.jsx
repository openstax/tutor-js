import PropTypes from 'prop-types';
import React from 'react';
import { observer } from 'mobx-react';
import { computed, observable } from 'mobx';
import { isEmpty, merge, map, take, last } from 'lodash';
import { Col, Row, Container } from 'react-bootstrap';
import classnames from 'classnames';
import PreviewCourseOffering from '../../models/course/offerings/previews';
import Courses from '../../models/courses-map';
import User from '../../models/user';
import CourseModel from '../../models/course';
import CreateACourse from './create-a-course';
import { CoursePreview, Course, CourseTeacher } from './course';
import TourAnchor from '../tours/anchor';

function wrapCourseItem(Item, course = {}) {
  return (
    <Col key={course.id} lg={3} md={4} sm={6} xs={12}>
      <Item
        course={course}
      />
    </Col>
  );
}

function MyCoursesNone() {
  return (
    <Row className="my-courses-none">
      <Col xs={12}>
        <p>
          There are no current courses.
        </p>
      </Col>
    </Row>
  );
}

const MyCoursesCreate = () => wrapCourseItem(CreateACourse);

const DEFAULT_COURSE_ITEMS = {
  teacher: CourseTeacher,
  student: Course,
};


@observer
class MyCoursesBase extends React.Component {

  static propTypes = {
    courses:    PropTypes.arrayOf( PropTypes.instanceOf(CourseModel) ).isRequired,
    items:      PropTypes.objectOf(PropTypes.element),
    className:  PropTypes.string,
    before:     PropTypes.element,
    after:      PropTypes.element,
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

    const sectionClasses = classnames('my-courses-section', className);

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
class MyCoursesTitle extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    main: PropTypes.bool,
  }

  static defaultProps = {
    main: false,
  }

  render() {
    const { title } = this.props;
    return (
      <Row className="my-courses-title">
        <Col xs={12}>
          <h1>{title}</h1>
        </Col>
      </Row>
    );
  }
}


@observer
class MyCoursesCurrent extends React.Component {

  render () {
    const baseName = 'my-courses-current';
    const courses = Courses.tutor.nonPreview.currentAndFuture.array;
    return (
      <div data-test-id="current-courses" className={baseName}>
        <Container>
          <MyCoursesTitle title="Current Courses" main={true} />
          {isEmpty(courses) ? <MyCoursesNone /> : undefined}
          <MyCoursesBase
            className={`${baseName}-section`}
            courses={courses}
            after={User.isConfirmedFaculty ? <MyCoursesCreate /> : undefined} />
        </Container>
      </div>
    );
  }
}

@observer
class MyCoursesBasic extends React.Component {
  static propTypes = {
    title:    PropTypes.string.isRequired,
    baseName: PropTypes.string.isRequired,
    courses:  PropTypes.arrayOf( PropTypes.instanceOf(CourseModel) ).isRequired,
    before:   PropTypes.element,
    after:    PropTypes.element,
  }

  render() {
    const { courses, baseName, title, before, after } = this.props;
    if (isEmpty(courses)) { return null; }

    return (
      (
        <div className={baseName}>
          <Container>
            <MyCoursesTitle title={title} />
            <MyCoursesBase
              className={`${baseName}-section`}
              courses={courses}
              before={before}
              after={after}
            />
          </Container>
        </div>
      )
    );
  }
}


@observer
class MyCoursesPast extends React.Component {
  render() {
    return (
      <MyCoursesBasic
        courses={Courses.tutor.nonPreview.completed.array}
        baseName={'my-courses-past'}
        title="Past Courses"
      />
    );
  }
}


@observer
class MyCoursesFuture extends React.Component {
  render() {
    return (
      <MyCoursesBasic
        courses={Courses.tutor.nonPreview.future.array}
        baseName={'my-courses-future'}
        title="Future Courses"
      />
    );
  }
}

function ExploreAPreview({ course }) {
  return (
    <Col key={`my-courses-item-wrapper-${course.id}`} lg={3} md={4} sm={6} xs={12}>
      <TourAnchor id='explore-a-preview-zone'>
        <CoursePreview
          course={course}
        />
      </TourAnchor>
    </Col>
  );
}

ExploreAPreview.propTypes = {
  course: PropTypes.object,
};

@observer
class MyCoursesPreview extends React.Component {

  @observable previews;

  componentDidMount() {
    if (User.canViewPreviewCourses) {
      PreviewCourseOffering.fetch();
    }
  }

  render() {
    if (!User.canViewPreviewCourses) { return null; }

    const courses = PreviewCourseOffering.all;

    return (
      <MyCoursesBasic
        courses={take(courses, courses.length - 1)}
        baseName={'my-courses-preview'}
        title="Preview Courses"
        after={<ExploreAPreview course={last(courses)} />}
      />
    );
  }
}

export { MyCoursesCurrent, MyCoursesPast, MyCoursesFuture, MyCoursesPreview };
