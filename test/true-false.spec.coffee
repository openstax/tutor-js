AnswerStore = require '../src/answer-store'
Components = require '../src/components'

React = require 'react/addons'
{TestUtils} = React.addons
{expect} = require 'chai'


# Example of a fleshed-out question:
#
# format: 'true-false'
# id: 'QUESTION_ID'
# stem: '[QUESTION_STEM]'
# answer: false
# correct: false



describe 'true-false', ->
  beforeEach ->
    @question =
      id: 'QUESTION_ID-true-false'
      stem: '[QUESTION_STEM]'

    @type = Components.getQuestionType('true-false')

    # Helpers
    @querySelector = (selector) =>
      @component.getDOMNode().querySelector(selector)
    @querySelectorAll = (selector) =>
      @component.getDOMNode().querySelectorAll(selector)
    @render = =>
      node = @type {config: @question}
      @component = React.renderComponent(node, @document.body)


  describe 'simple', ->
    beforeEach ->
      @render()

    it 'renders with 2 options', ->
      text = @component.getDOMNode().textContent
      expect(text).to.contain('[QUESTION_STEM]')
      expect(text).to.contain('True')
      expect(text).to.contain('False')

    it 'has radio options', ->
      expect(@querySelectorAll('input[type="radio"]')).to.have.length(2)

    it 'sets the answer when a radio is clicked', ->
      expect(AnswerStore.getAnswer(@question)).to.not.exist
      inputs = TestUtils.scryRenderedDOMComponentsWithTag(@component, 'input')
      # select 1
      TestUtils.Simulate.change(inputs[0])
      expect(AnswerStore.getAnswer(@question)).to.equal(true)
      # select 2
      TestUtils.Simulate.change(inputs[1])
      expect(AnswerStore.getAnswer(@question)).to.equal(false)
      # select 1 again
      TestUtils.Simulate.change(inputs[0])
      expect(AnswerStore.getAnswer(@question)).to.equal(true)

  describe 'with an answer', ->
    beforeEach ->
      @question.answer = false
      @render()

    it 'no longer has radio options', ->
      inputs = TestUtils.scryRenderedDOMComponentsWithTag(@component, 'input')
      expect(inputs).to.have.length(0)

  describe 'with the correct answer', ->

    it 'shows the "correct" option when there is one answer', ->
      @question.answer = false
      @question.correct = false
      @render()
      expect(@querySelector('.question.answered .option.correct')).to.exist
      expect(@querySelector('.question.answered .option.incorrect')).to.not.exist

  describe 'with an incorrect answer', ->
    it 'DOES have a "missed" class on the correct option', ->
      @question.answer = true
      @question.correct = false
      @render()
      expect(@querySelector('.question.answered .option.incorrect')).to.exist
      expect(@querySelector('.question.answered .option.missed')).to.not.exist
