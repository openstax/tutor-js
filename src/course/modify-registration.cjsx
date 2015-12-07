React = require 'react'

InviteCodeInput = require './invite-code-input'
ConfirmJoin = require './confirm-join'

User = require '../user/model'
Course = require './model'
Navigation = require '../navigation/model'

ModifyCourseRegistration = React.createClass

  propTypes:
    course: React.PropTypes.instanceOf(Course)

  # create a private copy of the course to operate on
  getInitialState: ->
    course = @props.course.clone()
    course.channel.on('change', @onCourseChange)
    {course, original: @props.course}

  componentWillUnmount: ->
    @state.course.channel.off('change', @onCourseChange)

  onCourseChange: ->
    if @state.course.isRegistered()
      # wait 1.5 secs so our success message is briefly displayed, then call onComplete
      _.delay(@onComplete, 1500)
    @forceUpdate()

  showTasks: ->
    Navigation.channel.emit('show.panel', view: 'task')

  onComplete: ->
    @state.course.persist(User)
    @showTasks()

  renderComplete: (course) ->
    <h3 className="text-center">
      You have successfully modified your registration to be {course.description()}
    </h3>

  renderCurrentStep: ->
    {course, original} = @state

    if course.isIncomplete()
      <InviteCodeInput
        course={course}
        title={"Leave #{original.description()} for new course/period"} />
    else if course.isPending()
      <ConfirmJoin course={course} optionalStudentId
        title={"Are you sure you want to switch your registration #{course.description()}?"}
      />
    else
      @renderComplete(course)

  render: ->
    <div className='-modify-registration'>
      <i className='close-icon' onClick={@showTasks}/>
      {@renderCurrentStep()}
    </div>

module.exports = ModifyCourseRegistration
