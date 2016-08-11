React = require 'react'
_ = require 'underscore'

classnames = require 'classnames'

CourseNameBase = React.createClass
  displayName: 'CourseNameBase'
  getDefaultProps: ->
    course: {}
  render: ->
    {course, className} = @props

    classes = classnames 'concept-coach-course-name', className

    <span className={classes}>
      {course.description?()}
    </span>

module.exports = {CourseNameBase}
