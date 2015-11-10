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
    course = @getCourse()
    course.set(enrollment_code: @refs.input.value, book_cnx_id: @props.collectionUUID)
    course.register()

  onCourseChange: -> @forceUpdate()
  componentWillUnmount: -> @course.channel.off('change', @onCourseChange) if @course
  getCourse: ->
    return @course if @course
    @course = @getUser().getCourse(@props.collectionUUID) or new Course()
    @course.channel.on('change', @onCourseChange)
    @course

  onKeyPress: (ev) ->
    @startRegistration() if ev.key is ENTER

  renderErrors: ->
    return null unless @course and @course.errors
    errors = for msg, i in @course.errorMessages()
      <li key={i}>{msg}</li>
    <ul className="errors">{errors}</ul>

  render: ->
    if @getUser().getCourse(@props.collectionUUID)
      <span>You have joined this course, start working now!</span>
    else
      <div>
        <label>Register for course using invite code:
          <input ref='input' type="text" onKeyPress={@onKeyPress}/>
          <button onClick={@startRegistration}>+</button>
        </label>
        {@renderErrors()}
      </div>


module.exports = CourseStatus
