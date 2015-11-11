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
    course.set(ecosystem_book_uuid: @props.collectionUUID)
    course.register(React.findDOMNode(@refs.input).value)

  startConfirmation: ->
    @getCourse().confirm()

  onCourseChange: -> @forceUpdate()
  componentWillUnmount: -> @course.channel.off('change', @onCourseChange) if @course
  getCourse: ->
    return @course if @course
    @course = @getUser().findOrCreateCourse(@props.collectionUUID)
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
    course = @getUser().getCourse(@props.collectionUUID)
    if course
      if course.isIncomplete()
        <span><i className='fa fa-spinner fa-spin'/>Joining ...</span>
      else if course.isPending()
        <span>
          Would you like to join {course.description()}?
          <button onClick={@startConfirmation}>Confirm</button>
        </span>
      else
        <span>You have joined {course.description()}, start working now!</span>
    else
      <div>
        <label>Register for course using invite code:
          <input ref='input' type="text" onKeyPress={@onKeyPress}/>
          <button onClick={@startRegistration}>+</button>
        </label>
        {@renderErrors()}
      </div>


module.exports = CourseStatus
