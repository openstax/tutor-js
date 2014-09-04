require 'coffee-react/register'

jsdom = require 'jsdom'
# move into beforeEach and flip global.window.close on to improve
# cleaning of environment during each test and prevent memory leaks
document = jsdom.jsdom('<html><body></body></html>', jsdom.level(1, 'core'))

beforeEach ->
    @document = document
    global.document = @document
    global.window = @document.parentWindow

afterEach ->
    # setting up and closing a "window" every run is really heavy
    # it prevents contamination between tests and prevents memory leaks
    # global.window.close()

AnswerStore = require '../src/answer-store'
Components = require '../src/components'

React = require 'react/addons'
{TestUtils} = React.addons

chai = require 'chai'
expect = chai.expect


describe 'Question Types', ->

  # 'multiple-choice'
  # 'multiple-select'
  # 'short-answer'
  # 'true-false'
  # 'fill-in-the-blank'
  # 'matching'

  describe 'multiple-choice', ->
      beforeEach ->
        document.body.innerHTML = ''
        @question =
          id: 'QUESTION_ID'
          stem: '[QUESTION_STEM]'
          answers: [
            { id: 'option1', value: '[OPTION_1]' }
            { id: 'option2', value: '[OPTION_2]' }
          ]

        Type = Components.getQuestionType('multiple-choice')
        node = Type {config: @question}
        @component = React.renderComponent(node, document.body)

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
        document.body.innerHTML = ''
        @question =
          id: 'QUESTION_ID'
          stem: '[QUESTION_STEM]'
          answers: [
            { id: 'option1', value: '[OPTION_1]' }
            { id: 'option2', value: '[OPTION_2]' }
          ]
          answer: 'option1'

        Type = Components.getQuestionType('multiple-choice')
        node = Type {config: @question}
        @component = React.renderComponent(node, document.body)

      it 'no longer has radio options', ->
        inputs = TestUtils.scryRenderedDOMComponentsWithTag(@component, 'input')
        expect(inputs).to.have.length(0)


console.log Object.keys(TestUtils)
