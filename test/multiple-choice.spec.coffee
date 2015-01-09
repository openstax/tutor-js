{AnswerStore} = require '../src/flux/answer'
Components = require '../src/components'

React = require 'react/addons'
{TestUtils} = React.addons
{expect} = require 'chai'

# Example of a fleshed-out question:
#
# format: 'multiple-choice'
# id: 'QUESTION_ID'
# stem: '[QUESTION_STEM]'
# answers: [
#   { id: 'option1', value: '[OPTION_1]' }
#   { id: 'option2', value: '[OPTION_2]' }
#   { id: 'option3', value: ['option1', 'option2'] }
# ]
# answer: 'option3'
# correct: 'option3'


describe 'multiple-choice', ->
  beforeEach ->
    @question =
      format: 'multiple-choice'
      id: 'QUESTION_ID'
      stem: '[QUESTION_STEM]'
      answers: [
        { id: 'option1', value: '[OPTION_1]' }
        { id: 'option2', value: '[OPTION_2]' }
        { id: 'option3', value: ['option1', 'option2'] }
      ]

    # Helpers
    @querySelector = (selector) =>
      @component.getDOMNode().querySelector(selector)
    @querySelectorAll = (selector) =>
      @component.getDOMNode().querySelectorAll(selector)
    @render = =>
      node = Components.getQuestionType(@question.format) {config: @question}
      @component = React.renderComponent(node, @document.body)


  describe 'simple', ->
    beforeEach ->
      @render()

    it 'renders with 3 options', ->
      text = @component.getDOMNode().textContent
      expect(text).to.contain('[QUESTION_STEM]')
      expect(text).to.contain('[OPTION_1]')
      expect(text).to.contain('[OPTION_2]')
      expect(text).to.contain('(a)(b)')

    it 'has radio options', ->
      expect(@querySelectorAll('input[type="radio"]')).to.have.length(3)

    it 'sets the answer when a radio is clicked', ->
      expect(AnswerStore.getAnswer(@question)).to.not.exist
      inputs = TestUtils.scryRenderedDOMComponentsWithTag(@component, 'input')
      TestUtils.Simulate.change(inputs[0])
      expect(AnswerStore.getAnswer(@question)).to.equal('option1')
      TestUtils.Simulate.change(inputs[2])
      expect(AnswerStore.getAnswer(@question)).to.equal('option3')

  describe 'with an answer', ->
    beforeEach ->
      @question.answer = 'option1'
      @render()

    it 'no longer has radio options', ->
      expect(@querySelectorAll('input[type="radio"]')).to.have.length(0)

  describe 'with a correct answer', ->
    beforeEach ->
      @question.answer = 'option1'
      @question.correct = 'option1'
      @render()

    it 'has a "correct" class on the option', ->
      expect(@querySelector('.question.answered .option.correct')).to.exist
      expect(@querySelector('.question.answered .option.incorrect')).to.not.exist

  describe '3 options with an incorrect answer', ->
    beforeEach ->
      @question.answer = 'option1'
      @question.correct = 'option2'
      @render()

    it 'DOES have a "missed" class on the correct option', ->
      expect(@querySelector('.question.answered .option.incorrect')).to.exist
      expect(@querySelector('.question.answered .option.missed')).to.exist

  describe '2 options with an incorrect answer', ->
    beforeEach ->
      @question.answers.pop()
      @question.answer = 'option1'
      @question.correct = 'option2'
      @render()

    it 'does NOT have a "correct" class on the correct option', ->
      expect(@querySelector('.question.answered .option.incorrect'), 'incorrect').to.exist
      expect(@querySelector('.question.answered .option.correct'), 'correct').to.not.exist
