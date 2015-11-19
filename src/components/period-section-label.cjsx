React = require 'react'

{CourseStore}   = require '../flux/course'

PeriodSectionLabel = React.createClass

  propTypes:
    courseId: React.PropTypes.string.isRequired
    plural: React.PropTypes.bool

  render: ->
    {is_concept_coach} = CourseStore.get(@props.courseId)
    name = if is_concept_coach then 'Section' else 'Period'
    if @props.plural then name += 's'
    <span>{name}</span>

module.exports = PeriodSectionLabel
