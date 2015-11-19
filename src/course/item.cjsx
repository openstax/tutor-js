React = require 'react'
BS = require 'react-bootstrap'

interpolate = require 'interpolate'
navigation = require '../navigation/model'

CourseItem = React.createClass
  displayName: 'CourseItem'
  getDefaultProps: ->
    bookUrlPattern: '{cnxUrl}/contents/{ecosystem_book_uuid}'
  render: ->
    {course, cnxUrl, bookUrlPattern} = @props
    {ecosystem_book_uuid} = course
    routeData = navigation.getDataByView('task')

    category = course.catalog_offering_identifier.toLowerCase()
    link = interpolate bookUrlPattern, {cnxUrl, ecosystem_book_uuid}

    <BS.ListGroupItem
      href={"#{link}#{routeData.route}"}
      className='concept-coach-course-item'
      data-category={category}>
        {course.description()}
    </BS.ListGroupItem>

module.exports = {CourseItem}
