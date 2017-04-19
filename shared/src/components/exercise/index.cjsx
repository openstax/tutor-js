React = require 'react'
_ = require 'underscore'
classnames = require 'classnames'
ExercisePart = require './part'
{ExFooter} = require './controls'
{CardBody} = require '../pinned-header-footer-card/sections'
ExerciseGroup = require './group'
ExerciseBadges = require('../exercise-badges').default
ExerciseIdentifierLink = require '../exercise-identifier-link'
ScrollToMixin = require '../scroll-to-mixin'

ExerciseMixin =

  propTypes:
    parts: React.PropTypes.array.isRequired
    canOnlyContinue: React.PropTypes.func
    currentStep: React.PropTypes.number

  isSinglePart: ->
    {parts} = @props
    parts.length is 1

  canAllContinue: ->
    {parts, canOnlyContinue} = @props

    _.every parts, (part) ->
      canOnlyContinue(part.id)

  shouldControl: (id) ->
    not @props.canOnlyContinue(id)

  renderPart: (part, partProps) ->
    props = _.omit(@props, 'parts', 'canOnlyContinue', 'footer', 'goToStep', 'controlButtons')

    <ExercisePart
      focus={@isSinglePart()}
      {...props}
      {...partProps}
      step={part}
      id={part.id}
      taskId={part.task_id}/>

  renderSinglePart: ->
    {parts, footer, controlButtons} = @props

    part = _.first(parts)

    partProps =
      idLink: @renderIdLink()
      focus: true
      includeGroup: true
      footer: footer
      controlButtons: controlButtons

    @renderPart(part, partProps)

  renderMultiParts: ->
    {parts, currentStep} = @props

    _.map parts, (part, index) =>
      # disable keyStep if this is not the current step
      keySet = null if part.stepIndex isnt currentStep
      partProps =
        pinned: false
        focus: part.stepIndex is currentStep
        includeGroup: false
        includeFooter: @shouldControl(part.id)
        keySet: keySet
        stepPartIndex: part.stepIndex
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
    {parts, onNextStep, currentStep, pinned} = @props
    step = _.last(parts)

    if @canAllContinue()
      canContinueControlProps =
        isContinueEnabled: true
        onContinue: _.partial onNextStep, currentStep: step.stepIndex

    footerProps = _.omit(@props, 'onContinue')
    footerProps.idLink = @renderIdLink(false) unless pinned
    <ExFooter {...canContinueControlProps} {...footerProps}
      panel='review' />

  renderIdLink: (related = true) ->
    {parts} = @props
    step = _.last(parts)

    # TODO check whether or not if related is still needed
    related_content = step.related_content if related

    if step.content?.uid
      <ExerciseIdentifierLink key='exercise-uid'
        exerciseId={step.content?.uid}
        related_content={related_content}/>


ExerciseWithScroll = React.createClass
  displayName: 'ExerciseWithScroll'
  mixins: [ExerciseMixin, ScrollToMixin]

  componentDidMount: ->
    {currentStep} = @props
    @scrollToStep(currentStep) if currentStep?

  componentWillReceiveProps: (nextProps) ->
    @scrollToStep(nextProps.currentStep) if nextProps.currentStep isnt @props.currentStep

  scrollToStep: (currentStep) ->
    stepSelector = "[data-step='#{currentStep}']"
    @scrollToSelector(stepSelector, {updateHistory: false, unlessInView: true})

  render: ->
    {parts, footer, pinned} = @props
    classes = classnames('openstax-multipart-exercise-card', {
      "deleted-homework": @props.task?.type is 'homework' and @props.task?.is_deleted
    })

    if @isSinglePart()
      @renderSinglePart()
    else
      footer ?= @renderFooter() if pinned
      <CardBody footer={footer} pinned={pinned} className={classes}>
        <ExerciseBadges isMultipart={true}/>
        {@renderGroup()}
        {@renderMultiParts()}
        {@renderIdLink(false) if pinned}
      </CardBody>


Exercise = React.createClass
  displayName: 'Exercise'
  mixins: [ExerciseMixin]
  render: ->
    {footer, pinned} = @props
    classes = classnames('openstax-multipart-exercise-card', {
      "deleted-homework": @props.task?.type is 'homework' and @props.task?.is_deleted
    })

    if @isSinglePart()
      <CardBody footer={footer}
        className={classes}>
        { @renderSinglePart() }
      </CardBody>
    else
      <CardBody pinned={pinned}
        footer={footer or @renderFooter()}
        className={classes}
      >
        <ExerciseBadges isMultipart={true}/>
        {@renderGroup()}
        {@renderMultiParts()}
        {@renderIdLink(false) if pinned}
      </CardBody>

module.exports = {Exercise, ExerciseWithScroll}
