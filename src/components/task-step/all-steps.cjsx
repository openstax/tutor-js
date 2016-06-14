React = require 'react'

{TaskStepStore} = require '../../flux/task-step'
{TaskStore} = require '../../flux/task'
{StepContent, ReadingStepContent} = require './step-with-reading-content'
Exercise = require './exercise'
Markdown = require '../markdown'
StepMixin = require './step-mixin'
StepFooterMixin = require './step-footer-mixin'
CourseDataMixin = require '../course-data-mixin'

{StepPanel} = require '../../helpers/policies'

Reading = React.createClass
  displayName: 'Reading'
  mixins: [StepMixin, CourseDataMixin]
  contextTypes:
    router: React.PropTypes.func
  isContinueEnabled: -> true
  onContinue: ->
    @props.onStepCompleted()
    @props.onNextStep()
  renderBody: ->
    {id} = @props
    courseDataProps = @getCourseDataProps()
    <ReadingStepContent id={id} stepType='reading' courseDataProps={courseDataProps}/>

Interactive = React.createClass
  displayName: 'Interactive'
  mixins: [StepMixin]
  isContinueEnabled: -> true
  onContinue: ->
    @props.onStepCompleted()
    @props.onNextStep()
  renderBody: ->
    {id} = @props
    <StepContent id={id} stepType='interactive'/>

Video = React.createClass
  displayName: 'Video'
  mixins: [StepMixin]
  isContinueEnabled: -> true
  onContinue: ->
    @props.onStepCompleted()
    @props.onNextStep()
  renderBody: ->
    {id} = @props
    <StepContent id={id} stepType='video'/>

Placeholder = React.createClass
  displayName: 'Placeholder'
  getDefaultProps: ->
    className: 'placeholder-step'
  mixins: [StepMixin, StepFooterMixin]
  isContinueEnabled: ->
    {review} = @props
    not review?.length
  onContinue: ->
    @props.onNextStep()
  renderBody: ->
    <p>This is a personalized question that will become available
      to you after you answer more homework problems in this assignment.</p>

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

module.exports = {Reading, Interactive, Video, Exercise, Placeholder, Spacer, ExternalUrl}
