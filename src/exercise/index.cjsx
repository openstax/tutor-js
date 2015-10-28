React = require 'react'
{Exercise} = require 'openstax-react-components'

exercises = require './collection'
api = require '../api'

getWaitingText = (status) ->
  "#{status}…"

ExerciseStep = React.createClass
  displayName: 'ExerciseStep'

  getInitialState: ->
    {id} = @props
    exerciseProps: exercises.getProps(id)

  update: (eventData) ->
    {id} = @props
    exerciseProps = exercises.getProps(id)
    @setState(exerciseProps: exerciseProps)

  setWaiting: ({status}) ->
    {exerciseProps} = @state

    exerciseProps.className = status
    exerciseProps.waitingText = getWaitingText(status)

    @setState(exerciseProps: exerciseProps)

  componentWillMount: ->
    {id} = @props

    exercises.fetch(id)
    exercises.channel.on("load.#{id}", @update)
    api.channel.on("exercise.#{id}.send.*", @setWaiting)

  componentWillUnmount: ->
    {id} = @props
    exercises.channel.off("load.#{id}", @update)
    api.channel.off("exercise.#{id}.send.*", @setWaiting)

  render: ->
    {exerciseProps} = @state
    <Exercise {...exerciseProps} {...@props}/>

module.exports = {ExerciseStep}
