React = require 'react'
ReactDOM = require 'react-dom'
BS = require 'react-bootstrap'
ENTER = 'Enter'

{CourseListing} = require './listing'
Course = require './model'
{AsyncButton, MessageList} = require 'shared'
User = require '../user/model'

EnrollmentCodeInput = React.createClass
  displayName: 'EnrollmentCodeInput'
  propTypes:
    isTeacher: React.PropTypes.bool.isRequired
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

  renderTitle: ->
    if @props.secondSemester and not @props.isTeacher
      <div class="second-semester">
        <h3 className="text-center">A New Semester, A New Enrollment Code</h3>
        <p>
          Concept Coach requires a new enrollment code each semester. If you’re
          in the second semester of a two-semester course, get the new code from your
          instructor and enter it below.
        </p>
      </div>
    else
      title = if @props.isTeacher then '' else 'Register for this Concept Coach course'
      <h3 className="text-center">{title}</h3>

  render: ->

    <div className="enrollment-code form-group row">
      {@renderCurrentCourses() if @props.currentCourses?.length}
      {@renderTitle()}
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
