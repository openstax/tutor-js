React = require 'react'
_ = require 'underscore'

api = require '../../api'
{TaskStepStore} = require '../../flux/task-step'
{TaskStore} = require '../../flux/task'
ArbitraryHtmlAndMath = require '../html'
Exercise = require './exercise'
Markdown = require '../markdown'
StepMixin = require './step-mixin'
StepFooterMixin = require './step-footer-mixin'
{BookContentMixin, LinkContentMixin} = require '../book-content-mixin'
CourseDataMixin = require '../course-data-mixin'
ChapterSectionMixin = require '../chapter-section-mixin'

{StepPanel} = require '../../helpers/policies'

# React swallows thrown errors so log them first
err = (msgs...) ->
  console.error(msgs...)
  throw new Error(JSON.stringify(msgs...))

# TODO make this logic more failsafe
getCnxId = (id) ->
  {content_url} = TaskStepStore.get(id)
  if content_url.search('contents/') > -1
    cnxId = _.last(content_url.split('contents/'))
  cnxId

Reading = React.createClass
  displayName: 'Reading'
  mixins: [StepMixin, StepFooterMixin, BookContentMixin, CourseDataMixin]
  contextTypes:
    router: React.PropTypes.func
  isContinueEnabled: -> true
  # used by BookContentMixin
  shouldOpenNewTab: -> true
  onContinue: ->
    @props.onStepCompleted()
    @props.onNextStep()

  getSplashTitle: ->
    TaskStepStore.get(@props.id)?.title or ''

  getCnxId: ->
    getCnxId(@props.id)

  renderBody: ->
    {id} = @props
    {content_html} = TaskStepStore.get(id)
    courseDataProps = @getCourseDataProps()

    <ArbitraryHtmlAndMath
      {...courseDataProps}
      className='reading-step'
      html={content_html} />


Interactive = React.createClass
  displayName: 'Interactive'
  mixins: [StepMixin, StepFooterMixin, LinkContentMixin]
  getCnxId: ->
    getCnxId(@props.id)
  # used by LinkContentMixin
  shouldOpenNewTab: -> true
  isContinueEnabled: -> true
  onContinue: ->
    @props.onStepCompleted()
    @props.onNextStep()

  renderBody: ->
    {id} = @props
    {content_html} = TaskStepStore.get(id)
    <div className='interactive-step'>
      <ArbitraryHtmlAndMath className='interactive-content' html={content_html} />
    </div>

Video = React.createClass
  displayName: 'Video'
  mixins: [StepMixin, StepFooterMixin, LinkContentMixin]
  getCnxId: ->
    getCnxId(@props.id)
  # used by LinkContentMixin
  shouldOpenNewTab: -> true
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
  displayName: 'Placeholder'
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

ExternalUrl = React.createClass
  displayName: 'ExternalUrl'
  mixins: [StepMixin, StepFooterMixin]
  hideContinueButton: -> true
  onContinue: ->
    {id, onStepCompleted} = @props
    onStepCompleted() if StepPanel.canContinue(id)
  getUrl: ->
    {id} = @props
    {external_url} = TaskStepStore.get(id)
    unless /^https?:\/\//.test(external_url)
      external_url = "http://#{external_url}"

    external_url

  renderBody: ->
    {taskId} = @props
    {description, title} = TaskStore.get(taskId)
    external_url = @getUrl()

    descriptionHTML = <Markdown text={description}/> if description? and description.length > 0

    <div className='external-step'>
      <h1>
        <a href={external_url} target='_blank' onClick={@onContinue}>{title}</a>
      </h1>
      {descriptionHTML}
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

module.exports = {Reading, Interactive, Video, Exercise, Placeholder, Spacer, ExternalUrl}
