$ = require 'jquery'
React = require 'react'

api = require '../api'
{AnswerStore} = require '../flux/answer'
{Exercise} = require './exercise'


# React swallows thrown errors so log them first
err = (msgs...) ->
  console.error(msgs...)
  throw new Error(JSON.stringify(msgs...))


module.exports =
  ReadingTask: React.createClass

    # HACK to load images from http://archive.cnx.org
    # <img src> tags are parsed **immediately** when the DOM node is created.
    # Since the HTML contains references to `/resources/...` make sure the browser
    # fetches the images from archive.cnx.org.
    #
    # But, as soon as the images are fetched, change the base back to tutor
    # so all links do not point to archive.
    changeBase: ->
      if $('base')[0]
        $('base').attr('href', 'http://archive.cnx.org')
      else
        $('body').append('<base href="http://archive.cnx.org" />')

    resetBase: ->
      $('base').attr('href', '')

    componentWillMount:  ->
      @changeBase()
      # Fetch the content HTML and store it in the state
      unless @props.task.content_html # or @state?.content_html
        resolved = (content_html) => @setState({content_html})
        rejected =                => @setState({content_html_error:true})
        api.fetchRemoteHtml(@props.task.content_url)
        .then(resolved, rejected)

    componentWillUpdate: -> @changeBase()
    componentDidMount:  -> @resetBase()
    componentDidUpdate: -> @resetBase()


    render: ->
      content_html = @props.task.content_html or @state?.content_html
      if content_html

        <div className='panel panel-default'>
          <div className='panel-heading'>
            Reading Asignment

            <span className='pull-right'>
              <a className='ui-action btn btn-primary btn-sm' target='_window' href={@props.task.content_url}>Open in new Tab</a>
            </span>
          </div>
          <div className='panel-body' dangerouslySetInnerHTML={{__html: content_html}} />
        </div>

      else if @state?.content_html_error
        <div>Error loading Reading task. Please reload the page and try again</div>

      else

        <div>Loading...</div>


  ExerciseTask: React.createClass

   render: ->
     <Exercise config={@props.task.config} />


  AssignmentTask: React.createClass
    getInitialState: ->
      # Grab the currentStep from the URL from SingleTask
      if @props.params.currentStep?
        try
          currentStep = parseInt(@props.params.currentStep) - 1
        catch e
          currentStep = 0
      else
        currentStep = 0

      stepCompletion = @getStepCompletion(@props.task.config)
      {currentStep, stepCompletion}

    componentWillMount:   -> AnswerStore.addChangeListener(@update)
    componentWillUnmount: -> AnswerStore.removeChangeListener(@update)

    nextButton: ->
      # Find the 1st unanswered Step
      stepCompletion = @getStepCompletion(@props.task.config)
      for isCompleted, i in stepCompletion
        unless isCompleted
          @setState({currentStep: i})
          break

    goToStep: (num) -> () =>
      # Curried for React
      @setState({currentStep: num})

    update: ->
      stepCompletion = @getStepCompletion(@props.task.config)
      @setState({stepCompletion})

    getStepCompletion: (taskConfig) ->
      stepCompletion = for step in taskConfig.steps
        @isExerciseCompleted(step)
      stepCompletion

    isExerciseCompleted: (exerciseConfig) ->
      isUnanswered = false
      for part in exerciseConfig.parts
        for question in part.questions
          unless AnswerStore.getAnswer(question)?
            isUnanswered = true

      !isUnanswered

    render: ->
      steps = @props.task.config.steps
      exerciseConfig = steps[@state.currentStep]

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
        nextOrComplete = <button className='btn btn-success' onClick={@completeAssignment}>Complete</button>
      else
        # Determine if the Next button should be disabled by checking if all the questions have been answered
        classes = ['btn btn-primary']
        unless @state.stepCompletion[@state.currentStep]
          classes.push('disabled')
        nextOrComplete = <button className={classes.join(' ')} onClick={@nextButton}>Next</button>

      <div className='assignment-step'>
        <div><span title='an Exercise may have multiple questions'>Steps:</span> {stepButtons}</div>
        <Exercise config={exerciseConfig} />
        {nextOrComplete}
      </div>


  InteractiveTask: React.createClass

    render: ->
      <div className='panel panel-default ui-interactive'>
        <div className='panel-heading'>
          Interactive

          <span className='pull-right'>
            <a className='ui-action btn btn-primary btn-sm' target='_window' href={@props.task.content_url}>Open in new Tab</a>
          </span>
        </div>
        <div className='panel-body'>
          <iframe src={@props.task.content_url} />
        </div>
      </div>
