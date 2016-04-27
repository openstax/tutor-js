React = require 'react'
_ = require 'underscore'

Exercise = require './part'
{ExFooter} = require './controls'
{CardBody} = require '../pinned-header-footer-card/sections'
ExerciseGroup = require './group'

ExerciseParts = React.createClass
  displayName: 'ExerciseParts'

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
    props = _.omit(@props, 'part', 'canOnlyContinue', 'footer')

    <Exercise {...partProps} {...props} step={part} id={part.id} taskId={part.task_id}/>

  render: ->
    {parts, footer, getCurrentPanel, onNextStep} = @props

    if @isSinglePart()
      part = _.first(parts)

      partProps =
        footer: footer
        pinned: true
        focus: true
        includeGroup: true

      return @renderPart(part, partProps)

    exerciseParts = _.map parts, (part, index) =>
      partProps =
        pinned: false
        focus: index is 0
        includeGroup: false
        includeFooter: @shouldControl(part.id)

      # stim and stem are the same for different steps currently.
      # they should only show up once.
      unless index is 0
        part.content = _.omit(part.content, 'stimulus_html', 'stem_html')

      @renderPart(part, partProps)

    step = _.last(parts)

    exerciseGroup =
      <ExerciseGroup
        key='step-exercise-group'
        group={step.group}
        exercise_uid={step.content?.uid}
        related_content={step.related_content}/>

    if @canAllContinue()
      canContinueControlProps =
        isContinueEnabled: true
        onContinue: onNextStep

    footer ?= <ExFooter {...canContinueControlProps} {...@props} panel='review'/>

    <CardBody footer={footer} className='openstax-multipart-exercise-card'>
      {exerciseParts}
      {exerciseGroup}
    </CardBody>

module.exports = ExerciseParts
