React = require 'react'

Course = require './model'
User = require '../user/model'
ENTER = 'Enter'

InviteCodeInput = require './invite-code-input'
ConfirmJoin = require './confirm-join'


NewCourseRegistration = React.createClass

  propTypes:
    collectionUUID: React.PropTypes.string.isRequired
    onComplete: React.PropTypes.func.isRequired

  componentWillMount: ->
    course = User.findOrCreateCourse(@props.collectionUUID)
    course.channel.on('change', @onCourseChange)
    @setState({course})

  componentWillUnmount: ->
    # If our course isn't fully registered then we need to remove it
    # so that other components don't attempt to use it
    @state.course.channel.off('change', @onCourseChange)
    User.removeCourse(@state.course) unless @state.course.isRegistered()

  onCourseChange: ->
    if @state.course.isRegistered()
      # wait 1.5 secs so our success message is briefly displayed, then call onComplete
      _.delay(@props.onComplete, 1500)
    @forceUpdate()

  renderComplete: (course) ->
    <h3 className="text-center">
      You have successfully joined {course.description()}
    </h3>

  renderCurrentStep: (course) ->
    if course.isIncomplete()
      <InviteCodeInput course={course}
        currentCourses={User.courses}
        title="Register for this Concept Coach course"
      />
    else if course.isPending()
      <ConfirmJoin course={course} />
    else
      @renderComplete(course)

  render: ->
    course = User.getCourse(@props.collectionUUID)
    <div className="row">
      {@renderCurrentStep(course)}
    </div>

module.exports = NewCourseRegistration
