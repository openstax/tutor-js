React = require 'react'
BS = require 'react-bootstrap'

interpolate = require 'interpolate'

CourseItem = React.createClass
  displayName: 'CourseItem'
  getDefaultProps: ->
    bookUrlPattern: '{cnxUrl}/contents/{ecosystem_book_uuid}'
  render: ->
    {course, cnxUrl, bookUrlPattern} = @props
    {ecosystem_book_uuid} = course

    category = course.catalog_offering_identifier.toLowerCase()
    link = interpolate bookUrlPattern, {cnxUrl, ecosystem_book_uuid}

    <BS.ListGroupItem
      href={link}
      className='concept-coach-course-item'
      data-category={category}>
        {course.description()}
    </BS.ListGroupItem>

module.exports = {CourseItem}
