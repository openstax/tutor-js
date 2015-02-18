React = require 'react/addons'
{TaskStore} = require '../flux/task'


module.exports = React.createClass
  displayName: 'Breadcrumbs'

  componentWillMount:   -> TaskStore.addChangeListener(@update)
  componentWillUnmount: -> TaskStore.removeChangeListener(@update)

  getInitialState: -> {shouldAnimate: true}

  componentDidMount: ->
    $animatedCrumb = $(@getDOMNode()).find(".breadcrumbs-enter")
    removeBreadcrumbAnimation = ->
      $animatedCrumb.removeClass("breadcrumbs-enter").removeClass("breadcrumbs-enter-active")

    animateBreadcrumb = ->
      $animatedCrumb.addClass("breadcrumbs-enter-active")

    setTimeout animateBreadcrumb, 1
    setTimeout removeBreadcrumbAnimation, 200

  componentWillReceiveProps: ->
    @setState {shouldAnimate: false}

  shouldComponentUpdate: ->
    #do not animate the bread crumb after the first time
    @state.shouldAnimate

  update: -> true

  render: ->
    steps = @props.model.steps

    # Make sure the 1st incomplete step is displayed.
    # Useful when the student clicks back to review a previous step
    # (ie the reading step)
    showedFirstIncompleteStep = false

    stepButtons = for step, i in steps
      crumbType = step.type.concat("-crumb")
      classes = ['btn step']
      classes.push(crumbType)
      title = null

      if step.id is @props.currentStep.id
        classes.push('current')
        classes.push('active')
        classes.push('btn-primary')
        # classes.push('disabled')
        title = "Current Step (#{step.type})"

      if step.is_completed
        classes.push('completed')
        if step.correct_answer_id is step.answer_id
          classes.push('btn-success')
        else
          classes.push('btn-danger')
        # classes.push('disabled')
        title ?= "Step Completed (#{step.type}). Click to review"

      else if showedFirstIncompleteStep
        continue
      else
        showedFirstIncompleteStep = true
        newBreadcrumb = step.id isnt @props.currentStep.id
        lastBreadcrumb = true

      #if shouldAnimate is true, add animation class to last breadcrumb
      animateLastBreadCrumb = lastBreadcrumb && @state.shouldAnimate
      classes.push("breadcrumbs-enter") if newBreadcrumb or animateLastBreadCrumb
      classes.push("hide") if showedFirstIncompleteStep and (step.id isnt @props.currentStep.id)

      <button type='button' key={i} className={classes.join(' ')} title={title} onClick={@props.goToStep(i)}><i className="fa fa-fw #{crumbType}"></i></button>

    <div className="panel-footer step-footer">
      <div className="steps">
        {stepButtons}
      </div>
    </div>
