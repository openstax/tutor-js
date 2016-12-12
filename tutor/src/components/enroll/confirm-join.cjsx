React = require 'react'

{CourseEnrollmentActions, CourseEnrollmentStore} = require '../../flux/course-enrollment'
{ConfirmJoinCourse} = require 'shared'

ConfirmJoin = React.createClass

  render: ->
    <ConfirmJoinCourse
      courseEnrollmentActions={CourseEnrollmentActions}
      courseEnrollmentStore={CourseEnrollmentStore}
    />


module.exports = ConfirmJoin
