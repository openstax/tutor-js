React = require 'react'
_ = require 'underscore'

CourseNameBase = React.createClass
  displayName: 'CourseNameBase'
  getDefaultProps: ->
    course: {}
  render: ->
    {course} = @props

    <span className='concept-coach-course-name'>
      {course.description?()}
    </span>

module.exports = {CourseNameBase}
