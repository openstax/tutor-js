AnswerStore = require '../src/answer-store'
Components = require '../src/components'

React = require 'react/addons'
{TestUtils} = React.addons
{expect} = require 'chai'


describe 'multiple-choice', ->
  beforeEach ->
    @document.body.innerHTML = ''
    @question =
      id: 'QUESTION_ID'
      stem: '[QUESTION_STEM]'
      answers: [
        { id: 'option1', value: '[OPTION_1]' }
        { id: 'option2', value: '[OPTION_2]' }
      ]

    @type = Components.getQuestionType('multiple-choice')

    # Helper
    @querySelector = (selector) ->
      @component.getDOMNode().querySelector(selector)

  describe 'simple', ->
    beforeEach ->
      node = @type {config: @question}
      @component = React.renderComponent(node, @document.body)

    it 'renders with 2 options', ->
      html = @component.getDOMNode().innerHTML
      expect(html).to.contain('[QUESTION_STEM]')
      expect(html).to.contain('[OPTION_1]')
      expect(html).to.contain('[OPTION_2]')

    it 'has radio options', ->
      inputs = TestUtils.scryRenderedDOMComponentsWithTag(@component, 'input')
      expect(inputs).to.have.length(2)

    it 'sets the answer when a radio is clicked', ->
      expect(AnswerStore.getAnswer(@question)).to.not.exist
      inputs = TestUtils.scryRenderedDOMComponentsWithTag(@component, 'input')
      TestUtils.Simulate.change(inputs[0])
      expect(AnswerStore.getAnswer(@question)).to.equal('option1')
      TestUtils.Simulate.change(inputs[1])
      expect(AnswerStore.getAnswer(@question)).to.equal('option2')

  describe 'with an answer', ->
    beforeEach ->
      @question.answer = 'option1'
      node = @type {config: @question}
      @component = React.renderComponent(node, @document.body)

    it 'no longer has radio options', ->
      inputs = TestUtils.scryRenderedDOMComponentsWithTag(@component, 'input')
      expect(inputs).to.have.length(0)

  describe 'with a correct answer', ->
    beforeEach ->
      @question.answer = 'option1'
      @question.correct = 'option1'
      node = @type {config: @question}
      @component = React.renderComponent(node, @document.body)

    it 'has a "correct" class on the option', ->
      expect(@querySelector('.question.answered .option.correct')).to.exist
      expect(@querySelector('.question.answered .option.incorrect')).to.not.exist

  describe '2 options with an incorrect answer', ->
    beforeEach ->
      @question.answer = 'option1'
      @question.correct = 'option2'
      node = @type {config: @question}
      @component = React.renderComponent(node, @document.body)

    it 'does NOT have a "correct" or "missed" class on the correct option', ->
      expect(@querySelector('.question.answered .option.incorrect')).to.exist
      expect(@querySelector('.question.answered .option.correct')).to.not.exist
      expect(@querySelector('.question.answered .option.missed')).to.not.exist

  describe '3 options with an incorrect answer', ->
    beforeEach ->
      @question.answers.push {id: 'option3', value: '[OPTION_3]'}
      @question.answer = 'option1'
      @question.correct = 'option2'
      node = @type {config: @question}
      @component = React.renderComponent(node, @document.body)

    it 'DOES have a "missed" class on the correct option', ->
      expect(@querySelector('.question.answered .option.incorrect')).to.exist
      expect(@querySelector('.question.answered .option.missed')).to.exist
