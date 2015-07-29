{Testing, expect, sinon, _, ReactTestUtils} = require './helpers/component-testing'

Question = require '../../src/components/question'

STEP = (require '../../api/tasks/4.json').steps[0]
MODEL = STEP.content.questions[0]

describe 'Question Component', ->

  beforeEach ->
    @props = {
      exercise_uid: '123@4'
      model: _.clone(MODEL)
    }

  it 'displays the exercise uid', ->
    Testing.renderComponent( Question, props: @props ).then ({dom}) =>
      expect(dom.querySelector('.exercise-uid').textContent).to.equal(@props.exercise_uid)

  it 'renders the stem html', ->
    Testing.renderComponent( Question, props: @props ).then ({dom}) ->
      expect(dom.querySelector('.question-stem').textContent).to.equal('What is 2+2?')

  it 'calls the onChange callback', ->
    @props.onChange = sinon.spy()
    Testing.renderComponent( Question, props: @props ).then ({dom}) =>
      ReactTestUtils.Simulate.change(dom.querySelector("[id='987-option-0']"))
      expect(@props.onChange).to.have.been.calledWith(content_html: '22', id: 'id1')

  it 'indicates when the answer is correct', ->
    @props.answer_id = @props.correct_answer_id = STEP.correct_answer_id
    Testing.renderComponent( Question, props: @props ).then ({dom}) ->
      correct = dom.querySelector('.answer-correct')
      expect(correct).not.to.be.null
      expect(correct.textContent).to.equal( _.findWhere(MODEL.answers, id: STEP.correct_answer_id).content_html )
