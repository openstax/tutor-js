{Testing, expect, sinon, _} = require 'test/helpers'

Exercise = require 'components/exercise'
STEP = require './step-data'

describe 'Exercise Component', ->

  beforeEach ->
    @props =
      id: '1'
      taskId: '1'
      onStepCompleted: sinon.spy()
      onNextStep: sinon.spy()
      getCurrentPanel: -> 'free-response'
      step: STEP

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


  it 'renders with css classes', ->
    Testing.renderComponent( Exercise, props: @props ).then ({dom, wrapper}) ->
      expect(dom.querySelector(
        '.openstax-exercise-card .exercise-free-response'
      )).not.to.be.null
