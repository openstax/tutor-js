React = require 'react'
ReactDOM = require 'react-dom'
BS = require 'react-bootstrap'
ENTER = 'Enter'

Course = require './model'
{AsyncButton, MessageList} = require 'shared'
User = require '../user/model'
Navigation = require '../navigation/model'


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

  isSecondSemester: ->
    @props.secondSemester and not @props.isTeacher

  renderTitle: ->
    if @isSecondSemester()
      <div className="second-semester">
        <h3 className="text-center">A New Semester, A New Enrollment Code</h3>
        <p>
          Concept Coach requires a new enrollment code each semester.
          If you’re in the second semester of a two-semester course,
          get the new code from your instructor and enter it below.
        </p>
      </div>
    else
      title = if @props.isTeacher then '' else 'Register for this Concept Coach course'
      <h3 className="text-center">{title}</h3>

  renderPastCourseLink: ->
    return null unless @isSecondSemester()
    <BS.Button bsStyle='link' className="past-course" onClick={@returnToPastCourse}>
      Return to my past Concept Coach course
    </BS.Button>

  returnToPastCourse: ->
    Navigation.channel.emit('show.panel', view: 'task')

  render: ->

    <div className="enrollment-code form-group row">
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
        {@renderPastCourseLink()}
      </div>
    </div>

module.exports = EnrollmentCodeInput
