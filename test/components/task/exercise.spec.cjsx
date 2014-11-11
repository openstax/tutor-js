$ = require 'jquery'
{expect} = require 'chai'

React = require 'react'
{TestUtils} = require('react/addons').addons

{Exercise, getQuestionType} = require '../../../src/components/exercise'
{AnswerActions, AnswerStore} = require '../../../src/flux/answer'

describe 'Exercise Task', ->
  it 'should render an Exercise with 0 questions', ->
    config =
      content:
        background: 'EXERCISE_TEXT'
        questions: []

    html = React.renderComponentToString(<Exercise config={config} />)
    $node = $("<div id='wrapper'>#{html}</div>")

    # Verify the node has the correct elements
    expect($node.find('.exercise')).to.have.length(1)
    expect($node.find('.background')).to.have.length(1)
    expect($node.find('.background').text()).to.equal('EXERCISE_TEXT')
    expect($node.find('.question')).to.have.length(0)


  describe 'Short Answer Question', ->
    it 'should render an Exercise with a short-answer question', ->
      config =
        content:
          background: 'EXERCISE_TEXT'
          questions: [
            {
              id: '123'
              format: 'short-answer'
              stem: 'QUESTION_STEM'
            }
          ]

      html = React.renderComponentToString(<Exercise config={config} />)
      $node = $("<div id='wrapper'>#{html}</div>")

      # Verify the node has the correct elements
      expect($node.find('.exercise')).to.have.length(1)
      expect($node.find('.exercise > .background')).to.have.length(1)
      expect($node.find('.exercise > .background').text()).to.equal('EXERCISE_TEXT')
      expect($node.find('.question > .stem')).to.have.length(1)
      expect($node.find('.question > .stem').text()).to.equal('QUESTION_STEM')


describe 'Question Types', ->
  afterEach ->
    AnswerActions.reset()

  describe 'short-answer', ->
    it 'should render the question', ->
      config =
        id: '123'
        format: 'short-answer'
        stem: 'QUESTION_STEM'

      Type = getQuestionType('short-answer')
      html = React.renderComponentToString(<Type config={config} />)
      $node = $("<div id='wrapper'>#{html}</div>")

      # Verify the node has the correct elements
      expect($node.find('.question > .stem')).to.have.length(1)
      expect($node.find('.question > .stem').text()).to.equal('QUESTION_STEM')

    it 'should trigger a change in the AnswerStore', ->
      config =
        id: '123'
        format: 'short-answer'
        stem: 'QUESTION_STEM'

      Type = getQuestionType('short-answer')
      $node = $("<div id='wrapper'></div>")
      React.renderComponent <Type config={config} />, $node[0]

      input = $node.find('.question input[type="text"]')[0]

      input.value = 'ANSWER_TEXT'
      React.addons.TestUtils.Simulate.change(input)
      # React.addons.TestUtils.Simulate.keyDown(node, {key: "Enter"});

      expect(AnswerStore.getAnswer(config)).to.equal('ANSWER_TEXT')


  describe 'multiple-choice', ->
    it 'should render the question', ->
      config =
        id: '123'
        format: 'multiple-choice'
        stem: 'QUESTION_STEM'
        answers: [
          {id:'id1',value:'VALUE_1',content:'OPTION_1'}
          {id:'id2',value:'VALUE_2',content:'OPTION_2'}
        ]

      Type = getQuestionType('multiple-choice')
      html = React.renderComponentToString(<Type config={config} />)
      $node = $("<div id='wrapper'>#{html}</div>")

      # Verify the node has the correct elements
      expect($node.find('.question > .stem')).to.have.length(1)
      expect($node.find('.question > .stem').text()).to.equal('QUESTION_STEM')
      expect($node.find('.question > .options > .option')).to.have.length(2)
      expect($node.find('.question > .options > .option > label').first().text()).to.equal('a) OPTION_1')
      expect($node.find('.question > .options > .option > label').last().text()).to.equal('b) OPTION_2')


    it 'should trigger a change in the AnswerStore', ->
      config =
        id: '123'
        format: 'multiple-choice'
        stem: 'QUESTION_STEM'
        answers: [
          {id:'OPTION_1_ID',value:'VALUE_1',content:'OPTION_1'}
          {id:'OPTION_2_ID',value:'VALUE_2',content:'OPTION_2'}
        ]

      Type = getQuestionType('multiple-choice')
      $node = $("<div id='wrapper'></div>")
      React.renderComponent(<Type config={config} />, $node[0])

      [radio1, radio2] = $node.find('.option label input[type="radio"]')
      # radio1.checked = true
      React.addons.TestUtils.Simulate.change(radio1)

      expect(AnswerStore.getAnswer(config)).to.equal('OPTION_1_ID')

      React.addons.TestUtils.Simulate.change(radio2)

      expect(AnswerStore.getAnswer(config)).to.equal('OPTION_2_ID')

    describe 'Render Math in various parts', ->
      INLINE_MATH = '<span data-math="\frac{3}{4}"></span>'
      it 'should render Math in the exercise.background', ->
        config =
          content:
            id: '123'
            background: INLINE_MATH
            questions: []

        $node = $("<div id='wrapper'></div>")
        React.renderComponent(<Exercise config={config} />, $node[0])
        expect($node.find('[data-math] > .katex')).to.have.length(1)


      it 'should render Math in the true-false.stem', ->
        config =
          type: 'true-false'
          stem: INLINE_MATH

        $node = $("<div id='wrapper'></div>")
        Type = getQuestionType(config.type)
        React.renderComponent(<Type config={config} />, $node[0])
        expect($node.find('[data-math] > .katex')).to.have.length(1)


      it 'should render Math in the multiple-choice.stem', ->
        config =
          type: 'multiple-choice'
          stem: INLINE_MATH
          answers: []

        $node = $("<div id='wrapper'></div>")
        Type = getQuestionType(config.type)
        React.renderComponent(<Type config={config} />, $node[0])
        expect($node.find('[data-math] > .katex')).to.have.length(1)

      it 'should render Math in the multiple-choice.answer', ->
        config =
          type: 'multiple-choice'
          stem: ''
          answers: [{
            id: 'answer1'
            content: INLINE_MATH
          }]

        $node = $("<div id='wrapper'></div>")
        Type = getQuestionType(config.type)
        React.renderComponent(<Type config={config} />, $node[0])
        expect($node.find('[data-math] > .katex')).to.have.length(1)
