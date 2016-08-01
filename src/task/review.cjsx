React = require 'react'
BS = require 'react-bootstrap'
_ = require 'underscore'
tasks = require './collection'

{ChapterSectionMixin} = require 'openstax-react-components'
{ExerciseStep} = require '../exercise'
{ExerciseButton, ContinueToBookButton, ReturnToBookButton} = require '../buttons'

ReviewControls = React.createClass
  displayName: 'ReviewControls'
  mixins: [ChapterSectionMixin]

  propTypes:
    moduleUUID:     React.PropTypes.string.isRequired
    collectionUUID: React.PropTypes.string.isRequired
    taskId:         React.PropTypes.string.isRequired

  render: ->
    {taskId, moduleUUID, collectionUUID} = @props

    moduleInfo = tasks.getModuleInfo(taskId)
    section = @sectionFormat(moduleInfo.chapter_section)

    <BS.ButtonGroup justified className='concept-coach-task-review-controls'>
      <ReturnToBookButton
        className='btn-lg'
        moduleUUID={moduleUUID}
        collectionUUID={collectionUUID}
        section={section}/>
      <ContinueToBookButton
        className='btn-lg'
        moduleUUID={moduleUUID}/>
    </BS.ButtonGroup>

TaskReview = React.createClass
  displayName: 'TaskReview'

  propTypes:
    moduleUUID:     React.PropTypes.string.isRequired
    collectionUUID: React.PropTypes.string.isRequired

  getInitialState: ->
    @getSteps(@props)

  componentWillMount: ->
    {collectionUUID, moduleUUID} = @props
    tasks.fetchByModule({collectionUUID, moduleUUID})

  componentWillReceiveProps: (nextProps) ->
    @setState(@getSteps(nextProps))

  getSteps: (props) ->
    {taskId} = props
    completeSteps: tasks.getCompleteSteps(taskId)
    incompleteSteps: tasks.getIncompleteSteps(taskId)

  render: ->
    {completeSteps, incompleteSteps} = @state
    {status, taskId, moduleUUID, collectionUUID} = @props

    if _.isEmpty(completeSteps)
      completeStepsReview = <div className='card-body'>
        <h3>Exercise to see Review</h3>
        <ExerciseButton onClick={_.partial(@props.goToStep, 0)}/>
      </div>
    else
      completeStepsReview = _.map completeSteps, (step) ->
        <ExerciseStep
          id={step.id}
          key={step.id}
          pinned={false}
          review='completed'
          focus={false}
          taskId={taskId}
          allowKeyNext={false}/>

    if _.isEmpty(incompleteSteps)
      completedMessage = <div className='card-body coach-coach-review-completed'>
        <h2>You're done.</h2>
        <ReviewControls
          taskId={taskId}
          moduleUUID={moduleUUID}
          collectionUUID={collectionUUID}/>
        <p>or review your work below.</p>
      </div>
      completedEnd = <div className='card-body coach-coach-review-completed'>
        <ReviewControls
          taskId={taskId}
          moduleUUID={moduleUUID}
          collectionUUID={collectionUUID}/>
      </div>

    <div className='concept-coach-task-review'>
      {completedMessage}
      {completeStepsReview}
      {completedEnd}
    </div>

module.exports = {TaskReview}
