React = require 'react'
BS = require 'react-bootstrap'
_ = require 'lodash'
EventEmitter2 = require 'eventemitter2'
classnames = require 'classnames'

Exercise = require './exercise'
Notifications = require '../model/notifications'
URLs = require '../model/urls'
NotificationBar = require './notifications/bar'

exerciseStub = require '../../stubs/exercise'
multipartExerciseStub = require '../../stubs/exercise-multipart'
exerciseEvents = new EventEmitter2(wildcard: true)
STEP_ID = exerciseStub['free-response'].id
MULTIPART_STEP_IDS = _.keys(multipartExerciseStub)
SINGLEPART_STEP_IDS = [STEP_ID]

steps = []
steps[STEP_ID] = {}
_.forEach multipartExerciseStub, (step, stepId) ->
  steps[stepId] = {}

stubForExercise = {}
stubForExercise[STEP_ID] = exerciseStub

stubsForExercises = _.extend {}, multipartExerciseStub, stubForExercise

ExercisePreview = require './exercise/preview'
exercisePreviewStub = require '../../stubs/exercise-preview/data'

Breadcrumb = require './breadcrumb'
breadcrumbStub = require '../../stubs/breadcrumbs/steps'

ArbitraryHtmlAndMath = require './html'
HTMLStub = require '../../stubs/html/data'

getCurrentPanel = (stepId) ->
  step = steps[stepId]
  panel = 'free-response'
  if step.answer_id
    panel = 'review'
  else if step.free_response
    panel = 'multiple-choice'
  panel

getUpdatedStep = (stepId) ->
  step = steps[stepId]
  panel = getCurrentPanel(stepId)
  steps[stepId] = _.merge({}, stubsForExercises[stepId][panel], step)

getProps = (stepIds) ->
  localSteps = {}

  _.forEach stepIds, (stepId) ->
    localSteps[stepId] = getUpdatedStep(stepId)

  parts = _.map stepIds, (stepId) ->
    localSteps[stepId]

  props =
    parts: parts
    canOnlyContinue: (stepId) ->
      localSteps[stepId].correct_answer_id?
    getCurrentPanel: getCurrentPanel
    setAnswerId: (stepId, answerId) ->
      localSteps[stepId].answer_id = answerId
    setFreeResponseAnswer: (stepId, freeResponse) ->
      localSteps[stepId].free_response = freeResponse
      exerciseEvents.emit('change')
    onContinue: ->
      exerciseEvents.emit('change')
    onStepCompleted: ->
      console.info('onStepCompleted')
    onNextStep: ->
      console.info('onNextStep')

ExerciseDemo = React.createClass
  displayName: 'ExerciseDemo'
  getInitialState: ->
    exerciseProps: getProps(SINGLEPART_STEP_IDS)
  getDefaultProps: ->
    setScrollState: ->
      console.info('scrolling', arguments)
      {key} = scrollState
      @setState(currentStep: key)
    goToStep: ->
      console.info('goToStep', arguments)
  update: ->
    @setState(exerciseProps: getProps(SINGLEPART_STEP_IDS))
  componentWillMount: ->
    exerciseEvents.on('change', @update)
  componentWillUnmount: ->
    exerciseEvents.off('change', @update)
  render: ->
    {exerciseProps} = @state
    <Exercise {...@props} {...exerciseProps} pinned={false}/>

MultipartExerciseDemo = React.createClass
  displayName: 'MultipartExerciseDemo'
  getInitialState: ->
    exerciseProps: getProps(MULTIPART_STEP_IDS)
  getDefaultProps: ->
    setScrollState: (scrollState) ->
      console.info('scrolling', arguments)
      {key} = scrollState
      @setState(currentStep: key)
    goToStep: ->
      console.info('goToStep', arguments)
  update: ->
    @setState(exerciseProps: getProps(MULTIPART_STEP_IDS))
  componentWillMount: ->
    exerciseEvents.on('change', @update)
  componentWillUnmount: ->
    exerciseEvents.off('change', @update)
  render: ->
    {exerciseProps, currentStep} = @state
    {setScrollState, goToStep} = @props
    <Exercise
      {...exerciseProps}
      setScrollState={setScrollState.bind(@)}
      goToStep={goToStep}
      currentStep={currentStep}
      pinned={false}
    />

ExercisePreviewDemo = React.createClass
  displayName: 'ExercisePreviewDemo'
  getInitialState: ->
    isSelected: false
    toggles:
      feedback: false
      tags:     false
      formats:  false
      height:   false

  onToggle: (ev) ->
    toggles = @state.toggles
    toggles[ev.target.name] = ev.target.checked
    @setState({toggles})

  toggleFeedbackDisplay: (ev) ->
    @setState(displayFeedback: not @state.displayFeedback)

  toggleFormatsDisplay: (ev) ->
    @setState(displayFormats: not @state.displayFormats)

  toggleTagsDisplay: (ev) ->
    @setState(displayTags: not @state.TagsFormats)

  onSelection: ->
    @setState(isSelected: not @state.isSelected)

  onDetailsClick: (ev, exercise) ->
    console.warn "Exercise details was clicked"

  render: ->


    <ExercisePreview exercise={exercisePreviewStub}
      onSelection={@onSelection}
      onDetailsClick={@onDetailsClick}
      isSelected={@state.isSelected}
      displayFormats={@state.toggles.formats}
      displayAllTags={@state.toggles.tags}
      displayFeedback={@state.toggles.feedback}
      isVerticallyTruncated={@state.toggles.truncated}
    >
      <label>
        <input type="checkbox"
          onChange={@onToggle} name='feedback'
          checked={@state.toggles.feedback}
        /> Preview Feedback
      </label>

      <label>
        <input type="checkbox"
          onChange={@onToggle} name='tags'
          checked={@state.toggles.tags}
        /> Display All Tags
      </label>

      <label>
        <input type="checkbox"
          onChange={@onToggle} name='formats'
          checked={@state.toggles.formats}
        /> Show Formats
      </label>

      <label>
        <input type="checkbox"
          onChange={@onToggle} name='truncated'
          checked={@state.toggles.truncated}
        /> Limit Height
      </label>

    </ExercisePreview>


BreadcrumbDemo = React.createClass
  displayName: 'BreadcrumbDemo'
  getInitialState: ->
    currentStep: 0

  goToStep: (stepIndex) ->
    console.info("goToStep #{stepIndex}")
    @setState(currentStep: stepIndex)

  render: ->
    {currentStep} = @state

    crumbs = _.map(breadcrumbStub.steps, (crumbStep, index) ->
      crumb =
        key: index
        data: crumbStep
        crumb: true
        type: 'step'
    )

    crumbs.push(type: 'end', key: crumbs.length + 1, data: {})

    breadcrumbsNoReview = _.map(crumbs, (crumb) =>
      <Breadcrumb
        crumb={crumb}
        key={crumb.key}
        step={crumb.data or {}}
        currentStep={currentStep}
        canReview={false}
        goToStep={@goToStep}/>
    )

    breadcrumbsReview = _.map(crumbs, (crumb, key) =>
      if crumb.type is 'step' and crumb.data.is_completed
        crumb.data.correct_answer_id = "3"

      <Breadcrumb
        key={key}
        crumb={crumb}
        step={crumb.data or {}}
        currentStep={currentStep}
        canReview={true}
        goToStep={@goToStep}/>
    )

    <div>
      <div>
        <h3>Reading, no review</h3>
        <div className='task-breadcrumbs'>
          {breadcrumbsNoReview}
        </div>
      </div>
      <div className='task-homework'>
        <h3>Homework, no review</h3>
        <div className='task-breadcrumbs'>
          {breadcrumbsNoReview}
        </div>
      </div>
      <div>
        <h3>Reading, with review</h3>
        <div className='task-breadcrumbs'>
          {breadcrumbsReview}
        </div>
      </div>
      <div className='task-homework'>
        <h3>Homework, with review</h3>
        <div className='task-breadcrumbs'>
          {breadcrumbsReview}
        </div>
      </div>
    </div>

HTMLDemo = React.createClass
  displayName: 'HTMLDemo'
  render: ->
    <ArbitraryHtmlAndMath {...HTMLStub} className='col-xs-6'/>


NoticesDemo = React.createClass
  getInitialState: -> {running: false}

  startPoll: ->
    # These will be loaded from the app's bootsrap data in normal use
    URLs.update(
      base_accounts_url:    'http://localhost:2999'
      tutor_notices_url:    'http://localhost:3001/api/notifications'
      accounts_profile_url: 'http://localhost:2999/profile'
    )
    Notifications.startPolling()

  render: ->
    <div className="notices">
      <NotificationBar />
      <button onClick={@startPoll}>Start Polling</button>
    </div>

Demo = React.createClass
  displayName: 'Demo'
  render: ->
    demos =
      exercisePreview: <ExercisePreviewDemo/>
      notices: <NoticesDemo />
      multipartExercise: <MultipartExerciseDemo/>
      exercisePreview: <ExercisePreviewDemo/>
      breadcrumbs: <BreadcrumbDemo/>
      html: <HTMLDemo/>

    demos = _.map(demos, (demo, name) ->
      <BS.Row key={name} className='demo openstax-wrapper'>
        <BS.Col xs={12}>
          <h1>{"#{name}"}</h1>
          <section className={"#{name}-demo"}>{demo}</section>
        </BS.Col>
      </BS.Row>
    )
    <BS.Grid className='demos'>
      {demos}
    </BS.Grid>

module.exports = Demo
