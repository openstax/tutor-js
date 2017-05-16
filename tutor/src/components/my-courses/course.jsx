import React from 'react';
import classnames from 'classnames';
import { observer } from 'mobx-react';
import { omit } from 'lodash';
import { computed, action } from 'mobx';
import Router from '../../helpers/router';
import TutorLink from '../link';
import Icon from '../icon';
import CourseModel from '../../models/course';
import CourseUX from '../../models/course/ux';
import OXFancyLoader from '../ox-fancy-loader';

import { wrapCourseDragComponent } from './course-dnd';

const BRAND = 'OpenStax';

import CourseData from '../../helpers/course-data';

const CoursePropType = React.PropTypes.shape({
  id:   React.PropTypes.string.isRequired,
  name: React.PropTypes.string.isRequired,
  year: React.PropTypes.number.isRequired,
  term: React.PropTypes.string.isRequired,
  is_concept_coach: React.PropTypes.bool.isRequired,
});
export { CoursePropType };

@observer
class CourseBranding extends React.PureComponent {

  static propTypes = {
    isConceptCoach: React.PropTypes.bool.isRequired,
    isBeta:         React.PropTypes.bool,
  }

  render() {
    let brand;
    let { isConceptCoach, isBeta } = this.props;

    if (isConceptCoach) {
      if (isBeta == null) { isBeta = false; }
      brand = `${BRAND} Concept Coach`;
    } else {
      if (isBeta == null) { isBeta = true; }
      brand = `${BRAND} Tutor`;
    }

    return (
      <p className="my-courses-item-brand" data-is-beta={isBeta}>
        {brand}
      </p>
    );
  }

}


@observer
export class CoursePreview extends React.PureComponent {

  static contextTypes = {
    router: React.PropTypes.object,
  }

  static propTypes = {
    course: React.PropTypes.instanceOf(CourseModel).isRequired,
    className: React.PropTypes.string,
  }

  @computed get ux () {
    return new CourseUX(this.props.course);
  }

  @action.bound redirectToCourse() {
    this.context.router.transitionTo(Router.makePathname(
      'dashboard', { courseId: course.previewCourse.id },
    ));
  }

  @action.bound onClick() {
    const { course } = this.props;
    if (course.isCreated) {
      this.redirectToCourse();
    } else {
      course.build().then(this.redirectToCourse);
    }
  }

  @computed get previewMessage() {
    if (this.props.course.isBuilding) {
      return <h4 key="title">Loading Preview</h4>;
    }
    return [
      <h4 key="title"><Icon type="eye" /> Preview</h4>,
      <p key="message">Check out a course with assignments and sample data</p>,
    ];
  }

  render() {
    const { course, className } = this.props;
    const itemClasses = classnames('my-courses-item', 'preview', className, {
      'is-building': course.isBuilding,
    });
    return (
      <div className="my-courses-item-wrapper preview">
        <div
          {...this.ux.dataProps}
          data-is-teacher={true}
          data-course-id={course.id}
          data-course-course-type={'tutor'}
          className={itemClasses}
        >
          <a
            className="my-courses-item-title"
            onClick={this.onClick}
          >
            <h3 className="name">{course.name}</h3>
            <div className="preview-belt">
              {this.previewMessage}
              <OXFancyLoader isLoading={course.isBuilding} />
            </div>
          </a>
        </div>
      </div>
    );

  }
}

export class Course extends React.PureComponent {

  static propTypes = {
    course: React.PropTypes.instanceOf(CourseModel).isRequired,
    className:        React.PropTypes.string,
    controls:         React.PropTypes.element,
  }

  @computed get ux () {
    return new CourseUX(this.props.course);
  }

  renderControls(controls) {
    return (
      <div className="my-courses-item-controls">
        {controls}
      </div>
    );
  }

  render() {
    const { course, controls } = this.props;
    return (
      <div className="my-courses-item-wrapper">
        <div
          {...this.ux.dataProps}
          data-is-teacher={this.ux.course.isTeacher}
          data-course-id={this.ux.courseId}
          data-course-course-type={this.ux.courseType}
          className={classnames('my-courses-item', this.props.className)}
        >
          <div className="my-courses-item-title">
            <TutorLink to="dashboard" params={{ courseId: this.ux.courseId }}>
              {course.name}
            </TutorLink>
          </div>
          <div
            className="my-courses-item-details"
            data-has-controls={controls != null}>
            <TutorLink to="dashboard" params={{ courseId: this.ux.courseId }}>
              <CourseBranding isConceptCoach={!!course.is_concept_coach} />
              <p className="my-courses-item-term">
                {course.term}
                {' '}
                {course.year}
              </p>
            </TutorLink>
            {controls && this.renderControls(controls)}
          </div>
        </div>
      </div>
    );
  }
}

@wrapCourseDragComponent
export class CourseTeacher extends React.Component {

  static propTypes = omit(Course.propTypes, 'controls');

  render() {
    const { course } = this.props;
    const link =
      <TutorLink
        to="createNewCourse"
        params={{ sourceId: course.id }}
        className="btn btn-default btn-sm"
      >
        Copy this course
      </TutorLink>;

    return (
      this.props.connectDragSource(
        <div
          className={classnames('course-teacher', { 'is-dragging': this.props.isDragging })}>
          <Course {...this.props} controls={link} />
        </div>
      )
    );
  }
}
