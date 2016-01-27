React = require 'react'
BS = require 'react-bootstrap'
EventEmitter2 = require 'eventemitter2'
interpolate = require 'interpolate'
_ = require 'underscore'

{BookLinkBase} = require '../buttons'
navigation = require '../navigation/model'

CourseItem = React.createClass
  displayName: 'CourseItem'

  contextTypes:
    cnxUrl: React.PropTypes.string
    bookUrlPattern: React.PropTypes.string

  getLink: ->
    {course} = @props
    {cnxUrl, bookUrlPattern} = @context
    {ecosystem_book_uuid} = course
    bookUrlPattern ?= ''

    link = interpolate bookUrlPattern, {cnxUrl, ecosystem_book_uuid}
    routeData = navigation.getDataByView('task')

    "#{link}#{routeData.route}"

  render: ->
    {course} = @props
    return null unless course.isRegistered()

    {ecosystem_book_uuid} = course
    link = @getLink()
    category = course.catalog_offering_identifier?.toLowerCase() or 'unknown'

    <BookLinkBase collectionUUID={ecosystem_book_uuid} link={link}>
      <BS.ListGroupItem
        className='concept-coach-course-item'
        data-category={category}>
          {course.description()}
      </BS.ListGroupItem>
    </BookLinkBase>

module.exports = {CourseItem}
