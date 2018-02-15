import React from 'react';

import { observer } from 'mobx-react';
import { computed, observable } from 'mobx';
import { isEmpty, merge, map, reject, last, take } from 'lodash';
import { Col, Row, Grid } from 'react-bootstrap';
import classnames from 'classnames';

import { ReactHelpers } from 'shared';
import PreviewCourseOffering from '../../models/course/offerings/previews';
import Courses from '../../models/courses-map';
import User from '../../models/user';
import CourseModel from '../../models/course';
import CreateACourse from './create-a-course';
import { CoursePreview, Course, CourseTeacher } from './course';
import TourAnchor from '../tours/anchor';

function wrapCourseItem(Item, course = {}) {
  return (
    <Col key={`my-courses-item-wrapper-${course.id}`} lg={3} md={4} sm={6} xs={12}>
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
    title: React.PropTypes.string.isRequired,
    main: React.PropTypes.bool,
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
export class MyCoursesCurrent extends React.PureComponent {

  render () {
    const baseName = ReactHelpers.getBaseName(this);
    const courses = Courses.tutor.nonPreview.currentAndFuture.array;

    return (
      <div className={baseName}>
        <Grid>
          <MyCoursesTitle title="Current Courses" main={true} />
          {isEmpty(courses) ? <MyCoursesNone /> : undefined}
          <MyCoursesBase
            className={`${baseName}-section`}
            courses={courses}
            after={User.isConfirmedFaculty ? <MyCoursesCreate /> : undefined} />
        </Grid>
      </div>
    );
  }
}

@observer
class MyCoursesBasic extends React.PureComponent {
  static propTypes = {
    title:    React.PropTypes.string.isRequired,
    baseName: React.PropTypes.string.isRequired,
    courses:  React.PropTypes.arrayOf( React.PropTypes.instanceOf(CourseModel) ).isRequired,
  }

  render() {
    const { courses, baseName, title, before, after } = this.props;
    if (isEmpty(courses)) { return null; }

    return (
      (
        <div className={baseName}>
          <Grid>
            <MyCoursesTitle title={title} />
            <MyCoursesBase
              className={`${baseName}-section`}
              courses={courses}
              before={before}
              after={after}
            />
          </Grid>
        </div>
      )
    );
  }
}

@observer
export class MyCoursesPast extends React.PureComponent {
  render() {
    return (
      <MyCoursesBasic
        courses={Courses.tutor.nonPreview.completed.array}
        baseName={ReactHelpers.getBaseName(this)}
        title="Past Courses"
      />
    );
  }
}


@observer
export class MyCoursesFuture extends React.PureComponent {
  render() {
    return (
      <MyCoursesBasic
        courses={Courses.tutor.nonPreview.future.array}
        baseName={ReactHelpers.getBaseName(this)}
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

@observer
export class MyCoursesPreview extends React.PureComponent {

  @observable previews;

  componentWillMount() {
    if (User.isConfirmedFaculty) {
      PreviewCourseOffering.fetch();
    }
  }

  render() {
    if (!User.isConfirmedFaculty) { return null; }

    const courses = PreviewCourseOffering.all;

    return (
      <MyCoursesBasic
        courses={take(courses, courses.length - 1)}
        baseName={ReactHelpers.getBaseName(this)}
        after={<ExploreAPreview course={last(courses)} />}
        title="Preview Courses"
      />
    );
  }
}
