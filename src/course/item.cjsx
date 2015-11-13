React = require 'react'

CourseItem = React.createClass
  displayName: 'CourseItem'
  render: ->
    {course} = @props

    category = course.catalog_offering_identifier.toLowerCase()

    <li
      className='concept-coach-course-item'
      data-category={category}>
        <h3>{course.name}</h3>
    </li>

module.exports = {CourseItem}
