React = require 'react'
BS = require 'react-bootstrap'
_ = require 'underscore'

{CourseItem} = require './item'

CourseListing = React.createClass
  displayName: 'CourseListing'
  getDefaultProps: ->
    disabled: false
  render: ->
    {courses} = @props
    listedCourses = _.map courses, (course) ->
      <CourseItem
        key="course-#{course.id}"
        course={course}/>

    <BS.ListGroup className='concept-coach-courses-listing'>
      {listedCourses}
    </BS.ListGroup>

module.exports = {CourseListing}
