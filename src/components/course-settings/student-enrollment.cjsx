React = require 'react'
BS = require 'react-bootstrap'
_ = require 'underscore'

{CourseStore, CourseActions} = require '../../flux/course'

CCEnrollmentCode = require './cc-enrollment-code'

StudentEnrollment = React.createClass

  propTypes:
    courseId: React.PropTypes.string.isRequired
    period: React.PropTypes.object

  render: ->
    return null unless @props.period
    course = CourseStore.get(@props.courseId)
    # TODO: toggle render based on: if CourseStore.isConceptCoach(@props.courseId)
    <CCEnrollmentCode
      period={@props.period}
      bookUrl={course.webview_url}
      bookName={course.salesforce_book_name}
    />

module.exports = StudentEnrollment
