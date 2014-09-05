AnswerStore = require '../src/answer-store'
Components = require '../src/components'

React = require 'react/addons'
{TestUtils} = React.addons
{expect} = require 'chai'


# Example of a fleshed-out question:
#
# format: 'multiple-select'
# id: 'QUESTION_ID'
# stem: '[QUESTION_STEM]'
# answers: [
#   { id: 'option1', value: '[OPTION_1]' }
#   { id: 'option2', value: '[OPTION_2]' }
#   { id: 'option3', value: ['option1', 'option2'] }
# ]
# answer: ['option1', 'option2']
# correct: 'option3'



describe 'multiple-select', ->
  beforeEach ->
    @document.body.innerHTML = ''
    @question =
      id: 'QUESTION_ID-multiple-select'
      stem: '[QUESTION_STEM]'
      answers: [
        { id: 'option1', value: '[OPTION_1]' }
        { id: 'option2', value: '[OPTION_2]' }
        { id: 'option3', value: ['option1', 'option2'] }
      ]

    @type = Components.getQuestionType('multiple-select')

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
      expect(text).to.contain('[OPTION_1]')
      expect(text).to.contain('[OPTION_2]')

    it 'has checkbox options', ->
      expect(@querySelectorAll('input[type="checkbox"]')).to.have.length(2)

    it 'sets the answer when a checkbox is clicked', ->
      expect(AnswerStore.getAnswer(@question)).to.not.exist
      inputs = TestUtils.scryRenderedDOMComponentsWithTag(@component, 'input')
      # select 1
      TestUtils.Simulate.change(inputs[0])
      expect(AnswerStore.getAnswer(@question)).to.deep.equal(['option1'])
      # select 2
      TestUtils.Simulate.change(inputs[1])
      expect(AnswerStore.getAnswer(@question)).to.deep.equal(['option1', 'option2'])
      # unselect 1
      TestUtils.Simulate.change(inputs[0])
      expect(AnswerStore.getAnswer(@question)).to.deep.equal(['option2'])

  describe 'with an answer', ->
    beforeEach ->
      @question.answer = 'option1'
      @render()

    it 'no longer has radio options', ->
      inputs = TestUtils.scryRenderedDOMComponentsWithTag(@component, 'input')
      expect(inputs).to.have.length(0)

  describe 'with the correct answer', ->

    it 'shows the "correct" option when there is one answer', ->
      @question.answer = 'option1'
      @question.correct = 'option1'
      @render()
      expect(@querySelector('.question.answered .option.correct')).to.exist
      expect(@querySelector('.question.answered .option.incorrect')).to.not.exist

  describe 'with an incorrect answer', ->
    it 'shows the "missed" answer when it is partially correct', ->
      @question.answer = ['option1']
      @question.correct = 'option3' # Note: This is NEVER an array.
      @render()
      expect(@querySelector('.question.answered .option.correct')).to.exist
      expect(@querySelector('.question.answered .option.missed')).to.exist


    it 'DOES have a "missed" class on the correct option', ->
      @question.answer = ['option1']
      @question.correct = 'option2'
      @render()
      expect(@querySelector('.question.answered .option.incorrect')).to.exist
      expect(@querySelector('.question.answered .option.missed')).to.exist
