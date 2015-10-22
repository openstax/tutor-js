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
    <Exercise {...exerciseProps}/>

Demo = React.createClass
  displayName: 'Demo'
  render: ->
    demos =
      exercise: <ExerciseDemo/>

    demos = _.map(demos, (demo, name) ->
      <BS.Row>
        <BS.Col xs={12}>
          <section className={"#{name}-demo"}>{demo}</section>
        </BS.Col>
      </BS.Row>
    )
    <BS.Grid className='demo'>
      {demos}
    </BS.Grid>

module.exports = Demo
