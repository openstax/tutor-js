React = require 'react'
_ = require 'underscore'

classnames = require 'classnames'
keymaster = require 'keymaster'

ExerciseGroup = require './group'
{CardBody} = require '../pinned-header-footer-card/sections'

{ExFooter} = require './controls'
{ExMode} = require './mode'

{propTypes, props} = require './props'

CONTINUE_CHECKS =
  'free-response': 'freeResponse'
  'multiple-choice': 'answerId'
  'review': null
  'teacher-read-only': null

ON_CHANGE =
  'free-response': 'onFreeResponseChange'
  'multiple-choice': 'onAnswerChanged'
  'review': 'onChangeAnswerAttempt'
  'teacher-read-only': 'onChangeAnswerAttempt'

ExerciseStepCard = React.createClass
  displayName: 'ExerciseStepCard'
  propTypes:
    propTypes.ExerciseStepCard
  getDefaultProps: ->
    disabled: false
    isContinueEnabled: true
    allowKeyNext: false
    includeGroup: true
    includeFooter: true

  getInitialState: ->
    stepState = @getStepState(@props)

  shouldComponentUpdate: (nextProps, nextState) ->
    not (_.isEqual(@props, nextProps) and
      @props.isContinueEnabled is @isContinueEnabled(@props, @state) and
      @isContinueEnabled(@props, @state) is @isContinueEnabled(nextProps, nextState))

  componentWillReceiveProps: (nextProps) ->
    unless _.isEqual(@getStepState(@props, @state), @getStepState(nextProps))
      nextStepState = @getStepState(nextProps)
      @setState(nextStepState)

    if @props.allowKeyNext isnt nextProps.allowKeyNext
      @updateKeyBind(nextProps.allowKeyNext)

  updateKeyBind: (allowKeyNext) ->
    if allowKeyNext then @startKeys() else @clearKeys()

  startKeys: ->
    keymaster('enter', 'multiple-choice', @onContinue)
    keymaster.setScope('multiple-choice')

  clearKeys: ->
    keymaster.unbind('enter', 'multiple-choice')
    keymaster.deleteScope('multiple-choice')

  getStepState: (props, state = {}) ->
    {freeResponse} = state
    {step} = props
    freeResponse: step.free_response or step.cachedFreeResponse or freeResponse or ''
    answerId: step.answer_id or ''

  isContinueEnabled: (props, state) ->
    {panel} = props
    toCheck = CONTINUE_CHECKS[panel]
    return true unless toCheck?
    state[toCheck]?.trim().length > 0

  onAnswerChanged: (answer) ->
    @setState {answerId: answer.id}
    @props.onAnswerChanged?(answer)

  onFreeResponseChange: (freeResponse) ->
    {id} = @props

    @setState {freeResponse}
    @props.onFreeResponseChange?(id, freeResponse, @props.stepPartIndex)

  onChangeAnswerAttempt: (answer) ->
    {id} = @props

    console.log('You cannot change an answer on a problem you\'ve reviewed.', 'TODO: show warning in ui.')
    @props.onChangeAnswerAttempt?(id, answer)

  onContinue: ->
    {id, panel, canReview, onNextStep, onStepCompleted, onContinue, isContinueEnabled} = @props

    return unless isContinueEnabled and @isContinueEnabled(@props, @state)

    if onContinue?
      onContinue(@state)
      return

    if panel is 'multiple-choice'
      onStepCompleted(id)
      onNextStep(id) unless canReview

  render: ->
    {
      step,
      panel,
      pinned,
      helpLink,
      isContinueEnabled,
      waitingText,
      className,
      includeFooter,
      includeGroup,
      idLink
    } = @props

    {group, related_content} = step

    onInputChange = ON_CHANGE[panel]

    panelProps = _.omit(@props, props.notPanel)
    panelProps.choicesEnabled = not waitingText and panel is 'multiple-choice'
    panelProps[onInputChange] = @[onInputChange]

    controlProps =
      isContinueEnabled: isContinueEnabled and @isContinueEnabled(@props, @state)
      onContinue: @onContinue

    if includeFooter
      footerProps = @props
      footerProps = _.omit(footerProps, 'idLink') if pinned
      footer = <ExFooter {...footerProps} {...controlProps}/>

    if includeGroup
      exerciseGroup =
        <ExerciseGroup
          key='step-exercise-group'
          project={@props.project}
          group={group}
          exercise_uid={step.content?.uid}
          related_content={related_content}/>

    cardClasses = classnames 'task-step', 'openstax-exercise-card', className, {
      "deleted-homework": @props.task?.type is 'homework' and @props.task?.is_deleted
      "deleted-reading": @props.task?.type is 'reading' and @props.task?.is_deleted
    }


    <CardBody className={cardClasses} pinned={pinned} footer={footer}>
      <div className="exercise-#{panel}" data-step={@props.stepPartIndex}>
        {exerciseGroup}
        <ExMode
          {...step}
          {...panelProps}
          mode={panel}/>
        {idLink if pinned}
      </div>
      {helpLink}
    </CardBody>

module.exports = ExerciseStepCard
