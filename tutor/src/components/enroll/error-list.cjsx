React = require 'react'
CourseEnrollment = require './course-enrollment'

ErrorList = React.createClass

  propTypes:
    courseEnrollment: React.PropTypes.instanceOf(CourseEnrollment).isRequired

  render: ->
    return null unless @props.courseEnrollment.hasErrors()
    <div className="alert alert-danger">
      <ul className="errors">
        {for msg, i in @props.courseEnrollment.errorMessages()
          <li key={i}>{msg}</li>}
      </ul>
    </div>


module.exports = ErrorList
