React = require 'react'
{idType} = require 'shared'
{default: Courses} = require '../models/courses-map'

CourseGroupingLabel = React.createClass
  displayName: 'CourseGroupingLabel'

  propTypes:
    courseId: idType.isRequired
    plural: React.PropTypes.bool
    lowercase: React.PropTypes.bool

  section: ->
    if @props.lowercase then 'section' else 'Section'

  period: ->
    if @props.lowercase then 'period' else 'Period'

  render: ->
    name = if Courses.get(@props.courseId)?.is_college then @section() else @period()
    if @props.plural then name += 's'
    <span>{name}</span>

module.exports = CourseGroupingLabel
