React    = require 'react'
Router = require 'react-router'
Name = require '../name'

module.exports = React.createClass
  displayName: 'NameCell'

  propTypes:
    courseId: React.PropTypes.string.isRequired
    isConceptCoach: React.PropTypes.bool.isRequired
    student: React.PropTypes.shape(
      first_name: React.PropTypes.string
      last_name: React.PropTypes.string
    ).isRequired

  renderCCStudent: ->
    [
      <Name {...@props.student} />
      # FIXME - Student ID goes here, but BE isn't provisioning it
    ]

  renderLinkedName: ->
    <Router.Link
      className={"student-name #{@props.className}"}
      to='viewStudentTeacherPerformanceForecast'
      params={roleId: @props.roleId, courseId: @props.courseId}>
       <Name {...@props.student} />
    </Router.Link>

  render: ->
    <div className="name">
      {if @props.isConceptCoach then @renderCCStudent() else @renderLinkedName()}
    </div>
