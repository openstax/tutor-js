React = require 'react'

{CourseEnrollmentActions, CourseEnrollmentStore} = require '../../flux/course-enrollment'
ErrorList = require './error-list'
{ConfirmJoinCourse} = require 'shared'

ConfirmJoin = React.createClass

  render: ->
    <ConfirmJoinCourse
      courseEnrollmentActions={CourseEnrollmentActions}
      courseEnrollmentStore={CourseEnrollmentStore}
      errorList={<ErrorList />}
    />


module.exports = ConfirmJoin
