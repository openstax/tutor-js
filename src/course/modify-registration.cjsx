React = require 'react'

InviteCodeInput = require './invite-code-input'

Course = require './model'

Navigation = require '../navigation/model'

ModifyCourseRegistration = React.createClass
  propTypes:
    course: React.PropTypes.instanceOf(Course)

  onComplete: ->
    Navigation.channel.emit('show.panel', view: 'dashboard')

  render: ->
    <div>
      <i className='close-icon' onClick={@onComplete}/>
      <InviteCodeInput
        course={@props.course}
        title={"Leave #{@props.course.description()} for new course/period"} />
    </div>

module.exports = ModifyCourseRegistration
