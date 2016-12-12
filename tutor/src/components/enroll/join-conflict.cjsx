React = require 'react'

{CourseEnrollmentActions, CourseEnrollmentStore} = require '../../flux/course-enrollment'
{CcJoinConflict} = require 'shared'

JoinConflict = React.createClass

  render: ->
    <CcJoinConflict
      courseEnrollmentActions={CourseEnrollmentActions}
      courseEnrollmentStore={CourseEnrollmentStore}
    />


module.exports = JoinConflict
