React = require 'react'

{Task} = require '../task'
UserStatus = require '../user/status'
{ExerciseStep} = require '../exercise'

{channel} = require './model'

ConceptCoach = React.createClass
  displayName: 'ConceptCoach'
  componentDidMount: ->
    channel.emit('coach.mount.success')

  render: ->
    <div className='concept-coach'>
      <UserStatus />
      <Task {...@props}/>
    </div>

module.exports = {ConceptCoach, channel}
