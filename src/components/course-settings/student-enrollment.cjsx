React = require 'react'
BS = require 'react-bootstrap'
_ = require 'underscore'

{CourseStore, CourseActions} = require '../../flux/course'

CCEnrollmentCode = require './cc-enrollment-code'
StudentEnrollmentLink = require './student-enrollment-link'

StudentEnrollment = React.createClass

  propTypes:
    courseId: React.PropTypes.string.isRequired
    period: React.PropTypes.object

  render: ->
    return null unless @props.period
    course = CourseStore.get(@props.courseId)
    if CourseStore.isConceptCoach(@props.courseId)
      <CCEnrollmentCode
        courseId={@props.courseId}
        period={@props.period}
        bookUrl={course.webview_url}
        bookName={course.salesforce_book_name}
      />
    else
      <StudentEnrollmentLink period={@props.period} />

module.exports = StudentEnrollment
