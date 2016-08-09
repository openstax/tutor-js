React = require 'react'
BS = require 'react-bootstrap'
_ = require 'lodash'
EventEmitter2 = require 'eventemitter2'
classnames = require 'classnames'

{Exercise, ExerciseWithScroll} = require './exercise'
Notifications = require '../model/notifications'
URLs = require '../model/urls'
NotificationBar = require './notifications/bar'
SuretyGuard = require './surety-guard'
exerciseStub = require '../../api/exercise'
multipartExerciseStub = require '../../api/exercise-multipart'
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

ExercisePreview = require './exercise-preview'
exercisePreviewStub = require '../../api/exercise-preview/data'

Breadcrumb = require './breadcrumb'
breadcrumbStub = require '../../api/breadcrumbs/steps'

ArbitraryHtmlAndMath = require './html'
HTMLStub = require '../../api/html/data'

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

SuretyDemo = React.createClass

  getInitialState: -> triggered: false
  onConfirm: -> @setState(triggered: true)

  render: ->
    if @state.triggered
      message = 'you seem to be sure'

    <div className="surety-demo">
      <h3>{message}</h3>
      <SuretyGuard
        title={false}
        placement='right'
        message="Destroy ALL THE THINGS?"
        onConfirm={@onConfirm}
      >
        <BS.Button>
          Perform Dangerous Operation!
        </BS.Button>
      </SuretyGuard>
    </div>

ExerciseDemo = React.createClass
  displayName: 'ExerciseDemo'
  getInitialState: ->
    exerciseProps: getProps(SINGLEPART_STEP_IDS)
  getDefaultProps: ->
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
    <Exercise {...@props} {...exerciseProps} project='tutor' pinned={false}/>

MultipartExerciseDemo = React.createClass
  displayName: 'MultipartExerciseDemo'
  getInitialState: ->
    exerciseProps: getProps(MULTIPART_STEP_IDS)
  getDefaultProps: ->
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
    {goToStep, onPartEnter, onPartLeave} = @props

    <ExerciseWithScroll
      {...exerciseProps}
      project='concept-coach'
      goToStep={goToStep}
      currentStep={currentStep}
      pinned={false}
    />

ExercisePreviewDemo = React.createClass
  displayName: 'ExercisePreviewDemo'
  getInitialState: ->
    isSelected: false
    toggles:
      feedback:    false
      interactive: false
      tags:        false
      formats:     false
      height:      false

  onToggle: (ev) ->
    toggles = @state.toggles
    toggles[ev.target.name] = ev.target.checked
    @setState({toggles})

  onSelection: ->
    @setState(isSelected: not @state.isSelected)

  onDetailsClick: (ev, exercise) ->
    console.warn "Exercise details was clicked"

  render: ->
    <ExercisePreview exercise={exercisePreviewStub}
      onSelection={@onSelection}
      onDetailsClick={@onDetailsClick}
      isSelected={@state.isSelected}
      isInteractive={@state.toggles.interactive}
      displayFormats={@state.toggles.formats}
      displayAllTags={@state.toggles.tags}
      displayFeedback={@state.toggles.feedback}
      isVerticallyTruncated={@state.toggles.truncated}
    >
      <label>
        <input type="checkbox"
          onChange={@onToggle} name='interactive'
          checked={@state.toggles.interactive}
        /> Interactive
      </label>

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
      accounts_api_url:     'http://localhost:2999/api'
      tutor_api_url:        'http://localhost:3001/api'
      accounts_profile_url: 'http://localhost:2999/profile'
    )
    Notifications.startPolling()

  showMessage: ->
    Notifications.display(
      message: @refs.message.getDOMNode().value,
      level: @refs.type.getDOMNode().value
    )

  render: ->
    <div className="notices">
      <NotificationBar />
      <div className="test-message">
        <span>Test Message:</span>
        <input type="text" ref="message" />
        <select ref="type">
          <option value="success">Success</option>
          <option value="notice" selected>Notice</option>
          <option value="alert">Alert</option>
          <option value="error">Error</option>
        </select>
        <button onClick={@showMessage}>Display</button>
      </div>
      <button onClick={@startPoll}>Start Polling</button>
    </div>

Demo = React.createClass
  displayName: 'Demo'
  render: ->
    demos =
      exercisePreview: <ExercisePreviewDemo/>
      notices: <NoticesDemo />
      multipartExercise: <MultipartExerciseDemo/>
      exercise: <ExerciseDemo/>
      surety: <SuretyDemo/>
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
    <BS.Grid className='demos openstax'>
      {demos}
    </BS.Grid>

module.exports = Demo
