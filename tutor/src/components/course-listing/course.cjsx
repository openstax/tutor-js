React = require 'react'
classnames = require 'classnames'

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
      brand = "#{BRAND} Concept Coach"

    <span
      className='course-listing-item-brand'
      data-is-beta={isBeta}
    >{brand}</span>

Course = React.createClass
  displayName: 'Course'

  render: ->
    {course, courseDataProps, controls, className} = @props
    coursePath = Router.makePathname('dashboard', {courseId: course.id})

    itemClasses = classnames('course-listing-item', className)

    <div {...courseDataProps} className={itemClasses}>
      <Link to={coursePath}>
        {course.name}
      </Link>
      <div
        className='course-listing-item-details'
        data-has-controls={controls?}
      >
        <Link to={coursePath}>
          <CourseBranding isConceptCoach={course.is_concept_coach} />
          <span className='course-listing-item-term'></span>
        </Link>
        <div className='course-listing-item-controls'>
          {controls}
        </div>
      </div>
    </div>

CoursePastTeacher = React.createClass
  displayName: 'CoursePastTeacher'
  teachAgain: ->
    {course} = @props
  render: ->
    controls = <span onClick={@teachAgain}>Teach Again</span>

    <Course {...@props} controls={controls} />

module.exports = {Course, CoursePastTeacher}
