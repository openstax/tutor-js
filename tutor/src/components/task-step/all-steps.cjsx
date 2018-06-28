React = require 'react'
classnames = require 'classnames'

{TaskStepStore} = require '../../flux/task-step'
{TaskStore} = require '../../flux/task'
{TaskPanelStore} = require '../../flux/task-panel'
{StepContent, ReadingStepContent} = require './step-with-reading-content'
Exercise = require './exercise'
Placeholder = require './placeholder'
{Markdown} = require 'shared'

StepMixin = require './step-mixin'
StepFooterMixin = require './step-footer-mixin'
Router = require '../../helpers/router'

{StepPanel} = require '../../helpers/policies'

Reading = React.createClass
  displayName: 'Reading'
  mixins: [StepMixin]
  isContinueEnabled: -> true
  onContinue: (cb) ->
    @props.onStepCompleted().then(@props.onNextStep)

  renderBody: ->
    {id, taskId} = @props
    {courseId} = Router.currentParams()

    <ReadingStepContent
      nextStepTitle={TaskPanelStore.getNextStepTitle(taskId, id)}
      onContinue={@onContinue}
      id={id} stepType='reading' courseId={courseId}
    />

Interactive = React.createClass
  displayName: 'Interactive'
  mixins: [StepMixin]
  isContinueEnabled: -> true
  onContinue: ->
    @props.onStepCompleted().then(@props.onNextStep)
  renderBody: ->
    {id} = @props
    {courseId} = Router.currentParams()

    <ReadingStepContent id={id} stepType='interactive' courseId={courseId} />

Video = React.createClass
  displayName: 'Video'
  mixins: [StepMixin]
  isContinueEnabled: -> true
  onContinue: ->
    @props.onStepCompleted().then(@props.onNextStep)
  renderBody: ->
    {id} = @props
    {courseId} = Router.currentParams()

    <ReadingStepContent id={id} stepType='video' courseId={courseId} />

ExternalUrl = React.createClass
  displayName: 'ExternalUrl'
  mixins: [StepMixin, StepFooterMixin]
  hideContinueButton: -> true
  onContinue: ->
    {id, taskId, onStepCompleted} = @props
    onStepCompleted() if StepPanel.canContinue(id) and not TaskStore.isDeleted(taskId)

  getUrl: ->
    {id} = @props
    {external_url} = TaskStepStore.get(id)
    unless /^https?:\/\//.test(external_url)
      external_url = "http://#{external_url}"

    external_url

  # Disable right-click context menu on link.
  # If someone selects "open in new tab" from the menu,
  # we are unable to mark the step as completed
  onContextMenu: (ev) ->
    ev.preventDefault()

  renderBody: ->
    {taskId} = @props
    {description, title} = TaskStore.get(taskId)
    external_url = @getUrl()

    descriptionHTML = <Markdown text={description}/> if description? and description.length > 0

    <div className='external-step'>
      <h1>
        <a href={external_url}
          target='_blank'
          onContextMenu={@onContextMenu}
          onClick={@onContinue}>{title}</a>
      </h1>
      {descriptionHTML}
    </div>

module.exports = {Reading, Interactive, Video, Exercise, Placeholder, ExternalUrl}
