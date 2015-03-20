React = require 'react'

api = require '../../api'
{TaskStepStore} = require '../../flux/task-step'
ArbitraryHtmlAndMath = require '../html'
Exercise = require './exercise-multiple-choice'
StepMixin = require './step-mixin'

# React swallows thrown errors so log them first
err = (msgs...) ->
  console.error(msgs...)
  throw new Error(JSON.stringify(msgs...))


Reading = React.createClass
  mixins: [StepMixin]
  isContinueEnabled: -> true
  onContinue: ->
    @props.onStepCompleted()
    @props.onNextStep()
  renderBody: ->
    {id} = @props
    {content_html} = TaskStepStore.get(id)
    <ArbitraryHtmlAndMath className="reading-step" html={content_html} />

Interactive = React.createClass
  mixins: [StepMixin]
  isContinueEnabled: -> true
  onContinue: ->
    @props.onStepCompleted()
    @props.onNextStep()
  renderBody: ->
    {id} = @props
    {content_url} = TaskStepStore.get(id)
    <iframe src={content_url} />

Video = React.createClass
  mixins: [StepMixin]
  isContinueEnabled: -> true
  onContinue: ->
    @props.onStepCompleted()
    @props.onNextStep()
  renderBody: ->
    {id} = @props
    {content_html, content_url} = TaskStepStore.get(id)
    <ArbitraryHtmlAndMath className="-video-content" html={content_html} />
    <a target="_top" src={content_url} />

module.exports = {Reading, Interactive, Video, Exercise}
