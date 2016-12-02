React = require 'react'
{CourseEnrollmentStore} = require '../../flux/course-enrollment'

ErrorList = React.createClass

  render: ->
    return null unless CourseEnrollmentStore.hasErrors()
    <div className="alert alert-danger">
      <ul className="errors">
        {for msg, i in CourseEnrollmentStore.errorMessages()
          <li key={i}>{msg}</li>}
      </ul>
    </div>


module.exports = ErrorList
