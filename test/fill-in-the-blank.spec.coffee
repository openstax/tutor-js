{AnswerStore} = require '../src/flux/answer'
Components = require '../src/components'

React = require 'react/addons'
{TestUtils} = React.addons
{expect} = require 'chai'


# Example of a fleshed-out question:
#
# format: 'fill-in-the-blank'
# id: 'QUESTION_ID'
# stem: '[QUESTION_STEM_WITH_A_BLANK____]'
# answer: 'paris'
# correct: 'Paris'



describe 'fill-in-the-blank', ->
  beforeEach ->
    @question =
      format: 'fill-in-the-blank'
      id: 'QUESTION_ID-fill-in-the-blank'
      stem: '[QUESTION_STEM] with a blank ____ [STEM_AFTER_BLANK]'

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

    it 'renders with an input box in the stem', ->
      text = @component.getDOMNode().textContent
      expect(text).to.contain('[QUESTION_STEM]')
      expect(text).to.not.contain('____')
      expect(text).to.contain('[STEM_AFTER_BLANK]')

    it 'has an input box in the stem', ->
      expect(@querySelectorAll('.stem input[type="text"]')).to.have.length(1)

    it 'sets the answer when text is entered', ->
      expect(AnswerStore.getAnswer(@question)).to.not.exist
      input = @querySelector('.stem input[type="text"]')
      # Enter "paris"
      input.value = 'paris'
      input.onchange()
      expect(AnswerStore.getAnswer(@question)).to.equal('paris')
      # Remove "paris"
      input.value = ''
      input.onchange()
      expect(AnswerStore.getAnswer(@question)).to.not.exist

  describe 'with an answer', ->
    beforeEach ->
      @question.answer = 'paris'
      @render()

    it 'no longer has an input box', ->
      expect(@querySelector('.stem input[type="text"]')).to.not.exist
      text = @component.getDOMNode().textContent
      expect(text).to.contain('paris')

  describe 'with the correct answer', ->

    it 'shows the "correct" option when there is one answer', ->
      @question.answer = 'Paris'
      @question.correct = 'Paris'
      @render()
      expect(@querySelector('.question.answered .stem .correct')).to.exist
      expect(@querySelector('.question.answered .stem .incorrect')).to.not.exist

  describe 'with an incorrect answer', ->
    it 'shows the correct and incorrect answers', ->
      @question.answer = 'houston'
      @question.correct = 'paris'
      @render()
      expect(@querySelector('.question.answered .stem .incorrect')).to.exist
      expect(@querySelector('.question.answered .stem .missed')).to.exist
