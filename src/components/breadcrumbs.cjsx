React = require 'react'
{TaskStore} = require '../flux/task'


module.exports = React.createClass
  displayName: 'Breadcrumbs'

  componentWillMount:   -> TaskStore.addChangeListener(@update)
  componentWillUnmount: -> TaskStore.removeChangeListener(@update)

  update: -> @setState({})

  render: ->
    steps = @props.model.steps

    # Make sure the 1st incomplete step is displayed.
    # Useful when the student clicks back to review a previous step
    # (ie the reading step)
    showedFirstIncompleteStep = false

    stepButtons = for step, i in steps

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

      else if showedFirstIncompleteStep
        continue
      else
        showedFirstIncompleteStep = true


      <button type='button' className={classes.join(' ')} title={title} onClick={@props.goToStep(i)}><i className="fa fa-fw #{step.type}"></i></button>

    <div className='steps btn-group'>
      {stepButtons}
    </div>
