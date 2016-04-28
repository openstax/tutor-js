React = require 'react'
BS = require 'react-bootstrap'
_ = require 'lodash'
EventEmitter2 = require 'eventemitter2'
classnames = require 'classnames'

Exercise = require './exercise'
Notifications = require '../model/notifications'
NotificationBar = require './notifications-bar'

exerciseStub = require '../../stubs/exercise'
exerciseEvents = new EventEmitter2(wildcard: true)
STEP_ID = exerciseStub['free-response'].content.questions[0].id

steps = []
steps[STEP_ID] = {}


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
  step = steps[STEP_ID]
  panel = getCurrentPanel(STEP_ID)
  steps[STEP_ID] = _.merge({}, exerciseStub[panel], step)

getProps = ->
  step = getUpdatedStep(STEP_ID)

  props =
    id: step.content.questions[0].id
    taskId: '1'
    step: step
    getCurrentPanel: getCurrentPanel
    setAnswerId: (stepId, answerId) ->
      step.answer_id = answerId
    setFreeResponseAnswer: (stepId, freeResponse) ->
      step.free_response = freeResponse
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
    exerciseProps: getProps()
  update: ->
    @setState(exerciseProps: getProps())
  componentWillMount: ->
    exerciseEvents.on('change', @update)
  componentWillUnmount: ->
    exerciseEvents.off('change', @update)
  render: ->
    {exerciseProps} = @state
    <Exercise {...exerciseProps} pinned={false}/>

ExercisePreviewDemo = React.createClass
  displayName: 'ExercisePreviewDemo'
  getInitialState: ->
    displayFeedback: false
    displayFormats:  false
    displayTags: false

  toggleFeedbackDisplay: (ev) ->
    @setState(displayFeedback: not @state.displayFeedback)

  toggleFormatsDisplay: (ev) ->
    @setState(displayFormats: not @state.displayFormats)

  toggleTagsDisplay: (ev) ->
    @setState(displayTags: not @state.TagsFormats)

  render: ->
    {displayFeedback, displayFormats, displayTags} = @state

    displayFormatsIconClasses = classnames 'fa',
      'fa-check-square-o': displayFormats
      'fa-square-o':  not displayFormats

    displayFeedbackIconClasses = classnames 'fa',
      'fa-check-square-o': displayFeedback
      'fa-square-o':  not displayFeedback

    displayTagsIconClasses = classnames 'fa',
      'fa-check-square-o': displayTags
      'fa-square-o':  not displayTags

    <ExercisePreview exercise={exercisePreviewStub}
      displayFormats={displayFormats}
      displayAllTags={displayTags}
      displayFeedback={displayFeedback}
    >
      <button className="toggle" onClick={@toggleFeedbackDisplay}>
        <i className={displayFeedbackIconClasses}/> Preview Feedback
      </button>
      <button className="toggle" onClick={@toggleTagsDisplay}>
        <i className={displayTagsIconClasses}/> Display All Tags
      </button>
      <button className="toggle" onClick={@toggleFormatsDisplay}>
        <i className={displayFormatsIconClasses}/> Show Formats
      </button>
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

  doIt: ->
    Notifications.initialize(
      base_accounts_url:    'http://localhost:2999/'
      accounts_notices_url: 'http://localhost:2999/api/notices'
      tutor_notices_url:    'http://localhost:3001/api/notifications'
      accounts_profile_url: 'http://localhost:2999/profile'
    )

  render: ->
    <div class="notices">
      <NotificationBar />
      <button onClick={@doIt}>{if @state.running then 'Start' else 'Poll'}</button>
    </div>

Demo = React.createClass
  displayName: 'Demo'
  render: ->
    demos =
      notices: <NoticesDemo />
      exercise: <ExerciseDemo/>
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
