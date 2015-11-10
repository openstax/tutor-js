React = require 'react'


UserStatus = require '../user/status-mixin'
Course = require './model'
ENTER = 'Enter'

CourseStatus = React.createClass

  propTypes:
    collectionUUID: React.PropTypes.string.isRequired

  mixins: [UserStatus]

  update: ->
    @forceUpdate() if @isMounted()

  startRegistration: ->
    pendingCourse = new Course(enrollment_code: @refs.input.value, book_cnx_id: @props.collectionUUID)
    pendingCourse.register()

  onKeyPress: (ev) ->
    @startRegistration() if ev.key is ENTER

  render: ->
    if @getUser().isMemberOfCourse(@props.collectionUUID)
      <span>You have joined this course, start working now!</span>
    else
      <div>
        <label>Register for course using invite code:
          <input ref='input' type="text" onKeyPress={@onKeyPress}/>
          <button onClick={@startRegistration}>+</button>
        </label>
      </div>


module.exports = CourseStatus
