React = require 'react'
_ = require 'underscore'

api = require '../../api'
{TaskStepStore} = require '../../flux/task-step'
{TaskStore} = require '../../flux/task'
ArbitraryHtmlAndMath = require '../html'
Exercise = require './exercise'
StepMixin = require './step-mixin'
StepFooterMixin = require './step-footer-mixin'
BookContentMixin = require '../book-content-mixin'

# React swallows thrown errors so log them first
err = (msgs...) ->
  console.error(msgs...)
  throw new Error(JSON.stringify(msgs...))

Reading = React.createClass
  displayName: "Reading"
  mixins: [StepMixin, StepFooterMixin, BookContentMixin]
  isContinueEnabled: -> true
  onContinue: ->
    @props.onStepCompleted()
    @props.onNextStep()

  getSplashTitle: ->
    TaskStepStore.get(@props.id)?.title or ''

  renderBody: ->
    {id} = @props
    {content_html} = TaskStepStore.get(id)
    <ArbitraryHtmlAndMath className='reading-step' html={content_html} />


Interactive = React.createClass
  displayName: "Interactive"
  mixins: [StepMixin, StepFooterMixin]
  isContinueEnabled: -> true
  onContinue: ->
    @props.onStepCompleted()
    @props.onNextStep()

  renderBody: ->
    {id} = @props
    {content_html} = TaskStepStore.get(id)
    <div className="interactive-step">
      <ArbitraryHtmlAndMath className='interactive-content' html={content_html} />
    </div>

Video = React.createClass
  displayName: "Video"
  mixins: [StepMixin, StepFooterMixin]
  isContinueEnabled: -> true
  onContinue: ->
    @props.onStepCompleted()
    @props.onNextStep()

  renderBody: ->
    {id} = @props
    {content_html} = TaskStepStore.get(id)
    <div className='video-step'>
      <ArbitraryHtmlAndMath className='video-content' html={content_html} />
    </div>

Placeholder = React.createClass
  displayName: "Placeholder"
  mixins: [StepMixin, StepFooterMixin]
  isContinueEnabled: ->
    {review} = @props
    not review?.length
  onContinue: ->
    @props.onNextStep()
  renderBody: ->
    <div className='placeholder-step'>
      <p>This is a personalized question that will become available
        to you after you answer more homework problems in this assignment.</p>
    </div>

Spacer = React.createClass
  mixins: [StepMixin, StepFooterMixin]
  isContinueEnabled: -> true
  onContinue: ->
    @props.onNextStep()
  renderBody: ->
    <div className='spacer-step'>
      <h1>Concept Coach</h1>
      <p>Reinforce what you have learned in this reading and prior readings.</p>
    </div>

module.exports = {Reading, Interactive, Video, Exercise, Placeholder, Spacer}
