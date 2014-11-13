$ = require 'jquery'
React = require 'react'

api = require '../api'
{AnswerStore} = require '../flux/answer'
{getStepType} = require './task-steps'


# React swallows thrown errors so log them first
err = (msgs...) ->
  console.error(msgs...)
  throw new Error(JSON.stringify(msgs...))


module.exports = React.createClass
  displayName: 'Task'
  getInitialState: ->
    # Grab the currentStep from the URL from SingleTask
    if @props.params.currentStep?
      try
        currentStep = parseInt(@props.params.currentStep) - 1
      catch e
        currentStep = 0
    else
      currentStep = 0

    stepCompletion = @getStepCompletion(@props.task)
    {currentStep, stepCompletion}

  componentWillMount:   -> AnswerStore.addChangeListener(@update)
  componentWillUnmount: -> AnswerStore.removeChangeListener(@update)

  nextButton: ->
    # Find the 1st unanswered Step
    stepCompletion = @getStepCompletion(@props.task)
    for isCompleted, i in stepCompletion
      unless isCompleted
        @setState({currentStep: i})
        break

  goToStep: (num) -> () =>
    # Curried for React
    @setState({currentStep: num})

  update: ->
    stepCompletion = @getStepCompletion(@props.task)
    @setState({stepCompletion})

  getStepCompletion: (taskConfig) ->
    stepCompletion = for step in taskConfig.steps
      @areAllStepsCompleted(step)
    stepCompletion

  areAllStepsCompleted: (stepConfig) ->
    isUnanswered = false

    # TODO: Each step should have a boolean "completed" flag so we do not have to special-case in this code
    switch stepConfig.type
      when 'exercise'
        for question in stepConfig.content.questions
          unless AnswerStore.getAnswer(question)?
            isUnanswered = true
      else
        isUnanswered = true

    !isUnanswered

  render: ->
    steps = @props.task.steps
    stepConfig = steps[@state.currentStep]
    StepType = getStepType(stepConfig)

    if steps.length > 1
      unansweredStepCount = 0
      stepButtons = for step, i in steps
        unless @state.stepCompletion[i]
          unansweredStepCount += 1

        if i is @state.currentStep
          <button type='button' className='btn btn-info step current disabled' title='current'><strong>{i + 1}</strong></button>
        else if @state.stepCompletion[i]
          <button type='button' className='btn step completed disabled' title='completed'>{i + 1}</button>
        else
          <button type='button' className='btn btn-default step' onClick={@goToStep(i)}>{i + 1}</button>

      if unansweredStepCount is 0
        nextOrComplete = <button className='btn btn-success' onClick={@completeTask}>Complete</button>
      else
        # Determine if the Next button should be disabled by checking if all the questions have been answered
        classes = ['btn btn-primary']
        unless @state.stepCompletion[@state.currentStep]
          classes.push('disabled')
        nextOrComplete = <button className={classes.join(' ')} onClick={@nextButton}>Next</button>

      <div className='task-step'>
        <div><span title='a Task may have multiple steps'>Steps:</span> {stepButtons}</div>
        <StepType config={stepConfig} />
        {nextOrComplete}
      </div>

    else

      <div className='task-step single-step'>
        <StepType config={stepConfig} />
        <button className='btn btn-success' onClick={@completeTask}>Complete</button>
      </div>
