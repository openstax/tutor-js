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
    _changeBase: ->
      if $('base')[0]
        $('base').attr('href', 'http://archive.cnx.org')
      else
        $('body').append('<base href="http://archive.cnx.org" />')

    _resetBase: ->
      $('base').attr('href', '')

    componentWillMount:  ->
      @_changeBase()
      # Fetch the content HTML and store it in the state
      unless @props.task.content_html # or @state?.content_html
        resolved = (content_html) => @setState({content_html})
        rejected =                => @setState({content_html_error:true})
        api.fetchRemoteHtml(@props.task.content_url)
        .then(resolved, rejected)

    componentWillUpdate: -> @_changeBase()
    componentDidMount:  -> @_resetBase()
    componentDidUpdate: -> @_resetBase()


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

      completedSteps = []
      {currentStep, completedSteps}

    componentWillMount:   -> AnswerStore.addChangeListener(@update)
    componentWillUnmount: -> AnswerStore.removeChangeListener(@update)

    nextButton: ->
      @setState({currentStep: @state.currentStep + 1})

    update: ->
      completedSteps = []
      for step in @props.task.config.steps
        completedSteps.push(@isExerciseCompleted(step))
      @setState({completedSteps})

    isExerciseCompleted: (exerciseConfig) ->
      isUnanswered = false
      for part in exerciseConfig.parts
        for question in part.questions
          unless AnswerStore.getAnswer(question)?
            isUnanswered = true

      !isUnanswered

    render: ->
      # @props.task.config.steps
      exerciseConfig = @props.task.config.steps[@state.currentStep]

      stepTotal = @props.task.config.steps.length
      if @state.currentStep is stepTotal - 1
        nextOrComplete = <button className='btn btn-primary disabled' onClick={@completeAssignment}>Complete</button>
      else
        # Determine if the Next button should be disabled by checking if all the questions have been answered
        classes = ['btn btn-primary']
        unless @state.completedSteps[@state.currentStep]
          classes.push('disabled')
        nextOrComplete = <button className={classes.join(' ')} onClick={@nextButton}>Next</button>

      <div>
        <span>Step {@state.currentStep + 1  } of {stepTotal}</span>
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
