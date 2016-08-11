React = require 'react'

{CourseStore}   = require '../flux/course'

CourseGroupingLabel = React.createClass

  propTypes:
    courseId: React.PropTypes.string.isRequired
    plural: React.PropTypes.bool
    lowercase: React.PropTypes.bool

  section: ->
    if @props.lowercase then 'section' else 'Section'

  period: ->
    if @props.lowercase then 'period' else 'Period'

  render: ->
    name = if CourseStore.isCollege(@props.courseId) then @section() else @period()
    if @props.plural then name += 's'
    <span>{name}</span>

module.exports = CourseGroupingLabel
