React = require 'react'

{CourseEnrollmentStore} = require '../../flux/course-enrollment'
ErrorList = require './error-list'
{ConfirmJoinCourse} = require 'shared'

ConfirmJoin = React.createClass

  render: ->
    <ConfirmJoinCourse
      course={CourseEnrollmentStore}
      errorList={<ErrorList />}
    />


module.exports = ConfirmJoin
