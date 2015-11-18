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

  # update: ->
  #   @forceUpdate() if @isMounted()


  onCourseChange: ->
    if @state.course.isRegistered()
      # wait 1.5 secs so our success message is briefly displayed, then call onComplete
      _.delay(@props.onComplete, 1500)
    @forceUpdate()

  # cancelConfirmation: ->
  #   @clearCourse()

  renderSaving: ->
    <span><i className='fa fa-spinner fa-spin'/>Saving ...</span>

  # Confirmation
  startConfirmation: ->
    @getCourse().confirm(React.findDOMNode(@refs.stduentIdInput).value)
  onConfirmKeyPress: (ev) ->
    @startConfirmation() if ev.key is ENTER
  renderConfirm: (course) ->
    <div className="form-group">
      <h3 className="text-center">
        Would you like to join {course.description()}?
      </h3>
      {@renderErrors()}
      <div className="col-md-6 col-md-offset-3 col-sm-8 col-sm-offset-2 col-xs-12">
        <label className="col-sm-12">
          My Student ID is:
          <input ref='stduentIdInput' autofocus
            onKeyPress={@onConfirmKeyPress} type="text" className="form-control" />
        </label>

        <div className="text-center">
          <button className="btn"
            onClick={@cancelConfirmation}>Cancel</button>
          <button className="btn btn-success"
            style={marginLeft: '3rem'}
            onClick={@startConfirmation}>Confirm</button>
        </div>
      </div>
    </div>




  renderComplete: (course) ->
    <h3 className="text-center">
      You have successfully joined {course.description()}
    </h3>

  renderErrors: (course) ->
    return null unless course.hasErrors()
    <div className="alert alert-danger">
      <ul className="errors">
        {for msg, i in course.errorMessages()
          <li key={i}>{msg}</li>}
      </ul>
    </div>

  renderCurrentStep: (course) ->
    if course.isIncomplete()
      <InviteCodeInput course={course} />
    else if course.isPending()
      <ConfirmJoin course={course} />
    else
      @renderComplete(course)

  render: ->
    course = User.getCourse(@props.collectionUUID)
    <div className="row">
      {@renderErrors(course)}
      {@renderCurrentStep(course)}
    </div>

module.exports = NewCourseRegistration
