{Testing, expect, sinon, _, ReactTestUtils} = require 'shared/specs/helpers'

Question = require 'components/question'
STEP = require '../exercise/step-data'

describe 'Question Component', ->
  props = null

  beforeEach ->
    props =
      model: STEP.content.questions[0]
      onChange: sinon.spy()
      type: 'student'

  it 'renders answers', ->
    Testing.renderComponent( Question, props: props ).then ({dom}) ->
      answers = _.pluck dom.querySelectorAll('.answers-answer .answer-content'), 'textContent'
      expect(answers).to.deep.equal(['solid', 'liquid', 'gas', 'plasma'])

  it 'highlights when answer is clicked', (done) ->
    Testing.renderComponent( Question, props: props ).then ({dom}) =>
      answer = dom.querySelectorAll('.answers-answer')[1]
      input = answer.querySelector('input')
      expect(answer.classList.contains('answer-checked')).to.be.false
      ReactTestUtils.Simulate.change(input, target: {checked: true})
      Testing.actions.click(input)
      _.defer =>
        expect(props.onChange).to.have.been.called
        expect(answer.classList.contains('answer-checked')).to.be.true
        done()

  it 'renders the context when given', ->
    props.context = STEP.context
    Testing.renderComponent( Question, props: props ).then ({dom}) ->
      expect(dom.querySelector('.question-context').textContent).to.have.string('Water is very important for life')
