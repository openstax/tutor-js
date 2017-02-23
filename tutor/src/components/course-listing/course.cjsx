React = require 'react'
classnames = require 'classnames'
BS = require 'react-bootstrap'
_ = require 'lodash'

TutorLink = require '../link'

Router = require '../../helpers/router'
DnD = require './course-dnd'
BRAND = 'OpenStax'

CourseData = require '../../helpers/course-data'

CoursePropType = React.PropTypes.shape(
  id:   React.PropTypes.string.isRequired
  name: React.PropTypes.string.isRequired
  year: React.PropTypes.number.isRequired
  term: React.PropTypes.string.isRequired
  is_concept_coach: React.PropTypes.bool.isRequired
)

CourseBranding = React.createClass
  displayName: 'CourseBranding'
  propTypes:
    isConceptCoach: React.PropTypes.bool.isRequired
    isBeta:         React.PropTypes.bool
  render: ->
    {isConceptCoach, isBeta} = @props

    if isConceptCoach
      isBeta ?= false
      brand = "#{BRAND} Concept Coach"
    else
      isBeta ?= true
      brand = "#{BRAND} Tutor"

    <p
      className='course-listing-item-brand'
      data-is-beta={isBeta}
    >{brand}</p>

Course = React.createClass
  displayName: 'Course'
  propTypes:
    course:           CoursePropType.isRequired
    courseSubject:    React.PropTypes.string.isRequired
    courseIsTeacher:  React.PropTypes.bool.isRequired
    courseDataProps:  React.PropTypes.object.isRequired
    className:        React.PropTypes.string
    controls:         React.PropTypes.element

  Controls: ->
    {controls} = @props

    <div className='course-listing-item-controls'>
      {controls}
    </div>

  CourseName: ->
    {course, courseSubject} = @props
    # courseNameSegments = CourseData.getCourseNameSegments(course, courseSubject)
    # hasNoSubject = _.isEmpty(courseNameSegments)
    # courseNameSegments ?= course.name.split(/\W+/)

    <TutorLink
      to='dashboard'
      params={courseId: course.id}
    >
      {course.name}
    </TutorLink>

  render: ->
    {course, courseDataProps, controls, courseIsTeacher, className} = @props

    itemClasses = classnames('course-listing-item', className)

    <div className='course-listing-item-wrapper'>
      <div
        {...courseDataProps}
        data-is-teacher={courseIsTeacher}
        data-course-id={course.id}
        className={itemClasses}
      >
        <div
          className='course-listing-item-title'>
          <@CourseName />
        </div>
        <div
          className='course-listing-item-details'
          data-has-controls={controls?}
        >
          <TutorLink to='dashboard' params={courseId: course.id}>
            <CourseBranding isConceptCoach={course.is_concept_coach or false} />
            <p className='course-listing-item-term'>{course.term} {course.year}</p>
          </TutorLink>
          {<@Controls /> if controls?}
        </div>
      </div>
    </div>

CourseTeacher = React.createClass
  displayName: 'CourseTeacher'
  propTypes:
    _.omit(Course.propTypes, 'controls')
  render: ->
    {course} = @props
    link =
      <TutorLink
        to='createNewCourse'
        params={sourceId: course.id}
        className='btn btn-default btn-sm'
      >Teach Again</TutorLink>

    @props.connectDragSource(
      <div className={classnames('course-teacher', 'is-dragging': @props.isDragging)}>
        <Course {...@props} controls={link} />
      </div>
    )


module.exports = {
  Course,
  CoursePropType,
  CourseTeacher: DnD.wrapCourseDragComponent(CourseTeacher)
}
