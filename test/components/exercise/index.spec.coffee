{Testing, expect, sinon, _} = require 'test/helpers'

Exercise = require 'components/exercise'
STEP = require './step-data'
step = null

FREE_RESPONSE_PROPS =
  id: '1'
  taskId: '1'
  onStepCompleted: sinon.spy()
  onNextStep: sinon.spy()
  getCurrentPanel: (id) ->
    panel = 'free-response'
    if step.answer_id
      panel = 'review'
    else if step.free_response
      panel = 'multiple-choice'
    panel

  onFreeResponseChange: sinon.spy()
  setFreeResponseAnswer: sinon.spy((stepId, freeResponse) ->
    step.free_response = freeResponse
  )
  setAnswerId: sinon.spy()

  getReadingForStep: sinon.spy()
  refreshStep: sinon.spy()
  recoverFor: sinon.spy()

  review: ''
  focus: false
  courseId: '1'
  canTryAnother: false
  canReview: false
  disabled: false

resetProps = ->
  step = _.clone(STEP)
  FREE_RESPONSE_PROPS.step = step

exerciseActionsAndChecks =
  enterFreeResponse: ({dom, wrapper, element}) ->
    {textarea} = Testing.actions._fillTextarea('textarea', 'HELLO', {div: dom})
    expect(textarea.value).equals('HELLO')
    expect(FREE_RESPONSE_PROPS.onFreeResponseChange).to.have.been.calledWith('HELLO')

  continueOnFreeResponse: ({dom, wrapper, element}) ->
    Testing.actions._clickMatch('.continue', {div: dom})
    expect(FREE_RESPONSE_PROPS.setFreeResponseAnswer).to.have.been.calledWith('1', 'HELLO')
    expect(step.free_response).equals('HELLO')

  updateToMultipleChoice: ({dom, wrapper}) ->
    choices = step.content.questions[0].answers

    wrapper.setProps({})
    expect(dom.querySelector(
      '.openstax-exercise-card .exercise-multiple-choice'
    )).not.to.be.null

    expect(_.pluck(dom.querySelectorAll('.answer-content'), 'textContent')).to.deep.equal(_.pluck(choices, 'content_html'))
    expect(dom.querySelectorAll('.answer-input-box:not([disabled])')).to.have.length(choices.length)

describe 'Exercise Component', ->

  beforeEach ->
    resetProps()

  it 'renders with css classes', ->
    Testing.renderComponent( Exercise, props: FREE_RESPONSE_PROPS ).then ({dom}) ->
      expect(dom.querySelector(
        '.openstax-exercise-card .exercise-free-response'
      )).not.to.be.null

  it 'can fill textarea for free respone', ->
    Testing.renderComponent( Exercise, props: FREE_RESPONSE_PROPS ).then (args...) ->

      exerciseActionsAndChecks.enterFreeResponse(args...)

  it 'will update step on continue from filling in free response', ->
    Testing.renderComponent( Exercise, props: FREE_RESPONSE_PROPS ).then (args...) ->

      exerciseActionsAndChecks.enterFreeResponse(args...)
      exerciseActionsAndChecks.continueOnFreeResponse(args...)

  it 'renders multiple choices after continuing from free response', ->
    Testing.renderComponent( Exercise, props: FREE_RESPONSE_PROPS ).then (args...) ->

      exerciseActionsAndChecks.enterFreeResponse(args...)
      exerciseActionsAndChecks.continueOnFreeResponse(args...)
      exerciseActionsAndChecks.updateToMultipleChoice(args...)
