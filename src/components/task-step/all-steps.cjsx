React = require 'react'
_ = require 'underscore'

api = require '../../api'
{TaskStepStore} = require '../../flux/task-step'
{TaskStore} = require '../../flux/task'
ArbitraryHtmlAndMath = require '../html'
Exercise = require './exercise'
Pluralize = require '../pluralize'
StepMixin = require './step-mixin'
# React swallows thrown errors so log them first
err = (msgs...) ->
  console.error(msgs...)
  throw new Error(JSON.stringify(msgs...))

Reading = React.createClass
  displayName: "Reading"
  mixins: [StepMixin]
  isContinueEnabled: -> true
  onContinue: ->
    @props.onStepCompleted()
    @props.onNextStep()

  renderBody: ->
    {id} = @props
    {content_html} = TaskStepStore.get(id)
    <ArbitraryHtmlAndMath className='reading-step' html={content_html} />

  componentDidMount:  ->
    @insertOverlays()
    @detectImgAspectRatio()

  componentDidUpdate: ->
    @insertOverlays()
    @detectImgAspectRatio()

  insertOverlays: ->
    root = @getDOMNode()
    {title} = TaskStepStore.get(@props.id)
    for img in root.querySelectorAll('.splash img')
      continue if img.parentElement.querySelector('.ui-overlay')
      overlay = document.createElement('div')
      # don't apply overlay twice or if cnx content already includes it
      continue if img.parentElement.querySelector('.tutor-ui-overlay')
      # Prefix the class to distinguish it from a class in the original HTML content
      overlay.className = 'tutor-ui-overlay'
      overlay.innerHTML = title
      img.parentElement.appendChild(overlay)

  detectImgAspectRatio: ->
    root = @getDOMNode()
    for img in root.querySelectorAll('img')
      # Wait until an image loads before trying to detect its dimensions
      img.onload = ->
        if @width > @height
          @parentNode.classList.add('tutor-ui-horizontal-img')
        else
          @parentNode.classList.add('tutor-ui-vertical-img')


Interactive = React.createClass
  displayName: "Interactive"
  mixins: [StepMixin]
  isContinueEnabled: -> true
  onContinue: ->
    @props.onStepCompleted()
    @props.onNextStep()

  renderBody: ->
    {id} = @props
    {content_url} = TaskStepStore.get(id)
    <div className="interactive">
      <iframe ref="iframe" src={content_url}/>
    </div>

Video = React.createClass
  displayName: "Video"
  mixins: [StepMixin]
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
  mixins: [StepMixin]
  isContinueEnabled: -> 
    {review} = @props
    not review
  onContinue: ->
    @props.onNextStep()
  renderBody: ->
    {taskId} = @props
    coreStepsIndexes = TaskStore.getIncompleteCoreStepsIndexes(taskId)
    coreStepLabels = _.map coreStepsIndexes, (index) ->
      index + 1

    coreStepRange = coreStepLabels.join(' - ')

    <div className='placeholder-step'>
      <h2>This question depends on <Pluralize
        items={coreStepLabels}>question</Pluralize> {coreStepRange}.</h2>
      <p>Please complete <Pluralize
        items={coreStepLabels}>it</Pluralize> before this question.</p>
    </div>

Spacer = React.createClass
  mixins: [StepMixin]
  isContinueEnabled: -> true
  onContinue: ->
    @props.onNextStep()
  renderBody: ->
    <div className='spacer-step'>
      <h1>Concept Coach</h1>
      <p>Reinforce what you have learned in this reading and prior readings.</p>
    </div>

module.exports = {Reading, Interactive, Video, Exercise, Placeholder, Spacer}
