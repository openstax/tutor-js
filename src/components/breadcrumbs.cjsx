React = require 'react'
{AnswerStore} = require '../flux/answer'


module.exports = React.createClass
  displayName: 'Breadcrumbs'

  componentWillMount:   -> AnswerStore.addChangeListener(@update)
  componentWillUnmount: -> AnswerStore.removeChangeListener(@update)

  update: -> @setState({})

  render: ->
    steps = @props.model.steps

    unansweredStepCount = 0
    stepButtons = for step, i in steps
      unless step.is_completed
        unansweredStepCount += 1

      classes = ['btn step']
      classes.push(step.type)

      title = null

      if i is @props.currentStep
        classes.push('current')
        classes.push('active')
        # classes.push('disabled')
        title = "Current Step (#{step.type})"

      if step.is_completed
        classes.push('completed')
        classes.push('btn-primary')
        # classes.push('disabled')
        title ?= "Step Completed (#{step.type}). Click to review"

      else
        classes.push('btn-default')
        title ?= "Click to view #{step.type}"

      <button type='button' className={classes.join(' ')} title={title} onClick={@props.goToStep(i)}><i className="fa fa-fw #{step.type}"></i></button>

    <div className='steps btn-group'>
      {stepButtons}
    </div>
