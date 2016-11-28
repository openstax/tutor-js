React = require 'react'

{CourseStore} = require '../flux/course'

CourseTitleBanner = React.createClass

  displayName: 'CourseTitleBanner'

  propTypes:
    courseId: React.PropTypes.string.isRequired

  render: ->

    dataProps =
      'data-title': CourseStore.getName(@props.courseId)
      'data-appearance': CourseStore.getAppearanceCode(@props.courseId)

    dataProps.term = CourseStore.getTerm(@props.courseId)

    <div
      className="course-title-banner"
      {...dataProps}
    >
      <div className="book-title">
        {dataProps['data-title']}
      </div>
    </div>


module.exports = CourseTitleBanner
