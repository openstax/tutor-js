React = require 'react'
ReactDOM = require 'react-dom'
BS = require 'react-bootstrap'
ENTER = 'Enter'

{CourseListing} = require './listing'
Course = require './model'
{AsyncButton, MessageList} = require 'shared'
User = require '../user/model'

EnrollmentCodeInput = React.createClass

  propTypes:
    title: React.PropTypes.string.isRequired
    course: React.PropTypes.instanceOf(Course).isRequired
    currentCourses: React.PropTypes.arrayOf(React.PropTypes.instanceOf(Course))

  startRegistration: ->
    @props.course.register(ReactDOM.findDOMNode(this.refs.input).value, User)

  onKeyPress: (ev) ->
    return if @props.course.isBusy # double enter
    @startRegistration() if ev.key is ENTER

  renderCurrentCourses: ->
    <div className='text-center'>
      <h3>You are not registered for this course.</h3>
      <p>Did you mean to go to one of these?</p>
      <CourseListing courses={@props.currentCourses}/>
    </div>

  render: ->

    <div className="enrollment-code form-group">
      {@renderCurrentCourses() if @props.currentCourses?.length}
      <h3 className="text-center">{@props.title}</h3>
      <hr/>
      <MessageList messages={@props.course.errorMessages()} />
      <div className="code-wrapper col-md-6 col-md-offset-3 col-sm-8 col-sm-offset-2 col-xs-12">
        <BS.FormGroup controlId="enrollment-code">
          <BS.ControlLabel>Enter the enrollment code</BS.ControlLabel>
          <BS.InputGroup>
            <BS.FormControl autoFocus
              type="text"
              ref="input"
              placeholder="enrollment code"
              onKeyPress={@onKeyPress}
            />
            <BS.InputGroup.Button>
              <AsyncButton
                className='enroll'
                isWaiting={!!@props.course.isBusy}
                waitingText={'Registering…'}
                onClick={@startRegistration}
              >
                Enroll
              </AsyncButton>
            </BS.InputGroup.Button>
          </BS.InputGroup>
        </BS.FormGroup>
      </div>
    </div>

module.exports = EnrollmentCodeInput
