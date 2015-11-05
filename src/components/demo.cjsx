React = require 'react'
BS = require 'react-bootstrap'
_ = require 'lodash'
EventEmitter2 = require 'eventemitter2'

Exercise = require './exercise'

exerciseStub = require '../../stubs/exercise'
exerciseEvents = new EventEmitter2(wildcard: true)
STEP_ID = exerciseStub['free-response'].content.questions[0].id

steps = []
steps[STEP_ID] = {}

Breadcrumb = require './breadcrumb'
breadcrumbStub = require '../../stubs/breadcrumbs/steps'

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

    crumbs.push(type: 'end', key: crumbs.length, data: {})

    breadcrumbsNoReview = _.map(crumbs, (crumb) =>
      <Breadcrumb
        crumb={crumb}
        step={crumb.data or {}}
        currentStep={currentStep}
        canReview={false}
        goToStep={@goToStep}/>
    )

    breadcrumbsReview = _.map(crumbs, (crumb) =>
      if crumb.type is 'step' and crumb.data.is_completed
        crumb.data.correct_answer_id = "3"

      <Breadcrumb
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

Demo = React.createClass
  displayName: 'Demo'
  render: ->
    demos =
      exercise: <ExerciseDemo/>
      breadcrumbs: <BreadcrumbDemo/>

    demos = _.map(demos, (demo, name) ->
      <BS.Row className='demo'>
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
