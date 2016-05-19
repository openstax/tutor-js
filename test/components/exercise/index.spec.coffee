{Testing, expect, sinon, _, ReactTestUtils} = require 'test/helpers'

{Exercise} = require 'components/exercise'
STEP = require './step-data'
CHOICES = STEP.content.questions[0].answers

step = null
props = null

FREE_RESPONSE_PROPS =
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
  setAnswerId: sinon.spy(sinon.spy((stepId, answerId) ->
    step.answer_id = answerId
  ))

  getReadingForStep: sinon.spy()
  refreshStep: sinon.spy()
  recoverFor: sinon.spy()

  review: ''
  focus: false
  courseId: '1'
  canTryAnother: false
  canReview: true
  disabled: false

resetProps = ->
  step = _.clone(STEP)
  props = _.clone(FREE_RESPONSE_PROPS)
  props.parts = [step]

exerciseActionsAndChecks =
  enterFreeResponse: ({dom, wrapper, element}, freeResponse = 'HELLO') ->
    {textarea} = Testing.actions._fillTextarea('textarea', freeResponse, {div: dom})
    expect(textarea.value).equals(freeResponse)
    expect(props.onFreeResponseChange).to.have.been.calledWith(step.id, freeResponse)

  continueOnFreeResponse: ({dom, wrapper, element}, freeResponse = 'HELLO') ->
    Testing.actions._clickMatch('.continue', {div: dom})
    expect(props.setFreeResponseAnswer).to.have.been.calledWith(step.id, freeResponse)
    expect(step.free_response).equals(freeResponse)

    wrapper.setProps({})
    expect(dom.querySelector('.free-response').textContent).equals(freeResponse)

  updateToMultipleChoice: ({dom, wrapper}) ->
    expect(dom.querySelector(
      '.openstax-exercise-card .exercise-multiple-choice'
    )).not.to.be.null

    expect(_.pluck(dom.querySelectorAll('.answer-content'), 'textContent')).to.deep.equal(_.pluck(CHOICES, 'content_html'))
    expect(dom.querySelectorAll('.answer-input-box:not([disabled])')).to.have.length(CHOICES.length)

  pickMultipleChoice: ({dom, wrapper}) ->
    choicesDOMs = dom.querySelectorAll('.answer-input-box')
    
    FIRST_CHOICE_INDEX = 0
    SECOND_CHOICE_INDEX = 1

    Testing.actions._changeDOMNode(choicesDOMs[FIRST_CHOICE_INDEX])
    expect(_.pluck(dom.querySelectorAll('.answer-checked'), 'textContent')).to.deep.equal([CHOICES[FIRST_CHOICE_INDEX].content_html])
    expect(props.setAnswerId).to.have.been.calledWith(step.id, CHOICES[FIRST_CHOICE_INDEX].id)

    Testing.actions._changeDOMNode(choicesDOMs[SECOND_CHOICE_INDEX])
    expect(_.pluck(dom.querySelectorAll('.answer-checked'), 'textContent')).to.deep.equal([CHOICES[SECOND_CHOICE_INDEX].content_html])
    expect(props.setAnswerId).to.have.been.calledWith(step.id, CHOICES[SECOND_CHOICE_INDEX].id)

  setCorrectAnswerAndFeedback: (renderedData, choiceIndex = 0) ->
    {wrapper, dom} = renderedData

    Testing.actions._clickMatch('.continue', {div: dom}) if dom?

    step.correct_answer_id = CHOICES[choiceIndex].id
    step.feedback_html = 'The original hypothesis is incorrect.'
    wrapper?.setProps({})

  checkCorrectAnswerAndFeedback: ({dom, wrapper}, choiceIndex = 0) ->
    expect(dom.querySelector(
      '.openstax-exercise-card .exercise-review'
    )).not.to.be.null

    expect(dom.querySelector('.question-feedback').textContent).equals(step.feedback_html)
    expect(dom.querySelector('.answer-correct').textContent).equals(CHOICES[choiceIndex].content_html)
    expect(dom.querySelectorAll('.answer-input-box')).to.have.length(0)
    expect(dom.querySelector('button.continue').textContent).equals('Next Question')

  continueToNextStep: ({dom, wrapper, element}) ->
    Testing.actions._clickMatch('.continue', {div: dom})
    expect(props.onNextStep).to.have.been.called

describe 'Exercise Component', ->

  beforeEach ->
    resetProps()

  it 'renders with css classes', ->
    Testing.renderComponent( Exercise, props: props ).then ({dom}) ->
      expect(dom.querySelector(
        '.openstax-exercise-card .exercise-free-response'
      )).not.to.be.null

  it 'can fill textarea for free respone', ->
    Testing.renderComponent( Exercise, props: props ).then (args...) ->

      exerciseActionsAndChecks.enterFreeResponse(args...)

  it 'will update step on continue from filling in free response', ->
    Testing.renderComponent( Exercise, props: props ).then (args...) ->

      exerciseActionsAndChecks.enterFreeResponse(args...)
      exerciseActionsAndChecks.continueOnFreeResponse(args...)

  it 'renders multiple choices after continuing from free response', ->
    Testing.renderComponent( Exercise, props: props ).then (args...) ->

      exerciseActionsAndChecks.enterFreeResponse(args...)
      exerciseActionsAndChecks.continueOnFreeResponse(args...)
      exerciseActionsAndChecks.updateToMultipleChoice(args...)

  it 'can update the multiple choice through the interface', ->
    Testing.renderComponent( Exercise, props: props ).then (args...) ->

      exerciseActionsAndChecks.enterFreeResponse(args...)
      exerciseActionsAndChecks.continueOnFreeResponse(args...)
      exerciseActionsAndChecks.updateToMultipleChoice(args...)
      exerciseActionsAndChecks.pickMultipleChoice(args...)

  xit 'can update the multiple choice through key presses', ->
    Testing.renderComponent( Exercise, props: props ).then (args...) ->

      exerciseActionsAndChecks.enterFreeResponse(args...)
      exerciseActionsAndChecks.continueOnFreeResponse(args...)
      exerciseActionsAndChecks.updateToMultipleChoice(args...)
      exerciseActionsAndChecks.keyInMultipleChoice(args...)

  it 'renders a review if correct answer and feedback are available after multiple-choice submit', ->
    Testing.renderComponent( Exercise, props: props ).then (args...) ->

      exerciseActionsAndChecks.enterFreeResponse(args...)
      exerciseActionsAndChecks.continueOnFreeResponse(args...)
      exerciseActionsAndChecks.updateToMultipleChoice(args...)
      exerciseActionsAndChecks.pickMultipleChoice(args...)
      exerciseActionsAndChecks.setCorrectAnswerAndFeedback(args...)
      exerciseActionsAndChecks.checkCorrectAnswerAndFeedback(args...)

  it 'attempts next step on continue from review mode', ->
    Testing.renderComponent( Exercise, props: props ).then (args...) ->

      exerciseActionsAndChecks.enterFreeResponse(args...)
      exerciseActionsAndChecks.continueOnFreeResponse(args...)
      exerciseActionsAndChecks.updateToMultipleChoice(args...)
      exerciseActionsAndChecks.pickMultipleChoice(args...)
      exerciseActionsAndChecks.setCorrectAnswerAndFeedback(args...)
      exerciseActionsAndChecks.checkCorrectAnswerAndFeedback(args...)
      exerciseActionsAndChecks.continueToNextStep(args...)

  it 'attempts next step if correct answer and feedback are not available after multiple-choice submit', ->
    props.canReview = false

    Testing.renderComponent( Exercise, props: props ).then (args...) ->

      exerciseActionsAndChecks.enterFreeResponse(args...)
      exerciseActionsAndChecks.continueOnFreeResponse(args...)
      exerciseActionsAndChecks.updateToMultipleChoice(args...)
      exerciseActionsAndChecks.pickMultipleChoice(args...)
      exerciseActionsAndChecks.continueToNextStep(args...)


  it 'renders a free response if given', ->
    step.free_response = 'hi hi'

    Testing.renderComponent( Exercise, props: props ).then ({dom}) ->
      expect(dom.querySelector('.free-response').textContent).equals('hi hi')

  it 'updates free response when passed new ones', ->
    step.free_response = 'hi hi'

    Testing.renderComponent( Exercise, props: props ).then ({dom, wrapper}) ->
      step.free_response = 'bye bye'

      wrapper.setProps({step})
      expect(dom.querySelector('.free-response').textContent).equals('bye bye')

  it 'renders a chosen multiple choice if given', ->
    step.answer_id = CHOICES[0].id

    Testing.renderComponent( Exercise, props: props ).then ({dom}) ->
      expect(dom.querySelector('.answer-checked').textContent).equals(CHOICES[0].content_html)

  it 'updates chosen answer when passed in updates', ->
    step.answer_id = CHOICES[0].id

    Testing.renderComponent( Exercise, props: props ).then ({dom, wrapper}) ->
      step.answer_id = CHOICES[2].id
      # something weird is happening, the new property seems to force the component to notice it's receiving new props.
      wrapper.setProps({step, hack: ''})
      expect(dom.querySelector('.answer-checked').textContent).equals(CHOICES[2].content_html)
