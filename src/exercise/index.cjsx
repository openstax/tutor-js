React = require 'react'
BS = require 'react-bootstrap'

{Exercise} = require 'openstax-react-components'

{ccEvents} = require '../events'

STEP_ID = '4571'
steps = {}
steps[STEP_ID] = {}


getCurrentPanel = (stepId) ->
  step = steps[stepId]
  panel = 'free-response'
  if step.correct_answer_id
    panel = 'review'
  else if step.free_response
    panel = 'multiple-choice'
  panel

getUpdatedStep = (stepId) ->
  step = steps[stepId]
  panel = getCurrentPanel(stepId)
  ccEvents.emit("exercise.#{stepId}.fetch", {data: id: stepId})

getProps = (step = {content: {questions:[{}]}}) ->

  waitingText = null

  props =
    id: STEP_ID
    taskId: '1'
    step: step
    getCurrentPanel: getCurrentPanel

    setAnswerId: (stepId, answerId) ->
      step.answer_id = answerId
      waitingText = 'Saving...'
      ccEvents.emit("exercise.#{stepId}.saveAnswer", change: step, data: id: stepId)

    setFreeResponseAnswer: (stepId, freeResponse) ->
      step.free_response = freeResponse
      waitingText = 'Saving...'
      ccEvents.emit("exercise.#{stepId}.savefreeResponse", change: step, data: id: stepId)

    onContinue: ->
      step.is_completed = true
      ccEvents.emit("exercise.#{STEP_ID}.complete", change: step, data: id: STEP_ID)

    onStepCompleted: ->
      console.info('onStepCompleted')
    onNextStep: ->
      console.info('onNextStep')
  
  props.waitingText = waitingText

  props


ExerciseDemo = React.createClass
  displayName: 'ExerciseDemo'
  getInitialState: ->
    exerciseProps: getProps()
  update: (eventData) ->
    {data} = eventData
    steps[STEP_ID] = data

    exerciseProps = getProps(data)

    @setState(exerciseProps: exerciseProps)
  componentWillMount: ->
    getUpdatedStep(STEP_ID)
    ccEvents.on("exercise.#{STEP_ID}.*.done", @update)
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
          <h1>{"#{name}"}</h1>
          <section className={"#{name}-demo"}>{demo}</section>
        </BS.Col>
      </BS.Row>
    )
    <BS.Grid className='demo'>
      {demos}
    </BS.Grid>

module.exports = Demo
