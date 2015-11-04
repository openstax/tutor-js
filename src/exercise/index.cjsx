React = require 'react'
{Exercise} = require 'openstax-react-components'

{channel} = exercises = require './collection'
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
    return unless eventData.data.id is id

    exerciseProps = exercises.getProps(id)
    @setState(exerciseProps: exerciseProps)

  setWaiting: (eventData) ->
    {status, data} = eventData
    {id} = @props
    return unless data.id is id

    {exerciseProps} = @state

    exerciseProps.className = status
    exerciseProps.waitingText = getWaitingText(status)

    @setState(exerciseProps: exerciseProps)

  componentWillMount: ->
    {id} = @props

    exercises.fetch(id)
    exercises.channel.on("load.*", @update)
    api.channel.on("exercise.*.send.*", @setWaiting)

  componentWillUnmount: ->
    {id} = @props
    exercises.channel.off("load.*", @update)
    api.channel.off("exercise.*.send.*", @setWaiting)

  componentWillReceiveProps: (nextProps) ->
    {id} = @props
    exercises.fetch(nextProps.id)

  render: ->
    {exerciseProps} = @state
    <Exercise {...exerciseProps} {...@props}/>

module.exports = {ExerciseStep, channel}
