React = require 'react'
classnames = require 'classnames'
BS = require 'react-bootstrap'
_ = require 'lodash'

{Redirect, Link} = require 'react-router'

Router = require '../../helpers/router'

BRAND = 'Openstax'

getCourseNameSegments = (course, courseSubject) ->
  courseRegex = new RegExp(courseSubject, 'i')
  courseNameMatches = courseRegex.exec(course.name)
  if courseSubject and courseNameMatches
    {index} = courseNameMatches

    before = course.name.substring(0, index)
    after = course.name.substring(index + courseSubject.length)

    [before, courseSubject, after]
  else
    [course.name]


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

  CourseName: ({coursePath}) ->
    {course, courseSubject} = @props
    courseNameSegments = getCourseNameSegments(course, courseSubject)

    <Link to={coursePath}>
      {_.map(courseNameSegments, (courseNameSegment, index) ->
        <span
          key="course-name-segment-#{index}"
          data-is-subject={courseNameSegment is courseSubject}
        >
          {"#{courseNameSegment} "}
        </span>
      )}
    </Link>

  render: ->
    {course, courseDataProps, controls, courseIsTeacher, className} = @props
    coursePath = Router.makePathname('dashboard', {courseId: course.id})

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
          <@CourseName coursePath={coursePath}/>
        </div>
        <div
          className='course-listing-item-details'
          data-has-controls={controls?}
        >
          <Link to={coursePath}>
            <CourseBranding isConceptCoach={course.is_concept_coach or false} />
            <p className='course-listing-item-term'>{course.term} {course.year}</p>
          </Link>
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
    query =
      courseId: course.id

    controls = <BS.Button
      bsSize='sm'
      href={Router.makePathname('createNewCourse', {}, {query})}
    >Teach Again</BS.Button>

    <Course {...@props} controls={controls} />

module.exports = {Course, CourseTeacher, CoursePropType}
