$ = require 'jquery'
React = require 'react'

api = require '../api'
Exercise = require './exercise-multiple-choice'
ArbitraryHtmlAndMath = require './html'
StepMixin = require './step-mixin'

# React swallows thrown errors so log them first
err = (msgs...) ->
  console.error(msgs...)
  throw new Error(JSON.stringify(msgs...))


Reading = React.createClass
  mixins: [StepMixin]
  isEnabled: -> true
  onSaveAndContinue: -> @props.onComplete()
  renderBody: ->
    {content_html} = @props.model
    <ArbitraryHtmlAndMath html={content_html} />

Interactive = React.createClass
  mixins: [StepMixin]
  isEnabled: -> true
  onSaveAndContinue: -> @props.onComplete()

  renderBody: ->
    <iframe src={@props.model.content_url} />

module.exports = {Reading, Interactive, Exercise}
