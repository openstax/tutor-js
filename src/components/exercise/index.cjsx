React = require 'react'
_ = require 'underscore'

ExercisePart = require './part'
{ExFooter} = require './controls'
{CardBody} = require '../pinned-header-footer-card/sections'
ExerciseGroup = require './group'
ExerciseBadges = require '../exercise-badges'
ExerciseIdentifierLink = require '../exercise-identifier-link'

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

    _.every parts, (part) ->
      canOnlyContinue(part.id)

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
        focus: index is currentStep
        includeGroup: false
        includeFooter: @shouldControl(part.id)
        keySet: keySet
        key: "exercise-part-#{index}"

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
      project={@props.project}
      group={step.group}
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

  renderIdLink: ->
    {parts} = @props
    step = _.last(parts)

    if step.content?.uid
      <ExerciseIdentifierLink key='exercise-uid'
        exerciseId={step.content?.uid}
        related_content={step.related_content}/>


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
      key="exercise-part-with-scroll-#{index}"
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
      <ExerciseBadges isMultipart={true}/>
      {exerciseGroup}
      {exercisePartsWithScroll}
      {@renderIdLink()}
    </CardBody>


Exercise = React.createClass
  displayName: 'Exercise'
  mixins: [ExerciseMixin]
  render: ->
    {footer} = @props

    if @isSinglePart()
      return <CardBody footer={footer} className='openstax-multipart-exercise-card'>
        { @renderSinglePart() }
        { @renderIdLink() }
      </CardBody>

    exerciseParts = @renderMultiParts()
    exerciseGroup = @renderGroup()
    footer ?= @renderFooter()

    <CardBody footer={footer} className='openstax-multipart-exercise-card'>
      <ExerciseBadges isMultipart={true}/>
      {exerciseGroup}
      {exerciseParts}
      {@renderIdLink()}
    </CardBody>

module.exports = {Exercise, ExerciseWithScroll}
