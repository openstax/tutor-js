React = require 'react'
_ = require 'underscore'
{Exercise, ChapterSectionMixin} = require 'openstax-react-components'

{channel, getCurrentPanel} = exercises = require './collection'
tasks = require '../task/collection'
api = require '../api'
{Reactive} = require '../reactive'
apiChannelName = 'exercise'

ExerciseBase = React.createClass
  displayName: 'ExerciseBase'
  getInitialState: ->
    @getStepState()

  mixins: [ ChapterSectionMixin ]

  getStepState: (props) ->
    props ?= @props
    {item} = props

    step: _.last(item)
    parts: item

  componentWillReceiveProps: (nextProps) ->
    nextState = @getStepState(nextProps)

    @setState(nextState)

  componentDidUpdate: (prevProps, prevState) ->
    {status} = @props
    {step} = @state

    channel.emit("component.#{status}", status: status, step: step)

  contextTypes:
    processHtmlAndMath: React.PropTypes.func

  renderHelpLink: (sections) ->
    if not sections?.length then return

    section = _.first(sections)
    <div key='task-help-links' className='task-help-links'>
      Comes from {@sectionFormat(section.chapter_section)} - {section.title}
    </div>

  render: ->
    {step} = @state
    {taskId} = @props
    return null if _.isEmpty(step)

    exerciseProps =
      project: 'concept-coach'
      taskId: step.task_id
      parts: [step]
      getCurrentPanel: getCurrentPanel
      canReview: true
      freeResponseValue: step.cachedFreeResponse
      helpLink: @renderHelpLink(step.related_content)

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

      onFreeResponseChange: (id, freeResponse) ->
        exercises.cacheFreeResponse(id, freeResponse)

      onContinue: ->
        step.is_completed = true
        eventData = change: step, data: step, status: 'loading'

        channel.emit("change.#{step.id}", eventData)
        api.channel.emit("exercise.#{step.id}.send.complete", eventData)

      onStepCompleted: ->
        channel.emit("completed.#{step.id}")

      onNextStep: ->
        channel.emit("leave.#{step.id}")

    if taskId?
      wrapperProps =
        'data-step-number': tasks.getStepIndex(taskId, step.id) + 1

    htmlAndMathProps = _.pick(@context, 'processHtmlAndMath')

    <div className='exercise-wrapper' {...wrapperProps}>
      <Exercise {...exerciseProps} {...htmlAndMathProps} {...@props}/>
    </div>

ExerciseStep = React.createClass
  displayName: 'ExerciseStep'
  render: ->
    {id} = @props

    <Reactive
      topic={id}
      store={exercises}
      apiChannelName={apiChannelName}
      getter={exercises.getAllParts}>
      <ExerciseBase {...@props}/>
    </Reactive>

module.exports = {ExerciseStep, channel}
