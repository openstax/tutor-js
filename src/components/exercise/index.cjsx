React = require 'react'
_ = require 'underscore'

ExercisePart = require './part'
{ExFooter} = require './controls'
{CardBody} = require '../pinned-header-footer-card/sections'
ExerciseGroup = require './group'

{ScrollListenerMixin} = require 'react-scroll-components'
{ScrollTracker, ScrollTrackerParentMixin} = require '../scroll-tracker'

ExerciseMixin =
  getLastPartId: ->
    {parts} = @props
    _.last(parts).id

  isSinglePart: ->
    {parts} = @props
    parts.length is 1

  isLastPart: (id) ->
    lastPartId = @getLastPartId()
    lastPartId is id

  canAllContinue: ->
    {parts, canOnlyContinue} = @props

    _.reduce parts, (previous, part) ->
      previous and canOnlyContinue(part.id)
    , true

  shouldControl: (id) ->
    {canOnlyContinue} = @props

    not (@isLastPart(id) and canOnlyContinue(id))

  renderPart: (part, partProps) ->
    props = _.omit(@props, 'part', 'canOnlyContinue', 'footer', 'setScrollState', 'goToStep')

    <ExercisePart
      {...partProps}
      {...props}
      step={part}
      id={part.id}
      taskId={part.task_id}/>

  renderSinglePart: ->
    {parts, footer} = @props

    part = _.first(parts)

    partProps =
      footer: footer
      pinned: true
      focus: true
      includeGroup: true

    @renderPart(part, partProps)

  renderMultiParts: ->
    {parts, currentStep} = @props

    _.map parts, (part, index) =>
      # disable keyStep if this is not the current step
      keySet = null if part.stepIndex isnt currentStep

      partProps =
        pinned: false
        focus: index is 0
        includeGroup: false
        includeFooter: @shouldControl(part.id)
        keySet: keySet

      # stim and stem are the same for different steps currently.
      # they should only show up once.
      unless index is 0
        part.content = _.omit(part.content, 'stimulus_html', 'stem_html')

      @renderPart(part, partProps)

  renderGroup: ->
    {parts} = @props
    step = _.last(parts)

    <ExerciseGroup
      key='step-exercise-group'
      group={step.group}
      exercise_uid={step.content?.uid}
      related_content={step.related_content}/>

  renderFooter: ->
    {parts, onNextStep, currentStep} = @props
    step = _.last(parts)

    if @canAllContinue()
      canContinueControlProps =
        isContinueEnabled: true
        onContinue: _.partial onNextStep, currentStep: step.stepIndex

    footerProps = _.omit(@props, 'onContinue')
    <ExFooter {...canContinueControlProps} {...footerProps} panel='review'/>


ExerciseWithScroll = React.createClass
  displayName: 'ExerciseWithScroll'
  mixins: [ScrollListenerMixin, ScrollTrackerParentMixin, ExerciseMixin]
  wrapPartWithScroll: (parts, exercisePart, index) ->
    part = parts[index]

    scrollState =
      key: part.stepIndex
      questionNumber: part.questionNumber
      id: part.id
      index: index

    <ScrollTracker
      scrollState={scrollState}
      setScrollPoint={@setScrollPoint}
      unsetScrollPoint={@unsetScrollPoint}>
      {exercisePart}
    </ScrollTracker>

  render: ->
    {parts, footer} = @props

    if @isSinglePart()
      return @renderSinglePart()

    exerciseParts = @renderMultiParts()
    exercisePartsWithScroll = _.map exerciseParts, _.partial @wrapPartWithScroll, parts
    exerciseGroup = @renderGroup()
    footer ?= @renderFooter()

    <CardBody footer={footer} className='openstax-multipart-exercise-card'>
      <label className='openstax-multipart-exercise-card-label'/>
      {exercisePartsWithScroll}
      {exerciseGroup}
    </CardBody>


Exercise = React.createClass
  displayName: 'Exercise'
  mixins: [ExerciseMixin]
  render: ->
    {footer} = @props

    if @isSinglePart()
      return @renderSinglePart()

    exerciseParts = @renderMultiParts()
    exerciseGroup = @renderGroup()
    footer ?= @renderFooter()

    <CardBody footer={footer} className='openstax-multipart-exercise-card'>
      <label className='openstax-multipart-exercise-card-label'/>
      {exerciseParts}
      {exerciseGroup}
    </CardBody>

module.exports = {Exercise, ExerciseWithScroll}
