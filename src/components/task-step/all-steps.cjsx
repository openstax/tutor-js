$ = require 'jquery'
React = require 'react'

api = require '../../api'
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
    {content_html} = @props.model
    <ArbitraryHtmlAndMath className="reading-step" html={content_html} />

Interactive = React.createClass
  mixins: [StepMixin]
  isContinueEnabled: -> true
  onContinue: ->
    @props.onStepCompleted()
    @props.onNextStep()
  renderBody: ->
    <iframe src={@props.model.content_url} />

module.exports = {Reading, Interactive, Exercise}
