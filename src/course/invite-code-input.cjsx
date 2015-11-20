React = require 'react'
BS = require 'react-bootstrap'
ENTER = 'Enter'

{CourseListing} = require './listing'
ErrorList = require './error-list'
Course = require './model'

InviteCodeInput = React.createClass

  propTypes:
    title: React.PropTypes.string.isRequired
    course: React.PropTypes.instanceOf(Course)
    currentCourses: React.PropTypes.arrayOf(React.PropTypes.instanceOf(Course))

  startRegistration: ->
    @props.course.register(@refs.input.getValue())

  onKeyPress: (ev) ->
    @startRegistration() if ev.key is ENTER

  renderCurrentCourses: ->
    <div className='text-center'>
      <h3>You are not registered for this course.</h3>
      <p>Did you mean to go to one of these?</p>
      <CourseListing
        courses={@props.currentCourses}
        cnxUrl={@props.cnxUrl}/>
    </div>

  render: ->
    button =
      <button className="btn btn-default" type="button" autoFocus
        onKeyPress={@onKeyPress}
        onClick={@startRegistration}>Register</button>

    <div className="form-group">
      {@renderCurrentCourses() if @props.currentCourses?.length}
      <h3 className="text-center">{@props.title}</h3>
      <hr/>
      <ErrorList course={@props.course} />
      <div className="col-md-6 col-md-offset-3 col-sm-8 col-sm-offset-2 col-xs-12">
        <BS.Input type="text" ref="input" label="Course invitation code"
          placeholder="Enter code" autoFocus
          onKeyPress={@onKeyPress}
          buttonAfter={button} />
      </div>
    </div>

module.exports = InviteCodeInput
