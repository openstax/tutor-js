React = require 'react'

{default: Courses} = require '../models/courses-map'
{default: CourseUX} = require '../models/course/ux'

CourseTitleBanner = React.createClass

  displayName: 'CourseTitleBanner'

  propTypes:
    courseId: React.PropTypes.string.isRequired

  render: ->
    course = Courses.get(@props.courseId)
    this.ux = new CourseUX(course)

    <div
      className="course-title-banner"
      {...this.ux.dataProps}
    >
      <div className='book-title'>
        <span className='book-title-text'>{this.ux.dataProps['data-title']}</span>
      </div>
      <div className='course-term'>
        {course.termFull}
      </div>
    </div>


module.exports = CourseTitleBanner
