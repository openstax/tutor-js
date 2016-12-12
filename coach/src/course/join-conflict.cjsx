React = require 'react'

Course = require './model'
{CcJoinConflict} = require 'shared'

JoinConflict = React.createClass

  propTypes:
    course: React.PropTypes.instanceOf(Course).isRequired

  render: ->
    <CcJoinConflict
      courseEnrollmentActions={@props.course}
      courseEnrollmentStore={@props.course}
    />


module.exports = JoinConflict
