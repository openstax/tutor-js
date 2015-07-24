React    = require 'react'
Router = require 'react-router'

module.exports = React.createClass
  displayName: 'NameCell'

  render: ->
    {courseId} = @props
    linkParams = {courseId, id: @props.task.id, stepIndex: 1}
    status = switch @props.task.status
      when 'completed'   then 'Clicked'
      when 'in_progress' then 'Viewed'
      when 'not_started' then 'Not started'
    <Router.Link to='viewTaskStep' params={linkParams}>{status}</Router.Link>
