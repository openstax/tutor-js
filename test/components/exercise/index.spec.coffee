{Testing, expect, sinon, _} = require 'test/helpers'

Exercise = require 'components/exercise'
STEP = require './step-data'

FREE_RESPONSE_PROPS =
  id: '1'
  taskId: '1'
  onStepCompleted: sinon.spy()
  onNextStep: sinon.spy()
  getCurrentPanel: -> 'free-response'
  step: STEP

  onFreeResponseChange: sinon.spy()
  setFreeResponseAnswer: sinon.spy()
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

describe 'Exercise Component', ->

  it 'renders with css classes', ->
    Testing.renderComponent( Exercise, props: FREE_RESPONSE_PROPS ).then ({dom}) ->
      expect(dom.querySelector(
        '.openstax-exercise-card .exercise-free-response'
      )).not.to.be.null

  it 'can fill textarea for free respone', ->
    Testing.renderComponent( Exercise, props: FREE_RESPONSE_PROPS ).then ({dom, element}) ->
      {textarea} = Testing.actions._fillTextarea('textarea', 'HELLO', {div: dom})

      expect(textarea.value).equals('HELLO')
      expect(FREE_RESPONSE_PROPS.onFreeResponseChange).to.have.been.calledWith('HELLO')

      Testing.actions._clickMatch('.continue', {div: dom})
      expect(FREE_RESPONSE_PROPS.setFreeResponseAnswer).to.have.been.calledWith('1', 'HELLO')

  it 'renders multiple choices when current panel is "multiple-choice" and there is a free response', ->
    Testing.renderComponent( Exercise, props: FREE_RESPONSE_PROPS ).then ({dom, wrapper, element}) ->
      FREE_RESPONSE_PROPS.step.free_response = 'HELLO'
      FREE_RESPONSE_PROPS.getCurrentPanel = -> 'multiple-choice'
      wrapper.setProps(FREE_RESPONSE_PROPS)

      expect(dom.querySelector(
        '.openstax-exercise-card .exercise-multiple-choice'
      )).not.to.be.null
