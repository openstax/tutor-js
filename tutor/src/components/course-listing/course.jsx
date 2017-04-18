import React from 'react';
import classnames from 'classnames';
import { observer } from 'mobx-react';
import _ from 'lodash';

import TutorLink from '../link';

import Router from '../../helpers/router';
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
      <p className="course-listing-item-brand" data-is-beta={isBeta}>
        {brand}
      </p>
    );
  }

}


export class Course extends React.PureComponent {

  static propTypes = {
    course:           CoursePropType.isRequired,
    courseSubject:    React.PropTypes.string.isRequired,
    courseIsTeacher:  React.PropTypes.bool.isRequired,
    courseDataProps:  React.PropTypes.object.isRequired,
    className:        React.PropTypes.string,
    controls:         React.PropTypes.element,
  }

  renderControls(controls) {
    return (
      <div className="course-listing-item-controls">
        {controls}
      </div>
    );
  }

  render() {
    const { course, courseDataProps, controls, courseIsTeacher, className } = this.props;
    const itemClasses = classnames('course-listing-item', className);
    return (
      <div className="course-listing-item-wrapper">
        <div
          {...courseDataProps}
          data-is-teacher={courseIsTeacher}
          data-course-id={course.id}
          data-course-course-type={course.is_concept_coach ? 'cc' : 'tutor'}
          className={itemClasses}>
          <div className="course-listing-item-title">
            <TutorLink to="dashboard" params={{ courseId: course.id }}>
              {course.name}
            </TutorLink>
          </div>
          <div
            className="course-listing-item-details"
            data-has-controls={controls != null}>
            <TutorLink to="dashboard" params={{ courseId: course.id }}>
              <CourseBranding isConceptCoach={course.is_concept_coach || false} />
              <p className="course-listing-item-term">
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

  static propTypes = _.omit(Course.propTypes, 'controls');

  render() {
    const { course } = this.props;
    const link =
      <TutorLink
        to="createNewCourse"
        params={{ sourceId: course.id }}
        className="btn btn-default btn-sm">
        Teach Again
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
