React = require 'react'
_ = require 'underscore'
{Exercise} = require 'openstax-react-components'

{channel, getCurrentPanel} = exercises = require './collection'
api = require '../api'
{Reactive} = require '../reactive'
apiChannelName = 'exercise'

ExerciseBase = React.createClass
  displayName: 'ExerciseBase'
  getInitialState: ->
    {item} = @props

    step: item

  componentWillReceiveProps: (nextProps) ->
    {item} = nextProps
    @setState(step: item)

  render: ->
    {step} = @state
    return null if _.isEmpty(step)

    exerciseProps =
      taskId: step.task_id
      step: step
      getCurrentPanel: getCurrentPanel

      setAnswerId: (id, answerId) ->
        step.answer_id = answerId
        eventData = change: step, data: step, status: 'saving'

        channel.emit("change.#{step.id}", eventData)
        api.channel.emit("exercise.#{step.id}.send.save", eventData)

      setFreeResponseAnswer: (id, freeResponse) ->
        step.free_response = freeResponse
        eventData = change: step, data: step, status: 'saving'

        channel.emit("change.#{step.id}", eventData)
        api.channel.emit("exercise.#{step.id}.send.save", eventData)

      onContinue: ->
        step.is_completed = true
        eventData = change: step, data: step, status: 'loading'

        channel.emit("change.#{step.id}", eventData)
        api.channel.emit("exercise.#{step.id}.send.complete", eventData)

      onStepCompleted: ->
        console.info('onStepCompleted')
        channel.emit("completed.#{step.id}")

      onNextStep: ->
        console.info('onNextStep')
        channel.emit("leave.#{step.id}")

    <Exercise {...exerciseProps} {...@props}/>

ExerciseStep = React.createClass
  displayName: 'ExerciseStep'
  render: ->
    {id} = @props

    <Reactive topic={id} store={exercises} apiChannelName={apiChannelName}>
      <ExerciseBase {...@props}/>
    </Reactive>

module.exports = {ExerciseStep, channel}
