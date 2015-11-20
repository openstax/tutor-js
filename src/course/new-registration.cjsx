React = require 'react'

Course = require './model'
User = require '../user/model'
ENTER = 'Enter'

InviteCodeInput = require './invite-code-input'
ConfirmJoin = require './confirm-join'
Navigation = require '../navigation/model'

NewCourseRegistration = React.createClass

  propTypes:
    collectionUUID: React.PropTypes.string.isRequired

  componentWillMount: ->
    course = new Course({ecosystem_book_uuid: @props.collectionUUID})
    course.channel.on('change', @onCourseChange)
    @setState({course})

  componentWillUnmount: ->
    @state.course.channel.off('change', @onCourseChange)

  onComplete: ->
    @state.course.persist(User)
    Navigation.channel.emit('show.panel', view: 'task')

  onCourseChange: ->
    if @state.course.isRegistered()
      # wait 1.5 secs so our success message is briefly displayed, then call onComplete
      _.delay(@onComplete, 1500)
    @forceUpdate()

  renderComplete: (course) ->
    <h3 className="text-center">
      You have successfully joined {course.description()}
    </h3>

  renderCurrentStep: ->
    {course} = @state
    if course.isIncomplete()
      <InviteCodeInput course={course}
        currentCourses={User.courses}
        title="Register for this Concept Coach course"
      />
    else if course.isPending()
      <ConfirmJoin
        title={"Would you like to join #{@state.course.description()}?"}
        course={course} />
    else
      @renderComplete(course)

  render: ->
    <div className="-new-registration">
      {@renderCurrentStep()}
    </div>

module.exports = NewCourseRegistration
