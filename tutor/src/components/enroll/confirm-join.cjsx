React = require 'react'

{CourseEnrollmentActions, CourseEnrollmentStore} = require '../../flux/course-enrollment'
{ConfirmJoinCourse, ErrorList} = require 'shared'

ConfirmJoin = React.createClass

  render: ->
    <ConfirmJoinCourse
      courseEnrollmentActions={CourseEnrollmentActions}
      courseEnrollmentStore={CourseEnrollmentStore}
      errorList={<ErrorList errorMessages={CourseEnrollmentStore.errorMessages()}/>}
    />


module.exports = ConfirmJoin
