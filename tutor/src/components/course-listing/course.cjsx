React = require 'react'
classnames = require 'classnames'
BS = require 'react-bootstrap'

{Redirect, Link} = require 'react-router'

Router = require '../../helpers/router'

BRAND = 'Openstax'

CourseBranding = React.createClass
  displayName: 'CourseBranding'
  propTypes:
    isConceptCoach: React.PropTypes.bool.isRequired
  render: ->
    {isConceptCoach} = @props

    if isConceptCoach
      isBeta = false
      brand = "#{BRAND} Concept Coach"
    else
      isBeta = true
      brand = "#{BRAND} Tutor"

    <p
      className='course-listing-item-brand'
      data-is-beta={isBeta}
    >{brand}</p>

Course = React.createClass
  displayName: 'Course'

  getCourseNameSegments: ->
    {course, courseSubject} = @props

    courseRegex = new RegExp(courseSubject, 'i')
    courseNameMatches = courseRegex.exec(course.name)
    if courseNameMatches
      {index} = courseNameMatches

      before = course.name.substring(0, index)
      after = course.name.substring(index + courseSubject.length)

      [before, courseSubject, after]
    else
      [course.name]

  Controls: ->
    {controls} = @props

    <div className='course-listing-item-controls'>
      {controls}
    </div>

  CourseName: ({coursePath}) ->
    {course, courseSubject} = @props
    courseNameSegments = @getCourseNameSegments()

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
    {course, courseDataProps, controls, className} = @props
    coursePath = Router.makePathname('dashboard', {courseId: course.id})

    itemClasses = classnames('course-listing-item', className)

    <div className='course-listing-item-wrapper'>
      <div {...courseDataProps} className={itemClasses}>
        <div
          className='course-listing-item-title'>
          <@CourseName coursePath={coursePath}/>
        </div>
        <div
          className='course-listing-item-details'
          data-has-controls={controls?}
        >
          <Link to={coursePath}>
            <CourseBranding isConceptCoach={course.is_concept_coach} />
            <p className='course-listing-item-term'>{course.term} {course.year}</p>
          </Link>
          {<@Controls /> if controls?}
        </div>
      </div>
    </div>

CourseTeacher = React.createClass
  displayName: 'CourseTeacher'
  teachAgain: ->
    {course} = @props
    # TODO do this.
  render: ->
    controls = <BS.Button bsSize='sm' onClick={@teachAgain}>Teach Again</BS.Button>

    <Course {...@props} controls={controls} />

module.exports = {Course, CourseTeacher}
