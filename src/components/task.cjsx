$ = require 'jquery'
React = require 'react'

api = require '../api'
{AnswerStore} = require '../flux/answer'
TaskStep = require './task-step'
Breadcrumbs = require './breadcrumbs'


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

    stepCompletion = @getStepCompletion(@props.model)
    {currentStep, stepCompletion}

  componentWillMount:   -> AnswerStore.addChangeListener(@update)
  componentWillUnmount: -> AnswerStore.removeChangeListener(@update)

  nextButton: ->
    # Find the 1st unanswered Step
    stepCompletion = @getStepCompletion(@props.model)
    for isCompleted, i in stepCompletion
      unless isCompleted
        @setState({currentStep: i})
        break

  goToStep: (num) -> () =>
    # Curried for React
    @setState({currentStep: num})

  update: ->
    stepCompletion = @getStepCompletion(@props.model)
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
    steps = @props.model.steps
    stepConfig = steps[@state.currentStep]

    if steps.length > 1
      unansweredStepCount = 0
      stepButtons = for step, i in steps
        unless @state.stepCompletion[i]
          unansweredStepCount += 1

        classes = ['btn step']
        classes.push(step.type)

        title = null

        if i is @state.currentStep
          classes.push('current')
          classes.push('active')
          # classes.push('disabled')
          title = "Current Step (#{step.type})"

        if @state.stepCompletion[i]
          classes.push('completed')
          classes.push('btn-default')
          # classes.push('disabled')
          title ?= "Step Completed (#{step.type}). Click to review"

        else
          classes.push('btn-primary')
          title ?= "Click to view #{step.type}"

        <button type='button' className={classes.join(' ')} title={title} onClick={@goToStep(i)}><i className="fa fa-fw #{step.type}"></i></button>

      if unansweredStepCount is 0
        nextOrComplete = <button className='btn btn-success' onClick={@completeTask}>Complete</button>
      else
        # Determine if the Next button should be disabled by checking if all the questions have been answered
        classes = ['btn btn-primary']
        unless @props.model.steps[@state.currentStep].is_completed
          classes.push('disabled')
        nextOrComplete = <button className={classes.join(' ')} onClick={@nextButton}>Continue</button>

      <div className='task-step'>
        <Breadcrumbs model={@props.model} goToStep={@goToStep} currentStep={@state.currentStep} />
        <TaskStep model={stepConfig} />
        {nextOrComplete}
      </div>

    else

      <div className='task-step single-step'>
        <TaskStep model={stepConfig} />
        <button className='btn btn-success' onClick={@completeTask}>Complete</button>
      </div>
