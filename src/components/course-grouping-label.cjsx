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
    {is_concept_coach} = CourseStore.get(@props.courseId)
    name = if is_concept_coach then @section() else @period()
    if @props.plural then name += 's'
    <span>{name}</span>

module.exports = CourseGroupingLabel
