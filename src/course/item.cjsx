React = require 'react'
BS = require 'react-bootstrap'
EventEmitter2 = require 'eventemitter2'
interpolate = require 'interpolate'
_ = require 'underscore'

navigation = require '../navigation/model'

CourseItem = React.createClass
  displayName: 'CourseItem'

  contextTypes:
    cnxUrl: React.PropTypes.string
    bookUrlPattern: React.PropTypes.string
    navigator: React.PropTypes.instanceOf(EventEmitter2)
    close: React.PropTypes.func

  broadcastNav: (link) ->
    {course} = @props
    {close, cnxUrl, bookUrlPattern, navigator} = @context
    {ecosystem_book_uuid} = course
    link = interpolate bookUrlPattern, {cnxUrl, ecosystem_book_uuid}
    routeData = navigation.getDataByView('task')
    link = "#{link}#{routeData.route}"

    close()
    navigator.emit('close.for.book', {collectionUUID: ecosystem_book_uuid, link})

  render: ->
    {course} = @props
    return null unless course.isRegistered()

    category = course.catalog_offering_identifier?.toLowerCase() or 'unknown'

    <BS.ListGroupItem
      onClick={@broadcastNav}
      className='concept-coach-course-item'
      data-category={category}>
        {course.description()}
    </BS.ListGroupItem>

module.exports = {CourseItem}
