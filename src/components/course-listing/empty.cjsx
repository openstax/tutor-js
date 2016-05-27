React = require 'react'
BS = require 'react-bootstrap'
_ = require 'underscore'


EmptyCourses = React.createClass

  render: ->
    <BS.Panel
      className='-course-list-empty'
      header='You are not a member of any courses'
    >
      <p className="lead">
        Your account is not associated with any Openstax&trade; Tutor Courses.
      </p>
      <p>
        Contact your teacher or administrator for your course's registration information.
      </p>
    </BS.Panel>


module.exports = EmptyCourses
