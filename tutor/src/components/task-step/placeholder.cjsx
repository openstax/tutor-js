React = require 'react'
classnames = require 'classnames'

{TaskStepStore} = require '../../flux/task-step'
{TaskStore} = require '../../flux/task'

Icon = require '../icon'
{ChapterSectionMixin, CardBody, ExerciseGroup, ExControlButtons} = require 'shared'

StepFooter = require './step-footer'

Placeholder = React.createClass
  displayName: 'Placeholder'
  propTypes:
    id: React.PropTypes.string.isRequired
    taskId: React.PropTypes.string.isRequired
    courseId: React.PropTypes.string.isRequired
    onNextStep: React.PropTypes.func.isRequired
  onContinue: ->
    @props.onNextStep()
  render: ->
    {id, taskId, courseId} = @props
    {type} = TaskStore.get(taskId)
    step = TaskStepStore.get(id)
    exists = TaskStepStore.shouldExist(id)
    isLoading = TaskStepStore.isLoadingPersonalized(id)

    message = if exists
      if isLoading
        "Your personalized questions are loading.  Please wait."
      else
        "Unlock this personalized question by answering more #{type} problems for this assignment."
    else
      "Looks like we don't have a personalized question this time. If you've answered all the other questions, you're done!"

    classes = classnames 'task-step-personalized',
      'task-step-personalized-missing': not exists

    controlButtons = <ExControlButtons
      panel='review'
      controlText={'Continue'}
      onContinue={@onContinue}
      isContinueEnabled={not exists}/>

    footer = <StepFooter
      id={id}
      key='step-footer'
      taskId={taskId}
      courseId={courseId}
      controlButtons={controlButtons}
      onContinue={@onContinue}/>

    group = <ExerciseGroup
      key='step-exercise-group'
      project='tutor'
      group={step.group}
      related_content={step.related_content}/>

    <CardBody className='task-step openstax-exercise-card' pinned={true} footer={footer}>
      {group}
      <div className={classes}>
        {message}
      </div>
    </CardBody>

module.exports = Placeholder
