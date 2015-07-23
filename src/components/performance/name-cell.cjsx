React    = require 'react'
Router = require 'react-router'

module.exports = React.createClass
  displayName: 'NameCell'

  render: ->
    <Router.Link to='viewStudentTeacherGuide'
      params={roleId: @props.roleId, courseId: @props.courseId}>
      {@props.display}
    </Router.Link>
